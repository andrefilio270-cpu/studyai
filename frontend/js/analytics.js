// Rastreamento automático de visitas
(function() {
  fetch('/api/analytics/pageview', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      path: window.location.pathname,
      referrer: document.referrer
    })
  }).catch(() => {});
})();

function trackEvent(tipo, dados) {
  fetch('/api/analytics/evento', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tipo, dados })
  }).catch(() => {});
}

window.trackEvent = trackEvent;
