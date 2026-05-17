require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function init() {
  try {
    const sql = fs.readFileSync(path.join(__dirname, 'migrations.sql'), 'utf8');
    // Adiciona colunas extras se não existirem
    const extras = `
      ALTER TABLE conversations ADD COLUMN IF NOT EXISTS session_id VARCHAR(64);
      ALTER TABLE conversations ADD COLUMN IF NOT EXISTS atualizado_em TIMESTAMP DEFAULT NOW();
      ALTER TABLE conversations ADD COLUMN IF NOT EXISTS is_auto BOOLEAN DEFAULT FALSE;
    `;
    await pool.query(sql);
    await pool.query(extras);
    console.log('✅ Banco inicializado com sucesso.');
  } catch (err) {
    console.error('Erro ao inicializar banco:', err.message);
  } finally {
    await pool.end();
  }
}

init();
