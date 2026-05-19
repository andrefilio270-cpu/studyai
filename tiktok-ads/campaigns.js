const axios = require('axios');
const BASE = 'https://business-api.tiktok.com/open_api/v1.3';

async function createCampaign(advertiser_id, token, name, objective) {
  try {
    const res = await axios.post(
      `${BASE}/campaign/create/`,
      {
        advertiser_id,
        campaign_name: `StudyAI — ${name} — ${new Date().toLocaleDateString('pt-BR')}`,
        objective_type: objective,
        budget_mode: 'BUDGET_MODE_INFINITE',
        operation_status: 'DISABLE',
      },
      { headers: { 'Access-Token': token, 'Content-Type': 'application/json' } }
    );

    if (res.data.code !== 0) throw new Error(res.data.message);
    const id = res.data.data.campaign_id;
    console.log(`  ✅ Campanha criada: ${id} — ${name}`);
    return id;
  } catch (err) {
    const msg = err.response?.data?.message || err.message;
    console.error(`  ❌ Erro campanha "${name}": ${msg}`);
    throw err;
  }
}

module.exports = { createCampaign };
