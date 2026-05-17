const pool = require('../db/connection');

module.exports = async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    if (!rows.length) return res.status(404).json({ error: 'Usuário não encontrado.' });

    const user = rows[0];

    // Verifica expiração do plano
    if (user.plano !== 'free' && user.plano_expira_em && new Date(user.plano_expira_em) < new Date()) {
      await pool.query('UPDATE users SET plano = $1, plano_expira_em = NULL WHERE id = $2', ['free', user.id]);
      user.plano = 'free';
    }

    if (user.plano === 'free' && user.perguntas_usadas >= 5) {
      return res.status(402).json({ error: 'Limite de perguntas gratuitas atingido.', upgrade: true });
    }

    req.userFull = user;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno.' });
  }
};
