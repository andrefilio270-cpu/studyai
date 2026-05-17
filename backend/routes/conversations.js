const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const pool = require('../db/connection');

// Auto-salvar conversa (upsert por session_id, mantém últimas 100)
router.post('/autosave', authMiddleware, async (req, res) => {
  const { session_id, professor_id, titulo, mensagens } = req.body;
  if (!session_id || !professor_id || !mensagens?.length) return res.status(400).json({ error: 'Dados insuficientes.' });

  try {
    const existe = await pool.query(
      'SELECT id FROM conversations WHERE session_id=$1 AND user_id=$2',
      [session_id, req.user.id]
    );

    let conv;
    if (existe.rows.length) {
      const { rows } = await pool.query(
        'UPDATE conversations SET mensagens=$1, titulo=$2, atualizado_em=NOW() WHERE session_id=$3 AND user_id=$4 RETURNING id',
        [JSON.stringify(mensagens), titulo || 'Sem título', session_id, req.user.id]
      );
      conv = rows[0];
    } else {
      const { rows } = await pool.query(
        'INSERT INTO conversations (user_id, professor_id, titulo, mensagens, session_id, is_auto, is_saved, atualizado_em) VALUES ($1,$2,$3,$4,$5,true,false,NOW()) RETURNING id',
        [req.user.id, professor_id, titulo || 'Sem título', JSON.stringify(mensagens), session_id]
      );
      conv = rows[0];

      // Mantém apenas as últimas 100 conversas auto-salvas por usuário
      await pool.query(`
        DELETE FROM conversations
        WHERE user_id=$1 AND is_auto=true AND is_saved=false AND id NOT IN (
          SELECT id FROM conversations WHERE user_id=$1 AND is_auto=true AND is_saved=false
          ORDER BY atualizado_em DESC LIMIT 100
        )
      `, [req.user.id]);
    }

    res.json({ ok: true, id: conv.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao auto-salvar.' });
  }
});

// Listar histórico (últimas 100 conversas automáticas)
router.get('/historico', authMiddleware, async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT id, professor_id, titulo, atualizado_em, jsonb_array_length(mensagens) as total_mensagens
      FROM conversations
      WHERE user_id=$1 AND is_auto=true
      ORDER BY atualizado_em DESC
      LIMIT 100
    `, [req.user.id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar histórico.' });
  }
});

// Salvar conversa
router.post('/save', authMiddleware, async (req, res) => {
  const { professor_id, titulo, mensagens } = req.body;
  if (!professor_id || !mensagens?.length) return res.status(400).json({ error: 'Dados insuficientes.' });

  try {
    const { rows } = await pool.query(
      'INSERT INTO conversations (user_id, professor_id, titulo, mensagens, is_saved) VALUES ($1,$2,$3,$4,true) RETURNING *',
      [req.user.id, professor_id, titulo || 'Sem título', JSON.stringify(mensagens)]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao salvar conversa.' });
  }
});

// Listar conversas salvas
router.get('/', authMiddleware, async (req, res) => {
  const { professor, busca } = req.query;
  let q = 'SELECT id, professor_id, titulo, criado_em, is_public, jsonb_array_length(mensagens) as total_mensagens FROM conversations WHERE user_id=$1 AND is_saved=true';
  const params = [req.user.id];

  if (professor) { params.push(professor); q += ` AND professor_id=$${params.length}`; }
  if (busca) { params.push(`%${busca}%`); q += ` AND titulo ILIKE $${params.length}`; }
  q += ' ORDER BY criado_em DESC';

  try {
    const { rows } = await pool.query(q, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar conversas.' });
  }
});

// Buscar conversa específica
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM conversations WHERE id=$1 AND user_id=$2',
      [req.params.id, req.user.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Conversa não encontrada.' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro interno.' });
  }
});

// Deletar conversa
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM conversations WHERE id=$1 AND user_id=$2', [req.params.id, req.user.id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Erro interno.' });
  }
});

// Tornar conversa pública
router.patch('/:id/public', authMiddleware, async (req, res) => {
  try {
    // Verifica plano
    const { rows: u } = await pool.query('SELECT plano FROM users WHERE id=$1', [req.user.id]);
    const user = u[0];
    if (!['mensal', 'anual'].includes(user.plano)) {
      return res.status(403).json({ error: 'Recurso disponível apenas para planos Mensal e Anual.' });
    }
    const { rows } = await pool.query(
      'UPDATE conversations SET is_public=true WHERE id=$1 AND user_id=$2 RETURNING *',
      [req.params.id, req.user.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Conversa não encontrada.' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro interno.' });
  }
});

module.exports = router;
