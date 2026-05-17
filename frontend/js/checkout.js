async function startCheckout(plano) {
  if (!getToken()) {
    window.location.href = '/cadastro.html';
    return;
  }

  const btn = document.querySelector(`[data-checkout="${plano}"]`);
  if (btn) {
    btn.disabled = true;
    btn.textContent = '⏳ Aguarde...';
  }

  const currency = localStorage.getItem('sa_currency') || 'BRL';
  const idioma = localStorage.getItem('sa_lang') || 'pt';

  const { ok, data } = await apiFetch('/payments/checkout', {
    method: 'POST',
    body: JSON.stringify({ plano, currency, idioma })
  });

  if (ok && data.url) {
    window.location.href = data.url;
  } else {
    showToast(data?.error || 'Erro ao iniciar pagamento.', 'error');
    if (btn) {
      btn.disabled = false;
      btn.textContent = btn.dataset.label || 'Assinar';
    }
  }
}

window.startCheckout = startCheckout;
