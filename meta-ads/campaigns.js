const axios = require('axios');

const BASE = 'https://graph.facebook.com/v18.0';

async function createCampaign(adAccountId, token, name, objective, country) {
  try {
    const res = await axios.post(
      `${BASE}/${adAccountId}/campaigns`,
      {
        name: `StudyAI — ${name} — ${new Date().toLocaleDateString('pt-BR')}`,
        objective,
        status: 'PAUSED',
        special_ad_categories: [],
        buying_type: 'AUCTION',
        is_adset_budget_sharing_enabled: false,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log(`  ✅ Campanha criada: ${res.data.id} — ${name}`);
    return res.data.id;
  } catch (err) {
    const msg = err.response?.data?.error?.message || err.message;
    console.error(`  ❌ Erro ao criar campanha "${name}": ${msg}`);
    throw err;
  }
}

module.exports = { createCampaign };
