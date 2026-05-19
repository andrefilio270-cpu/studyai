const axios = require('axios');
const BASE = 'https://business-api.tiktok.com/open_api/v1.3';

async function createAdGroup(advertiser_id, token, campaign_id, segment) {
  const startTime = new Date(Date.now() + 60 * 60 * 1000)
    .toISOString().replace('T', ' ').slice(0, 19);

  const payload = {
    advertiser_id,
    campaign_id,
    adgroup_name: `StudyAI — ${segment.name} — ${new Date().toLocaleDateString('pt-BR')}`,
    objective_type: segment.objective,
    placement_type: 'PLACEMENT_TYPE_AUTOMATIC',
    location_ids: getLocationIds(segment.location_ids),
    age_groups: segment.age_groups,
    budget_mode: 'BUDGET_MODE_DAY',
    budget: segment.budget_daily,
    schedule_type: 'SCHEDULE_START_END',
    schedule_start_time: startTime,
    schedule_end_time: '2026-12-31 23:59:59',
    optimization_goal: 'CLICK',
    bid_type: 'BID_TYPE_NO_BID',
    billing_event: 'CPC',
    operation_status: 'DISABLE',
    languages: segment.languages,
  };

  try {
    const res = await axios.post(
      `${BASE}/adgroup/create/`,
      payload,
      { headers: { 'Access-Token': token, 'Content-Type': 'application/json' } }
    );

    if (res.data.code !== 0) throw new Error(res.data.message);
    const id = res.data.data.adgroup_id;
    console.log(`  ✅ Ad Group criado: ${id} — ${segment.name}`);
    return id;
  } catch (err) {
    const msg = err.response?.data?.message || err.message;
    console.error(`  ❌ Erro ad group "${segment.name}": ${msg}`);
    throw err;
  }
}

function getLocationIds(countries) {
  // IDs de localização do TikTok Ads
  const map = {
    BR: ['4085'],  // Brasil
    US: ['6252001'], // Estados Unidos
  };
  return countries.flatMap(c => map[c] || []);
}

module.exports = { createAdGroup };
