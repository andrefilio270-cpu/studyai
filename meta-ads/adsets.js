const axios = require('axios');

const BASE = 'https://graph.facebook.com/v18.0';

async function createAdSet(adAccountId, token, campaignId, segment, targeting) {
  const startTime = new Date(Date.now() + 60 * 60 * 1000).toISOString();

  const payload = {
    name: `StudyAI — ${segment.name} — ${new Date().toLocaleDateString('pt-BR')}`,
    campaign_id: campaignId,
    billing_event: 'IMPRESSIONS',
    optimization_goal: 'LINK_CLICKS',
    bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
    daily_budget: segment.budget_daily,
    targeting,
    start_time: startTime,
    status: 'PAUSED',
    access_token: token,
  };

  try {
    const res = await axios.post(
      `${BASE}/${adAccountId}/adsets`,
      payload
    );
    console.log(`  ✅ Ad Set criado: ${res.data.id} — ${segment.name}`);
    return res.data.id;
  } catch (err) {
    const errData = err.response?.data?.error;
    const msg = errData?.error_user_msg || errData?.message || err.message;
    console.error(`  ❌ Erro ao criar Ad Set "${segment.name}": ${msg}`);
    throw err;
  }
}

module.exports = { createAdSet };
