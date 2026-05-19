require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { SEGMENTS } = require('./config');
const { COPIES_BR } = require('./copies/brasil');
const { COPIES_US } = require('./copies/usa');
const { createCampaign } = require('./campaigns');
const { buildTargeting } = require('./audiences');
const { createAdSet } = require('./adsets');
const { createCreative } = require('./creatives');
const { createAd } = require('./ads');
const { generateReport } = require('./report');

const TOKEN = process.env.META_ACCESS_TOKEN;
const AD_ACCOUNT = process.env.META_AD_ACCOUNT_ID;

function validateEnv() {
  const required = ['META_ACCESS_TOKEN', 'META_AD_ACCOUNT_ID', 'META_PAGE_ID'];
  const missing = required.filter(k => !process.env[k] || process.env[k].includes('seu_'));
  if (missing.length) {
    console.error('❌ Variáveis de ambiente não configuradas:');
    missing.forEach(k => console.error(`   - ${k}`));
    console.error('\nConfigure o .env com seus dados do Meta Business e rode novamente.');
    process.exit(1);
  }
}

async function processSegment(segKey, copiesKey, copies, country) {
  const seg = SEGMENTS[segKey];
  console.log(`\n📢 Criando campanha: ${seg.name}`);

  const campaignId = await createCampaign(AD_ACCOUNT, TOKEN, seg.name, 'OUTCOME_TRAFFIC', country);
  const targeting = buildTargeting(seg);
  const adSetId = await createAdSet(AD_ACCOUNT, TOKEN, campaignId, seg, targeting);

  console.log(`  📝 ${copies.length} textos prontos para adicionar manualmente`);
  console.log(`✅ ${seg.name} — campanha e ad set criados`);
  return { campaignId, adSetId, copies };
}

async function runAll() {
  validateEnv();
  console.log('🚀 Iniciando criação de campanhas StudyAI no Meta Ads...');
  console.log(`📋 Conta de anúncios: ${AD_ACCOUNT}\n`);

  const results = { brasil: {}, usa: {} };

  // ── BRASIL ──
  console.log('═══════════════════════════════');
  console.log('🇧🇷  BRASIL');
  console.log('═══════════════════════════════');

  const brSegments = [
    ['middle_school_br', 'middle_school', COPIES_BR.middle_school],
    ['high_school_br',   'high_school',   COPIES_BR.high_school],
    ['college_br',       'college',       COPIES_BR.college],
  ];

  for (const [segKey, copiesKey, copies] of brSegments) {
    try {
      results.brasil[copiesKey] = await processSegment(segKey, copiesKey, copies, 'BR');
    } catch (err) {
      console.error(`⚠️  Segmento ${copiesKey} BR falhou — continuando...`);
      results.brasil[copiesKey] = { error: err.message };
    }
  }

  // ── EUA ──
  console.log('\n═══════════════════════════════');
  console.log('🇺🇸  EUA');
  console.log('═══════════════════════════════');

  const usSegments = [
    ['middle_school_us', 'middle_school', COPIES_US.middle_school],
    ['high_school_us',   'high_school',   COPIES_US.high_school],
    ['college_us',       'college',       COPIES_US.college],
  ];

  for (const [segKey, copiesKey, copies] of usSegments) {
    try {
      results.usa[copiesKey] = await processSegment(segKey, copiesKey, copies, 'US');
    } catch (err) {
      console.error(`⚠️  Segmento ${copiesKey} US falhou — continuando...`);
      results.usa[copiesKey] = { error: err.message };
    }
  }

  await generateReport(results);

  console.log('\n═══════════════════════════════════════════════════════');
  console.log('✅  Tudo pronto! Verifique o arquivo RESULTADO.md');
  console.log('🔗  Acesse: business.facebook.com → Gerenciador de Anúncios');
  console.log('💡  Adicione imagens/vídeos e ative as campanhas quando quiser');
  console.log('═══════════════════════════════════════════════════════');
}

runAll().catch(err => {
  console.error('\n❌ Erro fatal:', err.message);
  process.exit(1);
});
