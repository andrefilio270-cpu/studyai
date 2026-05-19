-- StudyAI — Migrations

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  plano VARCHAR(20) DEFAULT 'free' CHECK (plano IN ('free','semanal','mensal','anual')),
  perguntas_usadas INT DEFAULT 0,
  plano_expira_em TIMESTAMP,
  criado_em TIMESTAMP DEFAULT NOW(),
  violations_count INT DEFAULT 0,
  banned_until TIMESTAMP,
  is_banned BOOLEAN DEFAULT FALSE,
  materias_favoritas TEXT[] DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS conversations (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  professor_id VARCHAR(50) NOT NULL,
  titulo VARCHAR(255),
  mensagens JSONB DEFAULT '[]',
  criado_em TIMESTAMP DEFAULT NOW(),
  is_public BOOLEAN DEFAULT FALSE,
  is_saved BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS public_posts (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  conteudo TEXT NOT NULL,
  materia_tag VARCHAR(50),
  curtidas INT DEFAULT 0,
  criado_em TIMESTAMP DEFAULT NOW(),
  is_approved BOOLEAN DEFAULT FALSE,
  conversation_id INT REFERENCES conversations(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS post_likes (
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  post_id INT REFERENCES public_posts(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, post_id)
);

CREATE TABLE IF NOT EXISTS post_replies (
  id SERIAL PRIMARY KEY,
  post_id INT REFERENCES public_posts(id) ON DELETE CASCADE,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  conteudo TEXT NOT NULL,
  criado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS moderation_logs (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  conteudo_reprovado TEXT NOT NULL,
  motivo TEXT,
  criado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS page_views (
  id SERIAL PRIMARY KEY,
  path VARCHAR(255),
  referrer VARCHAR(500),
  user_agent TEXT,
  ip VARCHAR(100),
  criado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS eventos (
  id SERIAL PRIMARY KEY,
  tipo VARCHAR(50),
  dados JSONB,
  ip VARCHAR(100),
  criado_em TIMESTAMP DEFAULT NOW()
);
