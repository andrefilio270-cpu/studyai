require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const path = require('path');

// Roda migrations automaticamente ao iniciar
if (process.env.DATABASE_URL) {
  const { Pool } = require('pg');
  const fs = require('fs');
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });
  const sql = fs.readFileSync(path.join(__dirname, 'db/migrations.sql'), 'utf8');
  pool.query(sql)
    .then(() => pool.query(`
      ALTER TABLE conversations ADD COLUMN IF NOT EXISTS session_id VARCHAR(64);
      ALTER TABLE conversations ADD COLUMN IF NOT EXISTS atualizado_em TIMESTAMP DEFAULT NOW();
      ALTER TABLE conversations ADD COLUMN IF NOT EXISTS is_auto BOOLEAN DEFAULT FALSE;
    `))
    .then(() => { console.log('✅ Banco OK'); pool.end(); })
    .catch(err => { console.error('DB init error:', err.message); pool.end(); });
}

const app = express();
app.use(cors());

// Webhook do Stripe DEVE receber o body bruto — registrar ANTES do express.json()
const paymentsRouter = require('./routes/payments');
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), paymentsRouter.webhookHandler);

// JSON parsing para todas as outras rotas
app.use(express.json({ limit: '10mb' }));

// Serve frontend estático
app.use(express.static(path.join(__dirname, '../frontend')));

// Rotas da API
app.use('/api/auth',         require('./routes/auth'));
app.use('/api/chat',         require('./routes/chat'));
app.use('/api/conversations',require('./routes/conversations'));
app.use('/api/public-chat',  require('./routes/public-chat'));
app.use('/api/plans',        require('./routes/plans'));
app.use('/api/payments',     paymentsRouter);

// Rota catch-all para SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`StudyAI rodando em http://localhost:${PORT}`);
});
