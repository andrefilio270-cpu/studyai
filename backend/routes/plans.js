const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const pool = require('../db/connection');

const PLANS = {
  semanal: { nome: 'Semanal', preco: 9.90, dias: 7 },
  mensal:  { nome: 'Mensal',  preco: 29.90, dias: 30 },
  anual:   { nome: 'Anual',   preco: 199.90, dias: 365 }
};

// Listar planos disponíveis
router.get('/', (req, res) => {
  res.json(PLANS);
});

// Simular upgrade de plano (sem gateway real)
router.post('/upgrade', authMiddleware, async (req, res) => {
  const { plano } = req.body;
  if (!PLANS[plano]) return res.status(400).json({ error: 'Plano inválido.' });

  const expira = new Date();
  expira.setDate(expira.getDate() + PLANS[plano].dias);

  try {
    const { rows } = await pool.query(
      'UPDATE users SET plano=$1, plano_expira_em=$2, perguntas_usadas=0 WHERE id=$3 RETURNING id, nome, plano, plano_expira_em',
      [plano, expira, req.user.id]
    );
    res.json({ ok: true, user: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar plano.' });
  }
});

module.exports = router;
