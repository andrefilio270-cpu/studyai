require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const TOKEN = process.env.META_ACCESS_TOKEN;
const AD_ACCOUNT = process.env.META_AD_ACCOUNT_ID;
const PAGE_ID = process.env.META_PAGE_ID;
const STUDYAI_URL = process.env.STUDYAI_URL;
const BASE = 'https://graph.facebook.com/v18.0';

// IDs criados anteriormente
const CAMPAIGNS = {
  middle_school_br: { campaignId: '120251246082070569', adSetId: '120251246082390569' },
  high_school_br:   { campaignId: '120251246083030569', adSetId: '120251246083220569' },
  college_br:       { campaignId: '120251246083840569', adSetId: '120251246084050569' },
  middle_school_us: { campaignId: '120251246084290569', adSetId: '120251246084620569' },
  high_school_us:   { campaignId: '120251246084940569', adSetId: '120251246085690569' },
  college_us:       { campaignId: '120251246085950569', adSetId: '120251246086430569' },
};

const COPIES = {
  middle_school_br: { headline: 'Tirou dúvida em 30 segundos?', primary_text: 'O StudyAI tem um professor de IA pra cada matéria. Matemática, Português, Ciências... você pergunta, ele explica. As 5 primeiras perguntas são de graça — sem precisar de cartão.', description: 'Comece grátis agora', cta: 'SIGN_UP' },
  high_school_br:   { headline: 'ENEM chegando. Você preparado?', primary_text: 'Professores de IA especializados em cada matéria do ENEM. Explica Redação, resolve Matemática, contextualiza História. 5 perguntas grátis pra testar.', description: 'Comece a estudar de graça', cta: 'SIGN_UP' },
  college_br:       { headline: 'TCC, prova, seminário — tudo junto?', primary_text: 'O StudyAI tem professores de IA que explicam conceitos complexos e ajudam a entender o conteúdo de verdade. Pra quem quer aprender, não só passar.', description: '5 perguntas grátis sem cartão', cta: 'SIGN_UP' },
  middle_school_us: { headline: 'Stuck on homework? Ask your AI teacher.', primary_text: 'StudyAI has a different AI teacher for every subject — Math, Science, English and more. First 5 questions are completely free.', description: 'Start learning for free', cta: 'LEARN_MORE' },
  high_school_us:   { headline: 'SAT prep. AP classes. Finals week.', primary_text: "StudyAI has AI teachers specialized in every subject you're struggling with — from AP Calculus to AP Literature. First 5 questions free.", description: 'Start studying smarter', cta: 'SIGN_UP' },
  college_us:       { headline: 'Finals week survival kit.', primary_text: 'StudyAI gives you AI professors for every subject. Ask complex questions, get detailed explanations. First 5 questions free.', description: 'Start learning smarter', cta: 'SIGN_UP' },
};

async function uploadImage(imagePath, name) {
  const form = new FormData();
  form.append('filename', fs.createReadStream(imagePath));
  form.append('access_token', TOKEN);

  try {
    const res = await axios.post(`${BASE}/${AD_ACCOUNT}/adimages`, form, {
      headers: form.getHeaders()
    });
    const images = res.data.images;
    const key = Object.keys(images)[0];
    const hash = images[key].hash;
    console.log(`  ✅ Imagem "${name}" enviada — hash: ${hash}`);
    return hash;
  } catch (err) {
    const msg = err.response?.data?.error?.error_user_msg || err.response?.data?.error?.message || err.message;
    console.error(`  ❌ Erro upload imagem "${name}": ${msg}`);
    throw err;
  }
}

async function createCreative(name, imageHash, copy) {
  try {
    const res = await axios.post(`${BASE}/${AD_ACCOUNT}/adcreatives`, {
      name,
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
    console.log(`  ✅ Criativo criado: ${res.data.id}`);
    return res.data.id;
  } catch (err) {
    const msg = err.response?.data?.error?.error_user_msg || err.response?.data?.error?.message || err.message;
    console.error(`  ❌ Erro criativo "${name}": ${msg}`);
    throw err;
  }
}

async function createAd(adSetId, creativeId, name) {
  try {
    const res = await axios.post(`${BASE}/${AD_ACCOUNT}/ads`, {
      name,
      adset_id: adSetId,
      creative: { creative_id: creativeId },
      status: 'PAUSED',
      access_token: TOKEN
    });
    console.log(`  ✅ Anúncio criado: ${res.data.id}`);
    return res.data.id;
  } catch (err) {
    const msg = err.response?.data?.error?.error_user_msg || err.response?.data?.error?.message || err.message;
    console.error(`  ❌ Erro anúncio "${name}": ${msg}`);
    throw err;
  }
}

async function run() {
  console.log('📸 Fazendo upload das imagens e criando anúncios...\n');

  const imgDir = path.join(__dirname, 'images');
  const results = {};

  for (const [key, campaign] of Object.entries(CAMPAIGNS)) {
    console.log(`\n🎯 ${key.replace(/_/g,' ').toUpperCase()}`);
    const imgPath = path.join(imgDir, `${key}.jpg`);

    try {
      const imageHash = await uploadImage(imgPath, key);
      const copy = COPIES[key];
      const creativeId = await createCreative(`StudyAI — ${key}`, imageHash, copy);
      const adId = await createAd(campaign.adSetId, creativeId, `StudyAI Ad — ${key}`);
      results[key] = { ...campaign, imageHash, creativeId, adId };
    } catch (err) {
      console.error(`  ⚠️  ${key} falhou — pulando`);
      results[key] = { ...campaign, error: err.message };
    }
  }

  console.log('\n═══════════════════════════════════════');
  console.log('✅ Processo finalizado!');
  console.log('📋 Resumo:');
  for (const [k, v] of Object.entries(results)) {
    const status = v.error ? `❌ ${v.error}` : `✅ Ad: ${v.adId}`;
    console.log(`  ${k}: ${status}`);
  }
  console.log('\n🔗 Acesse business.facebook.com para revisar e ativar');
}

run().catch(console.error);
