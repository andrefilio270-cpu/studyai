require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const path = require('path');
const fs = require('fs');
const { SEGMENTS, STUDYAI_URL } = require('./config');
const { COPIES_BR } = require('./copies/brasil');
const { COPIES_US } = require('./copies/usa');
const { createCampaign } = require('./campaigns');
const { createAdGroup } = require('./adgroups');
const { uploadImage, createCreative } = require('./creatives');

const TOKEN = process.env.TIKTOK_ACCESS_TOKEN;
const ADVERTISER_ID = process.env.TIKTOK_ADVERTISER_ID;
const IMG_DIR = path.join(__dirname, '../meta-ads/images');

function validate() {
  const missing = ['TIKTOK_ACCESS_TOKEN', 'TIKTOK_ADVERTISER_ID']
    .filter(k => !process.env[k] || process.env[k].includes('seu_'));
  if (missing.length) {
    console.error('❌ Configure no .env:');
    missing.forEach(k => console.error(`   - ${k}`));
    process.exit(1);
  }
}

const SEGMENTS_MAP = [
  { key: 'middle_school_br', copiesKey: 'middle_school', copies: COPIES_BR, flag: '🇧🇷' },
  { key: 'high_school_br',   copiesKey: 'high_school',   copies: COPIES_BR, flag: '🇧🇷' },
  { key: 'college_br',       copiesKey: 'college',       copies: COPIES_BR, flag: '🇧🇷' },
  { key: 'middle_school_us', copiesKey: 'middle_school', copies: COPIES_US, flag: '🇺🇸' },
  { key: 'high_school_us',   copiesKey: 'high_school',   copies: COPIES_US, flag: '🇺🇸' },
  { key: 'college_us',       copiesKey: 'college',       copies: COPIES_US, flag: '🇺🇸' },
];

async function run() {
  validate();
  console.log('🚀 Iniciando campanhas TikTok Ads — StudyAI\n');

  const results = [];

  for (const { key, copiesKey, copies, flag } of SEGMENTS_MAP) {
    const seg = SEGMENTS[key];
    const segCopies = copies[copiesKey];
    console.log(`\n${flag} ${seg.name.toUpperCase()}`);
    console.log('─'.repeat(40));

    try {
      // 1. Campanha
      const campaignId = await createCampaign(ADVERTISER_ID, TOKEN, seg.name, seg.objective);

      // 2. Ad Group
      const adGroupId = await createAdGroup(ADVERTISER_ID, TOKEN, campaignId, seg);

      // 3. Upload imagem
      const imgPath = path.join(IMG_DIR, `${key}.jpg`);
      const imageId = await uploadImage(ADVERTISER_ID, TOKEN, imgPath, `studyai_${key}`);

      // 4. Criar anúncios (uma variação de cada)
      const adIds = [];
      for (let v = 0; v < segCopies.length; v++) {
        const adId = await createCreative(
          ADVERTISER_ID, TOKEN, adGroupId, imageId,
          segCopies[v], seg.name, v + 1, STUDYAI_URL
        );
        adIds.push(adId);
      }

      results.push({ seg: seg.name, campaignId, adGroupId, imageId, adIds, flag });
      console.log(`✅ ${seg.name} — ${adIds.length} anúncios criados`);

    } catch (err) {
      console.error(`⚠️  ${seg.name} falhou — continuando...`);
      results.push({ seg: seg.name, error: err.message, flag });
    }
  }

  // Relatório
  console.log('\n' + '═'.repeat(50));
  console.log('📊 RESULTADO FINAL');
  console.log('═'.repeat(50));
  for (const r of results) {
    if (r.error) {
      console.log(`${r.flag} ${r.seg}: ❌ ${r.error}`);
    } else {
      console.log(`${r.flag} ${r.seg}: ✅ ${r.adIds?.length || 0} anúncios — Campaign: ${r.campaignId}`);
    }
  }
  console.log('\n🔗 Acesse: ads.tiktok.com para revisar e ativar');
}

run().catch(console.error);
