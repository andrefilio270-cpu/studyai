const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const BASE = 'https://business-api.tiktok.com/open_api/v1.3';

async function uploadImage(advertiser_id, token, imagePath, name) {
  const form = new FormData();
  form.append('advertiser_id', advertiser_id);
  form.append('file_name', name);
  form.append('image_file', fs.createReadStream(imagePath));

  try {
    const res = await axios.post(
      `${BASE}/file/image/ad/upload/`,
      form,
      { headers: { 'Access-Token': token, ...form.getHeaders() } }
    );

    if (res.data.code !== 0) throw new Error(res.data.message);
    const imageId = res.data.data.image_id;
    console.log(`  ✅ Imagem enviada: ${imageId}`);
    return imageId;
  } catch (err) {
    const msg = err.response?.data?.message || err.message;
    console.error(`  ❌ Erro upload imagem: ${msg}`);
    throw err;
  }
}

async function createCreative(advertiser_id, token, adgroup_id, image_id, copy, segmentName, variation, studyaiUrl) {
  try {
    const res = await axios.post(
      `${BASE}/ad/create/`,
      {
        advertiser_id,
        adgroup_id,
        creatives: [{
          ad_name: `StudyAI — ${segmentName} — v${variation}`,
          ad_format: 'SINGLE_IMAGE',
          image_ids: [image_id],
          ad_text: copy.ad_text,
          call_to_action: copy.cta,
          landing_page_url: studyaiUrl,
          display_name: 'StudyAI',
        }],
        operation_status: 'DISABLE',
      },
      { headers: { 'Access-Token': token, 'Content-Type': 'application/json' } }
    );

    if (res.data.code !== 0) throw new Error(res.data.message);
    const adIds = res.data.data.ad_ids || [];
    console.log(`  ✅ Anúncio v${variation} criado: ${adIds[0]}`);
    return adIds[0];
  } catch (err) {
    const msg = err.response?.data?.message || err.message;
    console.error(`  ❌ Erro anúncio v${variation} "${segmentName}": ${msg}`);
    throw err;
  }
}

module.exports = { uploadImage, createCreative };
