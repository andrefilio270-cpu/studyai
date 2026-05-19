const axios = require('axios');

const BASE = 'https://graph.facebook.com/v18.0';

async function createCreative(adAccountId, token, copy, segmentName, variation) {
  const pageId = process.env.META_PAGE_ID;
  const studyaiUrl = process.env.STUDYAI_URL || 'https://loyal-fulfillment-production-4114.up.railway.app';

  try {
    const res = await axios.post(
      `${BASE}/${adAccountId}/adcreatives`,
      {
        name: `StudyAI — ${segmentName} — Variação ${variation}`,
        object_story_spec: {
          page_id: pageId,
          link_data: {
            link: studyaiUrl,
            message: copy.primary_text,
            name: copy.headline,
            description: copy.description,
            call_to_action: {
              type: copy.cta,
              value: { link: studyaiUrl }
            }
          }
        }
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log(`  ✅ Criativo ${variation} criado: ${res.data.id}`);
    return res.data.id;
  } catch (err) {
    const msg = err.response?.data?.error?.message || err.message;
    console.error(`  ❌ Erro ao criar criativo "${segmentName}" variação ${variation}: ${msg}`);
    throw err;
  }
}

module.exports = { createCreative };
