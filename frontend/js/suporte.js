let supportMessages = [];
let supportOpen = false;

function toggleSupport() {
  supportOpen = !supportOpen;
  const panel = document.getElementById('support-panel');
  if (!panel) return;
  panel.style.display = supportOpen ? 'flex' : 'none';
  if (supportOpen && !supportMessages.length) {
    const greeting = typeof t === 'function' ? t('support.greeting') : 'Oi! Sou a Sofia do suporte. Como posso ajudar?';
    addSupportMessage('ai', greeting);
  }
}

function addSupportMessage(role, text) {
  supportMessages.push({ role: role === 'ai' ? 'assistant' : 'user', content: text });
  const msgs = document.getElementById('support-messages');
  if (!msgs) return;
  const div = document.createElement('div');
  div.className = `message message--${role}`;
  div.innerHTML = role === 'ai'
    ? `<div class="message__avatar">🛠️</div><div class="message__bubble" style="font-size:.85rem">${text}</div>`
    : `<div class="message__avatar" style="background:var(--mid-blue);color:white;font-size:.75rem">EU</div><div class="message__bubble" style="font-size:.85rem">${text}</div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

async function sendSupportMessage() {
  const input = document.getElementById('support-input');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  addSupportMessage('user', text);

  const msgs = document.getElementById('support-messages');
  const typing = document.createElement('div');
  typing.className = 'message message--ai';
  typing.id = 'support-typing';
  typing.innerHTML = '<div class="message__avatar">🛠️</div><div class="message__bubble"><div class="typing-indicator"><span></span><span></span><span></span></div></div>';
  msgs.appendChild(typing);
  msgs.scrollTop = msgs.scrollHeight;

  try {
    const { ok, data } = await apiFetch('/chat/suporte', {
      method: 'POST',
      body: JSON.stringify({
        mensagens: supportMessages.filter(m => m.role !== 'typing')
      })
    });

    document.getElementById('support-typing')?.remove();

    if (ok) {
      addSupportMessage('ai', data.reply);
    } else {
      addSupportMessage('ai', 'Desculpe, ocorreu um erro. Tente novamente.');
    }
  } catch {
    document.getElementById('support-typing')?.remove();
    addSupportMessage('ai', 'Erro de conexão. Verifique sua internet.');
  }
}

function handleSupportKey(e) {
  if (e.key === 'Enter') sendSupportMessage();
}

function renderSupportFAB() {
  const fab = document.createElement('div');
  fab.className = 'support-fab';
  fab.innerHTML = `
    <button class="support-fab__btn" onclick="toggleSupport()" title="Suporte">🎧</button>
    <span class="support-fab__label">Suporte</span>
    <div class="support-panel" id="support-panel" style="display:none">
      <div class="support-panel__header">
        <div>
          <h3 id="support-title">🛠️ Sofia — Suporte</h3>
          <p style="font-size:.75rem;opacity:.75" id="support-subtitle">Dúvidas sobre a plataforma</p>
        </div>
        <button class="support-panel__close" onclick="toggleSupport()">✕</button>
      </div>
      <div class="support-panel__messages" id="support-messages"></div>
      <div class="support-panel__input">
        <input type="text" id="support-input" placeholder="Digite sua dúvida..." onkeydown="handleSupportKey(event)">
        <button id="support-send-btn" onclick="sendSupportMessage()">Enviar</button>
      </div>
    </div>
  `;
  document.body.appendChild(fab);
  // Apply translations to support panel
  if (typeof t === 'function') {
    const title = document.getElementById('support-title');
    const subtitle = document.getElementById('support-subtitle');
    const input = document.getElementById('support-input');
    const sendBtn = document.getElementById('support-send-btn');
    if (title) title.textContent = t('support.title');
    if (subtitle) subtitle.textContent = t('support.subtitle');
    if (input) input.placeholder = t('support.input_ph');
    if (sendBtn) sendBtn.textContent = t('support.send');
  }
}

function contactHuman() {
  const user = getUser();
  const subject = encodeURIComponent('Suporte StudyAI');
  const body = encodeURIComponent(`Usuário: ${user?.nome || 'Não identificado'}\nEmail: ${user?.email || ''}\n\nDescreva seu problema aqui:`);
  window.open(`mailto:suporte@studyai.com.br?subject=${subject}&body=${body}`);
}

document.addEventListener('DOMContentLoaded', () => {
  renderSupportFAB();
});

window.toggleSupport = toggleSupport;
window.sendSupportMessage = sendSupportMessage;
window.handleSupportKey = handleSupportKey;
window.contactHuman = contactHuman;
