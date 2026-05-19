function buildTargeting(segment) {
  // Meta proíbe segmentação por interesses/comportamentos para menores de 18
  // Para idades que incluem menores: apenas localização e idade
  // Para 18+: segmentação demográfica básica
  const targeting = {
    age_min: segment.age_min,
    age_max: segment.age_max,
    geo_locations: {
      countries: [segment.country],
    },
    targeting_automation: { advantage_audience: 0 },
  };

  // Idioma e status de educação: apenas para 18+
  // Meta proíbe qualquer segmentação além de idade e país para menores de 18
  if (segment.age_min >= 18) {
    if (segment.languages?.length > 0) {
      targeting.locales = segment.languages;
    }
    if (segment.education_statuses?.length > 0) {
      targeting.education_statuses = segment.education_statuses;
    }
  }

  return targeting;
}

module.exports = { buildTargeting };
