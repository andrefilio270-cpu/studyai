const API = '/api';

function getToken() { return localStorage.getItem('sa_token'); }
function getUser() {
  try { return JSON.parse(localStorage.getItem('sa_user')); } catch { return null; }
}
function setAuth(token, user) {
  localStorage.setItem('sa_token', token);
  localStorage.setItem('sa_user', JSON.stringify(user));
}
function clearAuth() {
  localStorage.removeItem('sa_token');
  localStorage.removeItem('sa_user');
}

function requireAuth() {
  if (!getToken()) { window.location.href = '/login.html'; return false; }
  return true;
}
function redirectIfAuth() {
  if (getToken()) { window.location.href = '/dashboard.html'; }
}

async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(API + path, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401) { clearAuth(); window.location.href = '/login.html'; }
  return { ok: res.ok, status: res.status, data };
}

function showToast(msg, type = '') {
  const container = document.getElementById('toast-container') || (() => {
    const c = document.createElement('div');
    c.id = 'toast-container';
    c.className = 'toast-container';
    document.body.appendChild(c);
    return c;
  })();
  const toast = document.createElement('div');
  toast.className = `toast${type ? ' toast--' + type : ''}`;
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

function renderHeader(user) {
  const header = document.getElementById('header');
  if (!header) return;
  const remaining = user.plano === 'free' ? Math.max(0, 5 - (user.perguntas_usadas || 0)) : '∞';
  const tr = typeof t === 'function' ? t : (k) => k;
  const label = user.plano === 'free'
    ? `<span>${remaining}</span> ${tr('header.questions')}`
    : `${tr('header.plan')} ${user.plano}`;
  header.innerHTML = `
    <div class="header__logo">Study<span>AI</span></div>
    <nav style="display:flex;gap:4px">
      <a href="/dashboard.html" class="nav-link">📚 <span data-i18n="nav.professors">${tr('nav.professors')}</span></a>
      <a href="/chat-publico.html" class="nav-link">💬 <span data-i18n="nav.chat">${tr('nav.chat')}</span></a>
      <a href="/minhas-conversas.html" class="nav-link">📁 <span data-i18n="nav.conversations">${tr('nav.conversations')}</span></a>
      <a href="/planos.html" class="nav-link">💳 <span data-i18n="nav.plans">${tr('nav.plans')}</span></a>
      <a href="/analytics.html" class="nav-link">📊 Stats</a>
      <a href="/perfil.html" class="nav-link">👤 <span data-i18n="nav.profile">${tr('nav.profile')}</span></a>
    </nav>
    <div class="header__actions">
      <div id="lang-selector-wrap"></div>
      <div class="header__credits">${label}</div>
      <button class="btn btn-outline btn-sm" onclick="logout()" data-i18n="nav.logout">${tr('nav.logout')}</button>
    </div>
  `;
  if (typeof renderLangSelector === 'function') renderLangSelector('lang-selector-wrap');
}

function logout() {
  clearAuth();
  window.location.href = '/login.html';
}

window.apiFetch = apiFetch;
window.getToken = getToken;
window.getUser = getUser;
window.setAuth = setAuth;
window.clearAuth = clearAuth;
window.requireAuth = requireAuth;
window.redirectIfAuth = redirectIfAuth;
window.showToast = showToast;
window.renderHeader = renderHeader;
window.logout = logout;
