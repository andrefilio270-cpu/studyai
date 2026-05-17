require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { Pool } = require('pg');

const isRailwayInternal = process.env.DATABASE_URL?.includes('railway.internal');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isRailwayInternal ? false : (process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false)
});

pool.on('error', (err) => {
  console.error('Erro inesperado no pool PostgreSQL:', err);
});

module.exports = pool;
