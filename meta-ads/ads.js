const axios = require('axios');

const BASE = 'https://graph.facebook.com/v18.0';

async function createAd(adAccountId, token, adSetId, creativeId, segmentName, variation) {
  try {
    const res = await axios.post(
      `${BASE}/${adAccountId}/ads`,
      {
        name: `StudyAI Ad — ${segmentName} — Variação ${variation}`,
        adset_id: adSetId,
        creative: { creative_id: creativeId },
        status: 'PAUSED',
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log(`  ✅ Anúncio ${variation} criado: ${res.data.id}`);
    return res.data.id;
  } catch (err) {
    const msg = err.response?.data?.error?.message || err.message;
    console.error(`  ❌ Erro ao criar anúncio "${segmentName}" variação ${variation}: ${msg}`);
    throw err;
  }
}

module.exports = { createAd };
