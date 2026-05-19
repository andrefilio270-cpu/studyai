// Rode este script APÓS liberar o app para modo público
// developers.facebook.com → seu app → toggle "Em desenvolvimento" → Modo público

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const axios = require('axios');

const TOKEN = process.env.META_ACCESS_TOKEN;
const AD_ACCOUNT = process.env.META_AD_ACCOUNT_ID;
const PAGE_ID = process.env.META_PAGE_ID;
const STUDYAI_URL = process.env.STUDYAI_URL;
const BASE = 'https://graph.facebook.com/v18.0';

// Hashes das imagens já enviadas
const IMAGE_HASHES = {
  middle_school_br: '9258b8bb56bca8ee70cbe6e47a74f4e5',
  high_school_br:   'bc6e8d01782d290d460a130d3563c901',
  college_br:       'cc6300aedf41ef5ecd786dbdc8f8f72e',
  middle_school_us: '2bac9047f489284e78353e530a141bd0',
  high_school_us:   'd0a17f7764615495b5b95392c9dfd60f',
  college_us:       'fa9f14579bbb4246e0c3a6e5e92bfd6e',
};

// Ad Sets já criados
const AD_SETS = {
  middle_school_br: '120251246082390569',
  high_school_br:   '120251246083220569',
  college_br:       '120251246084050569',
  middle_school_us: '120251246084620569',
  high_school_us:   '120251246085690569',
  college_us:       '120251246086430569',
};

// Textos por segmento
const COPIES = {
  middle_school_br: [
    { headline: 'Tirou dúvida em 30 segundos?', primary_text: 'O StudyAI tem um professor de IA pra cada matéria. Matemática, Português, Ciências... você pergunta, ele explica. As 5 primeiras perguntas são de graça — sem precisar de cartão.', description: 'Comece grátis agora', cta: 'SIGN_UP' },
    { headline: 'Dever de casa nunca mais travou', primary_text: 'Imagina ter um professor particular disponível a qualquer hora. O StudyAI explica passo a passo até você entender de verdade.', description: '5 perguntas grátis pra começar', cta: 'SIGN_UP' },
    { headline: 'Por que esperar a aula pra tirar dúvida?', primary_text: 'Com o StudyAI você tem um professor de Matemática, Português, Ciências e mais — sempre disponível. Primeiras 5 perguntas: totalmente grátis.', description: 'Experimente sem compromisso', cta: 'SIGN_UP' },
    { headline: 'Aquela matéria difícil? Resolvida.', primary_text: 'O Prof. Carlos explica Matemática do jeito que você entende. A Profa. Ana cuida do Português. Comece com 5 perguntas gratuitas.', description: 'StudyAI — aprenda com quem entende', cta: 'LEARN_MORE' },
  ],
  high_school_br: [
    { headline: 'ENEM chegando. Você preparado?', primary_text: 'Professores de IA especializados em cada matéria do ENEM. 5 perguntas grátis pra testar.', description: 'Comece a estudar de graça', cta: 'SIGN_UP' },
    { headline: 'Tirou nota baixa? Isso tem solução.', primary_text: 'Com o StudyAI você tem um professor particular de Física, Química, Matemática e mais — disponível 24 horas.', description: 'Primeiras 5 perguntas grátis', cta: 'LEARN_MORE' },
    { headline: 'Vestibular não espera. Você sim?', primary_text: 'StudyAI tem professores de IA pra cada área do vestibular. Explicação completa, passo a passo. Sem mensalidade pra começar.', description: 'Teste grátis — sem cartão', cta: 'SIGN_UP' },
    { headline: 'Estudar sozinho é difícil. Estudar com IA é diferente.', primary_text: 'O StudyAI conecta você com professores virtuais que explicam do jeito que você precisa. Pergunte e receba a resposta na hora.', description: 'Comece com 5 perguntas grátis', cta: 'SIGN_UP' },
  ],
  college_br: [
    { headline: 'TCC, prova, seminário — tudo junto?', primary_text: 'O StudyAI tem professores de IA que explicam conceitos complexos e ajudam a entender o conteúdo de verdade.', description: '5 perguntas grátis sem cartão', cta: 'SIGN_UP' },
    { headline: 'Seu professor explicou rápido demais?', primary_text: 'Com o StudyAI você pode revisar o conteúdo com um professor de IA que explica no seu ritmo, quantas vezes precisar.', description: 'Comece grátis agora', cta: 'LEARN_MORE' },
    { headline: 'Faculdade cobrou o que o ensino médio não ensinou', primary_text: 'O StudyAI tem professores especializados que preenchem essas lacunas. Você pergunta, ele explica. Sem julgamento, sem pressa.', description: 'Teste com 5 perguntas grátis', cta: 'SIGN_UP' },
    { headline: 'Não é fraqueza pedir ajuda. É estratégia.', primary_text: 'O StudyAI é o professor de IA que explica, exemplifica e confirma seu entendimento.', description: 'Comece grátis — planos a partir de R$9,90/semana', cta: 'SIGN_UP' },
  ],
  middle_school_us: [
    { headline: 'Stuck on homework? Ask your AI teacher.', primary_text: 'StudyAI has a different AI teacher for every subject — Math, Science, English and more. First 5 questions are completely free.', description: 'Start learning for free', cta: 'LEARN_MORE' },
    { headline: "No more \"I don't get it.\"", primary_text: "What if you had a patient tutor available 24/7? That's StudyAI. First 5 questions free — no credit card needed.", description: 'Try it free today', cta: 'SIGN_UP' },
    { headline: "Your teacher is busy. Your AI tutor isn't.", primary_text: 'StudyAI connects you with AI teachers for every subject. Ask any question, any time. First 5 questions are on us.', description: 'Free to start — no card required', cta: 'SIGN_UP' },
    { headline: 'Math homework at 10pm? We got you.', primary_text: "StudyAI's AI teachers are available around the clock. Ask a question and get a real explanation, not just an answer.", description: 'Start with 5 free questions', cta: 'LEARN_MORE' },
  ],
  high_school_us: [
    { headline: 'SAT prep. AP classes. Finals week.', primary_text: "StudyAI has AI teachers specialized in every subject you're struggling with. First 5 questions free.", description: 'Start studying smarter', cta: 'SIGN_UP' },
    { headline: "The teacher moved on. You didn't have to.", primary_text: "With StudyAI, you can revisit any concept with an AI teacher who explains at your pace. No embarrassment, no rush.", description: '5 free questions — no credit card', cta: 'LEARN_MORE' },
    { headline: 'College applications need good grades. We can help.', primary_text: "StudyAI gives you access to AI tutors for every subject — Math, Chemistry, History, English and more.", description: 'Try free — plans from $9.90/week', cta: 'SIGN_UP' },
    { headline: 'Late night study session just got easier.', primary_text: "When your friends are asleep, StudyAI's AI teachers are still up. Ask anything — get a full, clear explanation every time.", description: 'Start with 5 questions, totally free', cta: 'SIGN_UP' },
  ],
  college_us: [
    { headline: 'Finals week survival kit.', primary_text: 'StudyAI gives you AI professors for every subject. Ask complex questions, get detailed explanations. First 5 questions free.', description: 'Start learning smarter', cta: 'SIGN_UP' },
    { headline: "Office hours are full. Your AI tutor isn't.", primary_text: "Can't get time with your professor? StudyAI has AI teachers for every subject available 24/7.", description: '5 free questions to get started', cta: 'LEARN_MORE' },
    { headline: "You're not behind. You just need a better explanation.", primary_text: "StudyAI connects college students with AI tutors who actually explain the why behind the what.", description: 'Free to try — no credit card', cta: 'SIGN_UP' },
    { headline: "Top students don't study harder. They study smarter.", primary_text: "StudyAI gives you an AI tutor who knows your subject inside out — Organic Chemistry, Calculus, Constitutional Law.", description: 'Start free — plans from $9.90/week', cta: 'SIGN_UP' },
  ],
};

async function run() {
  console.log('🚀 Criando criativos e anúncios...\n');
  let totalAds = 0;

  for (const [key, copies] of Object.entries(COPIES)) {
    const imageHash = IMAGE_HASHES[key];
    const adSetId = AD_SETS[key];
    console.log(`\n🎯 ${key.replace(/_/g, ' ').toUpperCase()}`);

    for (let v = 0; v < copies.length; v++) {
      const copy = copies[v];
      try {
        // Criar criativo
        const creativeRes = await axios.post(`${BASE}/${AD_ACCOUNT}/adcreatives`, {
          name: `StudyAI — ${key} — v${v + 1}`,
          object_story_spec: {
            page_id: PAGE_ID,
            link_data: {
              image_hash: imageHash,
              link: STUDYAI_URL,
              message: copy.primary_text,
              name: copy.headline,
              description: copy.description,
              call_to_action: { type: copy.cta, value: { link: STUDYAI_URL } }
            }
          },
          access_token: TOKEN
        });
        const creativeId = creativeRes.data.id;

        // Criar anúncio
        const adRes = await axios.post(`${BASE}/${AD_ACCOUNT}/ads`, {
          name: `StudyAI Ad — ${key} — v${v + 1}`,
          adset_id: adSetId,
          creative: { creative_id: creativeId },
          status: 'PAUSED',
          access_token: TOKEN
        });

        console.log(`  ✅ Variação ${v + 1}: Ad ${adRes.data.id}`);
        totalAds++;
      } catch (err) {
        const msg = err.response?.data?.error?.error_user_msg || err.response?.data?.error?.message || err.message;
        console.error(`  ❌ Variação ${v + 1}: ${msg}`);
      }
    }
  }

  console.log(`\n═══════════════════════════════════════`);
  console.log(`✅ ${totalAds} anúncios criados com sucesso!`);
  console.log(`🔗 Acesse business.facebook.com para ativar as campanhas`);
}

run().catch(console.error);
