// Preços localizados por mercado (não conversão — preços reais de cada região)
const LOCALIZED_PRICES = {
  BRL: { semanal: 9.90,    mensal: 29.90,   anual: 199.90,  symbol: 'R$',   decimals: 2 },
  USD: { semanal: 2.99,    mensal: 7.99,    anual: 49.99,   symbol: '$',    decimals: 2 },
  EUR: { semanal: 2.49,    mensal: 6.99,    anual: 44.99,   symbol: '€',    decimals: 2 },
  GBP: { semanal: 1.99,    mensal: 5.99,    anual: 39.99,   symbol: '£',    decimals: 2 },
  CAD: { semanal: 3.99,    mensal: 10.99,   anual: 64.99,   symbol: 'CA$',  decimals: 2 },
  AUD: { semanal: 4.49,    mensal: 12.99,   anual: 74.99,   symbol: 'A$',   decimals: 2 },
  MXN: { semanal: 59,      mensal: 169,     anual: 999,     symbol: '$',    decimals: 0 },
  ARS: { semanal: 2500,    mensal: 6900,    anual: 44900,   symbol: '$',    decimals: 0 },
  CLP: { semanal: 2490,    mensal: 6990,    anual: 44990,   symbol: '$',    decimals: 0 },
  COP: { semanal: 12900,   mensal: 35900,   anual: 229900,  symbol: '$',    decimals: 0 },
  PEN: { semanal: 11.90,   mensal: 29.90,   anual: 189.90,  symbol: 'S/',   decimals: 2 },
  UYU: { semanal: 119,     mensal: 329,     anual: 1990,    symbol: '$U',   decimals: 0 },
  BOB: { semanal: 20.90,   mensal: 54.90,   anual: 349.90,  symbol: 'Bs',   decimals: 2 },
  CHF: { semanal: 2.69,    mensal: 7.49,    anual: 47.99,   symbol: 'Fr',   decimals: 2 },
  JPY: { semanal: 449,     mensal: 1290,    anual: 7990,    symbol: '¥',    decimals: 0 },
  INR: { semanal: 249,     mensal: 649,     anual: 3999,    symbol: '₹',    decimals: 0 },
  ZAR: { semanal: 59,      mensal: 159,     anual: 999,     symbol: 'R',    decimals: 0 },
};

// Mapa de país → moeda
const COUNTRY_CURRENCY = {
  BR:'BRL', US:'USD', GB:'GBP', CA:'CAD', AU:'AUD',
  MX:'MXN', AR:'ARS', CL:'CLP', CO:'COP', PE:'PEN',
  UY:'UYU', BO:'BOB', PY:'PYG', VE:'USD',
  CH:'CHF', DE:'EUR', FR:'EUR', IT:'EUR', ES:'EUR', PT:'EUR',
  NL:'EUR', BE:'EUR', AT:'EUR', PL:'EUR', GR:'EUR',
  JP:'JPY', IN:'INR', ZA:'ZAR',
};

let geoData = null;
let currentCurrency = 'BRL';

function getPrices() {
  return LOCALIZED_PRICES[currentCurrency] || LOCALIZED_PRICES['USD'];
}

function formatLocalPrice(key) {
  const prices = getPrices();
  const val = prices[key];
  const dec = prices.decimals;
  const sym = prices.symbol;
  if (dec === 0) return `${sym} ${Math.round(val).toLocaleString()}`;
  return `${sym} ${val.toFixed(dec)}`;
}

async function detectGeo() {
  try {
    const res = await fetch('https://ipapi.co/json/');
    const data = await res.json();
    geoData = data;
    const country = data.country_code || 'BR';
    currentCurrency = COUNTRY_CURRENCY[country] || data.currency || 'USD';
    localStorage.setItem('sa_currency', currentCurrency);
    localStorage.setItem('sa_country', country);
    return data;
  } catch {
    currentCurrency = localStorage.getItem('sa_currency') || 'BRL';
    return { currency: currentCurrency, country_code: 'BR' };
  }
}

async function updateAllPrices() {
  if (!geoData) await detectGeo();

  document.querySelectorAll('[data-preco]').forEach(el => {
    el.textContent = formatLocalPrice(el.dataset.preco);
  });

  const anualMes = document.querySelector('[data-preco-anual-mes]');
  if (anualMes) {
    const prices = getPrices();
    const val = prices.anual / 12;
    const dec = prices.decimals;
    const sym = prices.symbol;
    const formatted = dec === 0 ? `${sym} ${Math.round(val).toLocaleString()}` : `${sym} ${val.toFixed(dec)}`;
    const perMonth = t ? t('plan.yearly.month') : '/mês';
    anualMes.textContent = formatted + perMonth;
  }
}

window.detectGeo = detectGeo;
window.updateAllPrices = updateAllPrices;
window.getPrices = getPrices;
window.formatLocalPrice = formatLocalPrice;
window.currentCurrency = currentCurrency;
