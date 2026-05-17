const express = require('express');
const router = express.Router();
const Anthropic = require('@anthropic-ai/sdk');
const authMiddleware = require('../middleware/auth');
const pool = require('../db/connection');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function moderateContent(content) {
  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 100,
      system: 'Você é um moderador de uma plataforma educacional para estudantes. Analise a mensagem e responda APENAS com JSON no formato: { "approved": true/false, "reason": "motivo se reprovado" }. Aprove mensagens sobre: dúvidas escolares, dicas de estudo, resumos, experiências de aprendizado, encorajamento. Reprove mensagens com: conteúdo fora de estudos, ofensas, spam, links suspeitos, política, religião, conteúdo adulto ou qualquer assunto não relacionado à educação.',
      messages: [{ role: 'user', content }]
    });
    const text = response.content[0].text.trim();
    const json = JSON.parse(text.replace(/```json?/g, '').replace(/```/g, '').trim());
    return json;
  } catch {
    return { approved: true };
  }
}

// Listar posts públicos
router.get('/', async (req, res) => {
  const { materia } = req.query;
  let q = `
    SELECT pp.*, u.nome as autor_nome, u.plano as autor_plano
    FROM public_posts pp
    JOIN users u ON u.id = pp.user_id
    WHERE pp.is_approved = true
  `;
  const params = [];
  if (materia) { params.push(materia); q += ` AND pp.materia_tag=$${params.length}`; }
  q += ' ORDER BY pp.criado_em DESC LIMIT 50';

  try {
    const { rows } = await pool.query(q, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar posts.' });
  }
});

// Criar post
router.post('/', authMiddleware, async (req, res) => {
  const { conteudo, materia_tag } = req.body;
  if (!conteudo?.trim()) return res.status(400).json({ error: 'Conteúdo obrigatório.' });

  try {
    // Verifica ban
    const { rows: u } = await pool.query('SELECT * FROM users WHERE id=$1', [req.user.id]);
    const user = u[0];

    if (user.is_banned && user.banned_until && new Date(user.banned_until) > new Date()) {
      return res.status(403).json({
        error: `Sua conta está suspensa até ${new Date(user.banned_until).toLocaleDateString('pt-BR')}. Motivo: 5 violações de conduta.`,
        banned: true
      });
    }

    // Remove ban expirado
    if (user.is_banned && (!user.banned_until || new Date(user.banned_until) <= new Date())) {
      await pool.query('UPDATE users SET is_banned=false, banned_until=NULL, violations_count=0 WHERE id=$1', [user.id]);
    }

    // Moderação por IA
    const modResult = await moderateContent(conteudo);

    if (!modResult.approved) {
      // Registra violação
      const violations = user.violations_count + 1;
      await pool.query('UPDATE users SET violations_count=$1 WHERE id=$2', [violations, user.id]);
      await pool.query(
        'INSERT INTO moderation_logs (user_id, conteudo_reprovado, motivo) VALUES ($1,$2,$3)',
        [user.id, conteudo, modResult.reason]
      );

      if (violations >= 5) {
        const bannedUntil = new Date();
        bannedUntil.setDate(bannedUntil.getDate() + 30);
        await pool.query('UPDATE users SET is_banned=true, banned_until=$1 WHERE id=$2', [bannedUntil, user.id]);
        return res.status(403).json({
          error: `Sua conta foi suspensa por 30 dias por 5 violações de conduta.`,
          banned: true
        });
      }

      return res.status(422).json({
        error: `Sua mensagem foi removida pois não está relacionada a estudos. Violação ${violations}/5.`,
        violation: violations
      });
    }

    const { rows } = await pool.query(
      'INSERT INTO public_posts (user_id, conteudo, materia_tag, is_approved) VALUES ($1,$2,$3,true) RETURNING *',
      [user.id, conteudo, materia_tag || null]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao publicar.' });
  }
});

// Curtir post
router.post('/:id/like', authMiddleware, async (req, res) => {
  const postId = req.params.id;
  try {
    const exists = await pool.query('SELECT 1 FROM post_likes WHERE user_id=$1 AND post_id=$2', [req.user.id, postId]);
    if (exists.rows.length) {
      await pool.query('DELETE FROM post_likes WHERE user_id=$1 AND post_id=$2', [req.user.id, postId]);
      await pool.query('UPDATE public_posts SET curtidas = curtidas - 1 WHERE id=$1', [postId]);
      return res.json({ liked: false });
    }
    await pool.query('INSERT INTO post_likes VALUES ($1,$2)', [req.user.id, postId]);
    await pool.query('UPDATE public_posts SET curtidas = curtidas + 1 WHERE id=$1', [postId]);
    res.json({ liked: true });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao curtir.' });
  }
});

// Responder post
router.post('/:id/reply', authMiddleware, async (req, res) => {
  const { conteudo } = req.body;
  if (!conteudo?.trim()) return res.status(400).json({ error: 'Resposta vazia.' });
  try {
    const mod = await moderateContent(conteudo);
    if (!mod.approved) return res.status(422).json({ error: 'Resposta não relacionada a estudos.' });
    const { rows } = await pool.query(
      'INSERT INTO post_replies (post_id, user_id, conteudo) VALUES ($1,$2,$3) RETURNING *',
      [req.params.id, req.user.id, conteudo]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao responder.' });
  }
});

// Listar respostas de um post
router.get('/:id/replies', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT pr.*, u.nome as autor_nome FROM post_replies pr JOIN users u ON u.id=pr.user_id WHERE pr.post_id=$1 ORDER BY pr.criado_em ASC`,
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro interno.' });
  }
});

module.exports = router;
