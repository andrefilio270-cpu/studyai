const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const authMiddleware = require('../middleware/auth');
const pool = require('../db/connection');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Preços por moeda em centavos (menor unidade de cada moeda)
const PLAN_PRICES = {
  BRL: { semanal: 990,   mensal: 2990,  anual: 19990, currency: 'brl' },
  USD: { semanal: 299,   mensal: 799,   anual: 4999,  currency: 'usd' },
  EUR: { semanal: 249,   mensal: 699,   anual: 4499,  currency: 'eur' },
  GBP: { semanal: 199,   mensal: 599,   anual: 3999,  currency: 'gbp' },
  CAD: { semanal: 399,   mensal: 1099,  anual: 6499,  currency: 'cad' },
  AUD: { semanal: 449,   mensal: 1299,  anual: 7499,  currency: 'aud' },
  MXN: { semanal: 5900,  mensal: 16900, anual: 99900, currency: 'mxn' },
  ARS: { semanal: 250000,mensal: 690000,anual:4490000, currency: 'ars' },
  CLP: { semanal: 249000,mensal: 699000,anual:4499000, currency: 'clp' },
  COP: { semanal:1290000,mensal:3590000,anual:22990000,currency:'cop' },
  PEN: { semanal: 1190,  mensal: 2990,  anual: 18990, currency: 'pen' },
  CHF: { semanal: 269,   mensal: 749,   anual: 4799,  currency: 'chf' },
  JPY: { semanal: 449,   mensal: 1290,  anual: 7990,  currency: 'jpy' },
  INR: { semanal: 24900, mensal: 64900, anual: 399900,currency: 'inr' },
};

const PLAN_NAMES = {
  pt: { semanal: 'Plano Semanal', mensal: 'Plano Mensal', anual: 'Plano Anual' },
  en: { semanal: 'Weekly Plan',   mensal: 'Monthly Plan', anual: 'Yearly Plan'  },
  es: { semanal: 'Plan Semanal',  mensal: 'Plan Mensual', anual: 'Plan Anual'   },
};

const PLAN_DAYS = { semanal: 7, mensal: 30, anual: 365 };

// Suporte a moedas sem decimais (zero-decimal currencies no Stripe)
const ZERO_DECIMAL = ['CLP', 'JPY'];

function getAmount(plano, currency) {
  const prices = PLAN_PRICES[currency] || PLAN_PRICES['USD'];
  const amount = prices[plano];
  // Moedas sem centavos já estão no valor correto
  return amount;
}

// POST /api/payments/checkout — cria sessão no Stripe
router.post('/checkout', authMiddleware, async (req, res) => {
  const { plano, currency = 'BRL', idioma = 'pt' } = req.body;
  if (!['semanal','mensal','anual'].includes(plano)) {
    return res.status(400).json({ error: 'Plano inválido.' });
  }

  const curr = PLAN_PRICES[currency] ? currency : 'USD';
  const amount = getAmount(plano, curr);
  const lang = ['pt','en','es'].includes(idioma) ? idioma : 'pt';
  const planName = (PLAN_NAMES[lang] || PLAN_NAMES.pt)[plano];
  const appUrl = process.env.APP_URL || 'http://localhost:3000';

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: curr.toLowerCase(),
          product_data: {
            name: `StudyAI — ${planName}`,
            description: `${PLAN_DAYS[plano]} dias de acesso ilimitado`,
            images: [],
          },
          unit_amount: amount,
        },
        quantity: 1,
      }],
      metadata: {
        user_id: String(req.user.id),
        plano,
        currency: curr,
      },
      success_url: `${appUrl}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/dashboard.html?upgrade=1`,
      locale: lang === 'en' ? 'en' : lang === 'es' ? 'es' : 'pt-BR',
    });

    res.json({ url: session.url, session_id: session.id });
  } catch (err) {
    console.error('Stripe error:', err.message);
    res.status(500).json({ error: 'Erro ao criar sessão de pagamento.' });
  }
});

// GET /api/payments/verify?session_id=xxx — verifica se pagamento foi concluído
router.get('/verify', authMiddleware, async (req, res) => {
  const { session_id } = req.query;
  if (!session_id) return res.status(400).json({ error: 'session_id obrigatório.' });

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (session.payment_status === 'paid' && session.metadata?.user_id === String(req.user.id)) {
      const { plano } = session.metadata;
      await activatePlan(req.user.id, plano);
      return res.json({ ok: true, plano });
    }
    res.json({ ok: false });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao verificar pagamento.' });
  }
});

// POST /api/payments/webhook — eventos do Stripe (assinatura necessária)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    if (webhookSecret && webhookSecret !== 'whsec_sua_chave_webhook_aqui') {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } else {
      // Modo desenvolvimento sem webhook secret
      event = JSON.parse(req.body);
    }
  } catch (err) {
    console.error('Webhook signature error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    if (session.payment_status === 'paid') {
      const { user_id, plano } = session.metadata || {};
      if (user_id && plano) {
        await activatePlan(parseInt(user_id), plano);
        console.log(`Plano ${plano} ativado para user ${user_id} via webhook`);
      }
    }
  }

  res.json({ received: true });
});

async function activatePlan(userId, plano) {
  const dias = PLAN_DAYS[plano];
  if (!dias) return;
  const expira = new Date();
  expira.setDate(expira.getDate() + dias);
  await pool.query(
    'UPDATE users SET plano=$1, plano_expira_em=$2, perguntas_usadas=0 WHERE id=$3',
    [plano, expira, userId]
  );
}

// Handler separado para o webhook (body raw)
const webhookHandler = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;
  try {
    if (webhookSecret && !webhookSecret.includes('sua_chave')) {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } else {
      event = JSON.parse(req.body.toString());
    }
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    if (session.payment_status === 'paid') {
      const { user_id, plano } = session.metadata || {};
      if (user_id && plano) await activatePlan(parseInt(user_id), plano);
    }
  }
  res.json({ received: true });
};

module.exports = router;
module.exports.webhookHandler = webhookHandler;
