const express = require('express');
const router = express.Router();
const pool = require('../db/connection');
const authMiddleware = require('../middleware/auth');

// Registrar visita (chamado pelo frontend)
router.post('/pageview', async (req, res) => {
  const { path, referrer } = req.body;
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.ip;
  const user_agent = req.headers['user-agent'];
  try {
    await pool.query(
      'INSERT INTO page_views (path, referrer, user_agent, ip) VALUES ($1,$2,$3,$4)',
      [path || '/', referrer || '', user_agent, ip]
    );
    res.json({ ok: true });
  } catch { res.json({ ok: false }); }
});

// Registrar evento (cadastro, login, pergunta, etc)
router.post('/evento', async (req, res) => {
  const { tipo, dados } = req.body;
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.ip;
  try {
    await pool.query(
      'INSERT INTO eventos (tipo, dados, ip) VALUES ($1,$2,$3)',
      [tipo, JSON.stringify(dados || {}), ip]
    );
    res.json({ ok: true });
  } catch { res.json({ ok: false }); }
});

// Dashboard de analytics (só admin)
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const hoje = new Date();
    hoje.setHours(0,0,0,0);
    const semana = new Date(hoje);
    semana.setDate(semana.getDate() - 7);

    const [
      totalVisitas, visitasHoje, visitasSemana,
      topPages, topReferrers,
      totalCadastros, cadastrosHoje,
      totalPerguntas, perguntasHoje,
      totalPagamentos
    ] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM page_views'),
      pool.query('SELECT COUNT(*) FROM page_views WHERE criado_em >= $1', [hoje]),
      pool.query('SELECT COUNT(*) FROM page_views WHERE criado_em >= $1', [semana]),
      pool.query('SELECT path, COUNT(*) as total FROM page_views GROUP BY path ORDER BY total DESC LIMIT 10'),
      pool.query("SELECT COALESCE(NULLIF(referrer,''), 'direto') as ref, COUNT(*) as total FROM page_views GROUP BY ref ORDER BY total DESC LIMIT 10"),
      pool.query('SELECT COUNT(*) FROM users'),
      pool.query('SELECT COUNT(*) FROM users WHERE criado_em >= $1', [hoje]),
      pool.query('SELECT COUNT(*) FROM conversations'),
      pool.query('SELECT COUNT(*) FROM conversations WHERE criado_em >= $1', [hoje]),
      pool.query("SELECT COUNT(*) FROM eventos WHERE tipo = 'pagamento_confirmado'"),
    ]);

    res.json({
      visitas: {
        total: parseInt(totalVisitas.rows[0].count),
        hoje: parseInt(visitasHoje.rows[0].count),
        semana: parseInt(visitasSemana.rows[0].count),
      },
      top_pages: topPages.rows,
      top_referrers: topReferrers.rows,
      usuarios: {
        total: parseInt(totalCadastros.rows[0].count),
        hoje: parseInt(cadastrosHoje.rows[0].count),
      },
      conversas: {
        total: parseInt(totalPerguntas.rows[0].count),
        hoje: parseInt(perguntasHoje.rows[0].count),
      },
      pagamentos: parseInt(totalPagamentos.rows[0].count),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar analytics.' });
  }
});

module.exports = router;
