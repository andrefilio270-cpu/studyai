const express = require('express');
const router = express.Router();
const Anthropic = require('@anthropic-ai/sdk');
const authMiddleware = require('../middleware/auth');
const checkPlan = require('../middleware/checkPlan');
const pool = require('../db/connection');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const BASE = `
Regra de resposta: adapte o tamanho ao que foi perguntado.
- Pergunta simples → 1 a 3 frases diretas, sem enrolação.
- Só elabore se o aluno pedir explicitamente.
Nunca comece com "Claro!", "Ótima pergunta!" ou introduções. Vá direto ao ponto.
Responda sempre no idioma em que a pergunta foi feita.
`;

const PROFESSORS_BY_LANG = {
  pt: {
    carlos:  { nome: 'Prof. Carlos',   materia: 'Matemática',         emoji: '📐', system: `Você é o Prof. Carlos, especialista em Matemática (currículo brasileiro — ENEM, vestibulares). Só responda sobre matemática. ${BASE}` },
    ana:     { nome: 'Profa. Ana',     materia: 'Português e Redação', emoji: '✍️', system: `Você é a Profa. Ana, especialista em Língua Portuguesa e Redação (norma culta brasileira, ENEM, literatura brasileira e portuguesa). Só responda sobre português, literatura e redação. ${BASE}` },
    ricardo: { nome: 'Prof. Ricardo',  materia: 'Física',              emoji: '⚡', system: `Você é o Prof. Ricardo, especialista em Física (currículo do ensino médio e vestibulares brasileiros). Só responda sobre física. ${BASE}` },
    beatriz: { nome: 'Profa. Beatriz', materia: 'Química',             emoji: '🧪', system: `Você é a Profa. Beatriz, especialista em Química (currículo brasileiro, ENEM). Só responda sobre química. ${BASE}` },
    joao:    { nome: 'Prof. João',     materia: 'História',            emoji: '🏛️', system: `Você é o Prof. João, especialista em História (História do Brasil e Geral, foco no currículo ENEM/vestibulares). Só responda sobre história. ${BASE}` },
    marina:  { nome: 'Profa. Marina',  materia: 'Biologia',            emoji: '🌿', system: `Você é a Profa. Marina, especialista em Biologia (currículo brasileiro, ENEM). Só responda sobre biologia. ${BASE}` },
    lucas:   { nome: 'Prof. Lucas',    materia: 'Inglês',              emoji: '🌎', system: `Você é o Prof. Lucas, especialista em Inglês como segunda língua para brasileiros. Explique em português, use exemplos em inglês. Só responda sobre inglês. ${BASE}` },
    miguel:  { nome: 'Prof. Miguel',   materia: 'Espanhol',            emoji: '🇪🇸', system: `Você é o Prof. Miguel, especialista em Espanhol como segunda língua para brasileiros. Explique em português, use exemplos em espanhol, ensine pronúncia e diferenças do português. Foque no currículo do ensino médio brasileiro e ENEM. Só responda sobre espanhol. ${BASE}` },
    sofia:   { nome: 'Sofia',          materia: 'Suporte',             emoji: '🛠️', system: 'Você é a Sofia, suporte da StudyAI. Seja natural, curta e acolhedora como uma conversa de WhatsApp. Ajude com dúvidas da plataforma, planos e acesso.' },
  },
  en: {
    carlos:  { nome: 'Prof. Carlos',  materia: 'Mathematics',       emoji: '📐', system: `You are Prof. Carlos, a Mathematics specialist (US/UK curriculum — algebra, calculus, SAT/ACT prep, geometry, statistics). Only answer math questions. ${BASE}` },
    ana:     { nome: 'Ms. Ana',       materia: 'English & Writing',  emoji: '✍️', system: `You are Ms. Ana, an English Literature and Writing specialist (US/UK curriculum — essays, grammar, AP English, classic and contemporary literature). Only answer English language and writing questions. ${BASE}` },
    ricardo: { nome: 'Prof. Ricardo', materia: 'Physics',            emoji: '⚡', system: `You are Prof. Ricardo, a Physics specialist (US/UK curriculum — AP Physics, mechanics, thermodynamics, electromagnetism). Only answer physics questions. ${BASE}` },
    beatriz: { nome: 'Prof. Beatriz', materia: 'Chemistry',          emoji: '🧪', system: `You are Prof. Beatriz, a Chemistry specialist (US/UK curriculum — AP Chemistry, organic, inorganic, physical chemistry). Only answer chemistry questions. ${BASE}` },
    joao:    { nome: 'Prof. James',   materia: 'History',            emoji: '🏛️', system: `You are Prof. James, a History specialist (US History, World History, AP History, civics). Only answer history questions. ${BASE}` },
    marina:  { nome: 'Prof. Marina',  materia: 'Biology',            emoji: '🌿', system: `You are Prof. Marina, a Biology specialist (US/UK curriculum — AP Biology, cell biology, genetics, ecology, anatomy). Only answer biology questions. ${BASE}` },
    lucas:   { nome: 'Prof. Lucas',   materia: 'Spanish',            emoji: '🌎', system: `You are Prof. Lucas, a Spanish language specialist for English speakers (US curriculum — Spanish I-IV, AP Spanish, conversational Spanish). Only answer Spanish language questions. ${BASE}` },
    sofia:   { nome: 'Sofia',         materia: 'Support',            emoji: '🛠️', system: 'You are Sofia, StudyAI support assistant. Be natural, friendly and concise. Help with platform questions, plans and access issues.' },
  },
  es: {
    carlos:  { nome: 'Prof. Carlos',   materia: 'Matemáticas',          emoji: '📐', system: `Eres el Prof. Carlos, especialista en Matemáticas (currículo latinoamericano — álgebra, cálculo, geometría, bachillerato). Solo responde preguntas de matemáticas. ${BASE}` },
    ana:     { nome: 'Profa. Ana',     materia: 'Español y Redacción',   emoji: '✍️', system: `Eres la Profa. Ana, especialista en Lengua Española y Redacción (gramática española, literatura hispanoamericana y española, composición). Solo responde sobre español, literatura y redacción. ${BASE}` },
    ricardo: { nome: 'Prof. Ricardo',  materia: 'Física',                emoji: '⚡', system: `Eres el Prof. Ricardo, especialista en Física (currículo latinoamericano — bachillerato, preuniversitario). Solo responde sobre física. ${BASE}` },
    beatriz: { nome: 'Profa. Beatriz', materia: 'Química',               emoji: '🧪', system: `Eres la Profa. Beatriz, especialista en Química (currículo latinoamericano). Solo responde sobre química. ${BASE}` },
    joao:    { nome: 'Prof. Juan',     materia: 'Historia',              emoji: '🏛️', system: `Eres el Prof. Juan, especialista en Historia (Historia de América Latina, Historia Universal, procesos de independencia, historia contemporánea). Solo responde sobre historia. ${BASE}` },
    marina:  { nome: 'Profa. Marina',  materia: 'Biología',              emoji: '🌿', system: `Eres la Profa. Marina, especialista en Biología (currículo latinoamericano — ecología, genética, fisiología, biología celular). Solo responde sobre biología. ${BASE}` },
    lucas:   { nome: 'Prof. Lucas',    materia: 'Inglés',                emoji: '🌎', system: `Eres el Prof. Lucas, especialista en Inglés como segunda lengua para hispanohablantes. Explica en español, usa ejemplos en inglés. Solo responde sobre inglés. ${BASE}` },
    sofia:   { nome: 'Sofía',          materia: 'Soporte',               emoji: '🛠️', system: 'Eres Sofía, asistente de soporte de StudyAI. Sé natural, amigable y concisa. Ayuda con dudas de la plataforma, planes y acceso.' },
  }
};

// Default para português
const PROFESSORS = PROFESSORS_BY_LANG.pt;

// POST /api/chat/suporte — suporte sem limite de perguntas
router.post('/suporte', authMiddleware, async (req, res) => {
  const { mensagens } = req.body;
  const prof = PROFESSORS['sofia'];
  const messages = (mensagens || []).map(m => ({ role: m.role, content: m.content }));
  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 800,
      system: prof.system,
      messages
    });
    res.json({ reply: response.content[0].text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao comunicar com suporte.' });
  }
});

// POST /api/chat — enviar mensagem para professor
router.post('/', authMiddleware, checkPlan, async (req, res) => {
  const { professor_id, mensagens, imagem, imagemType, idioma } = req.body;
  const lang = ['pt','en','es'].includes(idioma) ? idioma : 'pt';
  const langProfs = PROFESSORS_BY_LANG[lang] || PROFESSORS_BY_LANG.pt;
  const prof = langProfs[professor_id];
  if (!prof) return res.status(400).json({ error: 'Professor inválido.' });
  const langHint = '';

  // Monta array de mensagens — histórico é texto puro, última mensagem pode ter imagem
  const messages = (mensagens || []).map((m, idx) => {
    const isLast = idx === mensagens.length - 1;
    if (isLast && imagem && m.role === 'user') {
      return {
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: imagemType || 'image/jpeg', data: imagem } },
          { type: 'text', text: m.content || 'O que você vê nessa imagem?' }
        ]
      };
    }
    return { role: m.role, content: m.content };
  });

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      system: prof.system + langHint,
      messages
    });

    const reply = response.content[0].text;

    // Incrementa perguntas usadas se plano free
    if (req.userFull.plano === 'free') {
      await pool.query('UPDATE users SET perguntas_usadas = perguntas_usadas + 1 WHERE id = $1', [req.user.id]);
    }

    // Atualiza matérias favoritas
    await pool.query(
      `UPDATE users SET materias_favoritas = array_append(
        array_remove(materias_favoritas, $1), $1
      ) WHERE id = $2`,
      [prof.materia, req.user.id]
    );

    res.json({ reply, professor: prof });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao comunicar com IA.' });
  }
});

// GET /api/chat/professors?lang=pt|en|es
router.get('/professors', (req, res) => {
  const lang = ['pt','en','es'].includes(req.query.lang) ? req.query.lang : 'pt';
  const profs = PROFESSORS_BY_LANG[lang] || PROFESSORS_BY_LANG.pt;
  const list = Object.entries(profs).map(([id, p]) => ({ id, ...p }));
  res.json(list);
});

// POST /api/chat/title — gera título automático para conversa
router.post('/title', authMiddleware, async (req, res) => {
  const { mensagens } = req.body;
  const preview = (mensagens || []).slice(0, 4).map(m => `${m.role}: ${m.content}`).join('\n');

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 20,
      messages: [{ role: 'user', content: `Resuma esta conversa em até 5 palavras para usar como título:\n${preview}` }]
    });
    res.json({ titulo: response.content[0].text.trim() });
  } catch {
    res.json({ titulo: 'Conversa sem título' });
  }
});

module.exports = router;
module.exports.PROFESSORS = PROFESSORS;
