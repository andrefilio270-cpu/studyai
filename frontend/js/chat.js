let currentProfessor = null;
let messages = [];
let conversationSaved = false;
let pendingImage = null;
let pendingImageType = null;
let currentSessionId = null;
let activeTab = 'professores';

const PROFESSORS = {};

async function initDashboard() {
  if (!requireAuth()) return;
  const user = getUser();
  renderHeader(user);
  await loadProfessors();

  // Ativa professor da URL se houver
  const params = new URLSearchParams(location.search);
  if (params.get('prof')) selectProfessor(params.get('prof'));
}

async function loadProfessors() {
  const lang = typeof getLang === 'function' ? getLang() : 'pt';
  const { ok, data } = await apiFetch('/chat/professors?lang=' + lang);
  if (ok) {
    Object.keys(PROFESSORS).forEach(k => delete PROFESSORS[k]);
    data.forEach(p => PROFESSORS[p.id] = p);
    renderSidebar(data);
  }
}

function renderSidebar(professors) {
  const list = document.getElementById('professor-list');
  if (!list) return;
  list.innerHTML = `
    <div class="sidebar-tabs">
      <button class="sidebar-tab active" id="tab-professores" onclick="switchTab('professores')">Professores</button>
      <button class="sidebar-tab" id="tab-historico" onclick="switchTab('historico')">Histórico</button>
    </div>
    <div id="tab-content-professores">
      ${professors.map(p => `
        <div class="professor-card" id="card-${p.id}" onclick="selectProfessor('${p.id}')">
          <div class="professor-card__emoji">${p.emoji}</div>
          <div class="professor-card__info">
            <div class="professor-card__name">${p.nome}</div>
            <div class="professor-card__subject">${p.materia}</div>
          </div>
        </div>
      `).join('')}
    </div>
    <div id="tab-content-historico" style="display:none">
      <div id="historico-list"><p style="color:var(--gray-text);font-size:.8rem;padding:12px 8px">Carregando...</p></div>
    </div>
  `;
}

async function switchTab(tab) {
  activeTab = tab;
  document.getElementById('tab-content-professores').style.display = tab === 'professores' ? 'block' : 'none';
  document.getElementById('tab-content-historico').style.display = tab === 'historico' ? 'block' : 'none';
  document.getElementById('tab-professores').classList.toggle('active', tab === 'professores');
  document.getElementById('tab-historico').classList.toggle('active', tab === 'historico');
  if (tab === 'historico') await loadHistorico();
}

async function loadHistorico() {
  const list = document.getElementById('historico-list');
  if (!list) return;
  const { ok, data } = await apiFetch('/conversations/historico');
  if (!ok || !data.length) {
    list.innerHTML = '<p style="color:var(--gray-text);font-size:.8rem;padding:12px 8px">Nenhuma conversa ainda.</p>';
    return;
  }
  const EMOJIS = { carlos:'📐',ana:'✍️',ricardo:'⚡',beatriz:'🧪',joao:'🏛️',marina:'🌿',lucas:'🌎',miguel:'🇪🇸',sofia:'🛠️' };
  list.innerHTML = data.map(c => {
    const date = new Date(c.atualizado_em).toLocaleDateString('pt-BR', { day:'2-digit', month:'short' });
    const emoji = EMOJIS[c.professor_id] || '📚';
    return `
      <div class="historico-item" onclick="openHistoricoItem(${c.id})">
        <span class="historico-item__emoji">${emoji}</span>
        <div class="historico-item__info">
          <div class="historico-item__title">${escapeHtml(c.titulo)}</div>
          <div class="historico-item__meta">${date} · ${c.total_mensagens} msgs</div>
        </div>
      </div>`;
  }).join('');
}

async function openHistoricoItem(id) {
  const { ok, data } = await apiFetch('/conversations/' + id);
  if (!ok) return;

  currentProfessor = data.professor_id;
  messages = data.mensagens || [];
  currentSessionId = data.session_id;
  conversationSaved = data.is_saved;

  const p = PROFESSORS[data.professor_id] || { nome: data.professor_id, emoji: '📚', materia: '' };

  document.querySelectorAll('.professor-card').forEach(c => c.classList.remove('active'));

  const chatArea = document.getElementById('chat-area');
  chatArea.innerHTML = `
    <div class="chat-header">
      <div class="chat-header__emoji">${p.emoji}</div>
      <div class="chat-header__info"><h2>${p.nome}</h2><p>${p.materia}</p></div>
      <div class="chat-header__actions">
        <button class="btn btn-outline btn-sm" style="border-color:var(--gray-mid);color:var(--gray-text)" onclick="saveConversation()">💾 Salvar</button>
      </div>
    </div>
    <div class="chat-messages" id="chat-messages"></div>
    <div class="chat-input-area">
      <div id="image-preview-bar" style="display:none;align-items:center;gap:10px;margin-bottom:10px;background:var(--gray-light);border-radius:10px;padding:8px 12px">
        <img id="image-preview-thumb" src="" style="height:56px;border-radius:6px;object-fit:cover;max-width:100px">
        <span id="image-preview-name" style="font-size:.8rem;color:var(--gray-text);flex:1"></span>
        <button onclick="removeImage()" style="background:none;border:none;font-size:1.1rem;color:var(--danger);cursor:pointer">✕</button>
      </div>
      <div class="chat-input-wrap">
        <input type="file" id="image-input" accept="image/*" style="display:none" onchange="handleImageSelect(event)">
        <button onclick="document.getElementById('image-input').click()" title="Enviar imagem" style="background:none;border:none;font-size:1.3rem;padding:4px 8px;color:var(--gray-text);cursor:pointer;flex-shrink:0">🖼️</button>
        <textarea class="chat-input" id="chat-input" placeholder="Digite sua pergunta ou envie uma imagem..." rows="1" onkeydown="handleKey(event)" oninput="autoResize(this)"></textarea>
        <button class="chat-send-btn" onclick="sendMessage()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
    </div>
  `;

  const msgs = document.getElementById('chat-messages');
  messages.forEach(m => {
    const avatar = m.role === 'user' ? '?' : p.emoji;
    appendMessage(m.role, m.content, avatar);
  });
  msgs.scrollTop = msgs.scrollHeight;
  document.getElementById('chat-input').focus();
}

function selectProfessor(id) {
  if (PROFESSORS[id] === undefined) return;
  currentProfessor = id;
  messages = [];
  conversationSaved = false;
  pendingImage = null;
  pendingImageType = null;
  currentSessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);

  document.querySelectorAll('.professor-card').forEach(c => c.classList.remove('active'));
  const card = document.getElementById('card-' + id);
  if (card) card.classList.add('active');

  const p = PROFESSORS[id];
  document.getElementById('chat-area').innerHTML = `
    <div class="chat-header" id="chat-header">
      <div class="chat-header__emoji">${p.emoji}</div>
      <div class="chat-header__info">
        <h2>${p.nome}</h2>
        <p>${p.materia}</p>
      </div>
      <div class="chat-header__actions">
        <button class="btn btn-outline btn-sm" style="border-color:var(--gray-mid);color:var(--gray-text)" onclick="saveConversation()">💾 Salvar</button>
      </div>
    </div>
    <div class="chat-messages" id="chat-messages">
      <div class="message message--ai">
        <div class="message__avatar">${p.emoji}</div>
        <div class="message__bubble">Olá! Sou o <strong>${p.nome}</strong>. Como posso te ajudar com <strong>${p.materia}</strong> hoje?</div>
      </div>
    </div>
    <div class="chat-input-area">
      <div id="image-preview-bar" style="display:none;align-items:center;gap:10px;margin-bottom:10px;background:var(--gray-light);border-radius:10px;padding:8px 12px">
        <img id="image-preview-thumb" src="" style="height:56px;border-radius:6px;object-fit:cover;max-width:100px">
        <span id="image-preview-name" style="font-size:.8rem;color:var(--gray-text);flex:1"></span>
        <button onclick="removeImage()" style="background:none;border:none;font-size:1.1rem;color:var(--danger);cursor:pointer">✕</button>
      </div>
      <div class="chat-input-wrap">
        <input type="file" id="image-input" accept="image/*" style="display:none" onchange="handleImageSelect(event)">
        <button onclick="document.getElementById('image-input').click()" title="Enviar imagem"
          style="background:none;border:none;font-size:1.3rem;padding:4px 8px;color:var(--gray-text);cursor:pointer;flex-shrink:0">🖼️</button>
        <textarea class="chat-input" id="chat-input" placeholder="Digite sua pergunta ou envie uma imagem..." rows="1"
          onkeydown="handleKey(event)" oninput="autoResize(this)"></textarea>
        <button class="chat-send-btn" onclick="sendMessage()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
    </div>
  `;
  document.getElementById('chat-input').focus();
}

function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 120) + 'px';
}

function handleKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
}

function handleImageSelect(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) { showToast('Imagem muito grande. Máximo 5MB.', 'error'); return; }

  const reader = new FileReader();
  reader.onload = (e) => {
    const base64 = e.target.result.split(',')[1];
    pendingImage = base64;
    pendingImageType = file.type;

    const bar = document.getElementById('image-preview-bar');
    const thumb = document.getElementById('image-preview-thumb');
    const name = document.getElementById('image-preview-name');
    thumb.src = e.target.result;
    name.textContent = file.name;
    bar.style.display = 'flex';
  };
  reader.readAsDataURL(file);
  event.target.value = '';
}

function removeImage() {
  pendingImage = null;
  pendingImageType = null;
  document.getElementById('image-preview-bar').style.display = 'none';
  document.getElementById('image-preview-thumb').src = '';
}

async function sendMessage() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text && !pendingImage || !currentProfessor) return;

  const displayText = text || '📷 Imagem enviada';
  input.value = '';
  autoResize(input);

  const userMsg = { role: 'user', content: text || 'O que você vê nessa imagem?' };
  messages.push(userMsg);

  // Mostra imagem no chat se houver
  if (pendingImage) {
    const imageDataUrl = `data:${pendingImageType};base64,${pendingImage}`;
    appendMessageWithImage('user', text, imageDataUrl, '?');
  } else {
    appendMessage('user', displayText, '?');
  }

  const typing = appendTyping();

  const body = { professor_id: currentProfessor, mensagens: messages, idioma: getLang() };
  if (pendingImage) {
    body.imagem = pendingImage;
    body.imagemType = pendingImageType;
  }

  const imageParaEnviar = pendingImage;
  removeImage();

  const { ok, status, data } = await apiFetch('/chat', {
    method: 'POST',
    body: JSON.stringify(body)
  });

  typing.remove();

  if (status === 402) {
    messages.pop();
    showUpgradeModal();
    return;
  }

  if (!ok) {
    showToast(data.error || 'Erro ao enviar mensagem.', 'error');
    messages.pop();
    return;
  }

  const aiMsg = { role: 'assistant', content: data.reply };
  messages.push(aiMsg);
  const p = PROFESSORS[currentProfessor];
  appendMessage('ai', data.reply, p.emoji);

  // Atualiza créditos se free
  const user = getUser();
  if (user.plano === 'free') {
    user.perguntas_usadas = (user.perguntas_usadas || 0) + 1;
    localStorage.setItem('sa_user', JSON.stringify(user));
    renderHeader(user);
  }

  // Auto-save em background
  autoSaveConversation();
}

async function autoSaveConversation() {
  if (!currentSessionId || !currentProfessor || messages.length < 2) return;

  // Título: primeiros 40 chars da primeira pergunta do usuário
  const firstUser = messages.find(m => m.role === 'user');
  const titulo = firstUser ? firstUser.content.slice(0, 40) : 'Conversa';

  // Filtra imagens do histórico para não salvar base64 pesado
  const mensagensTexto = messages.map(m => ({
    role: m.role,
    content: typeof m.content === 'string' ? m.content : '[imagem]'
  }));

  await apiFetch('/conversations/autosave', {
    method: 'POST',
    body: JSON.stringify({
      session_id: currentSessionId,
      professor_id: currentProfessor,
      titulo,
      mensagens: mensagensTexto
    })
  });
}

function appendMessageWithImage(role, text, imageDataUrl, avatar) {
  const msgs = document.getElementById('chat-messages');
  if (!msgs) return;
  const div = document.createElement('div');
  div.className = `message message--${role}`;
  div.innerHTML = `
    <div class="message__avatar">${avatar}</div>
    <div class="message__bubble">
      <img src="${imageDataUrl}" style="max-width:240px;max-height:200px;border-radius:8px;display:block;margin-bottom:${text ? '8px' : '0'}">
      ${text ? `<span>${escapeHtml(text)}</span>` : ''}
    </div>
  `;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function appendMessage(role, content, avatar) {
  const msgs = document.getElementById('chat-messages');
  if (!msgs) return;
  const div = document.createElement('div');
  div.className = `message message--${role}`;
  const formatted = role === 'ai' ? formatMessage(content) : escapeHtml(content);
  div.innerHTML = `
    <div class="message__avatar">${avatar}</div>
    <div class="message__bubble">${formatted}</div>
  `;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  return div;
}

function appendTyping() {
  const msgs = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = 'message message--ai';
  const p = PROFESSORS[currentProfessor];
  div.innerHTML = `
    <div class="message__avatar">${p.emoji}</div>
    <div class="message__bubble">
      <div class="typing-indicator"><span></span><span></span><span></span></div>
    </div>
  `;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  return div;
}

function formatMessage(text) {
  return escapeHtml(text)
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    .replace(/\n/g, '<br>');
}

function escapeHtml(t) {
  return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

async function saveConversation() {
  if (!messages.length) { showToast('Nenhuma mensagem para salvar.'); return; }
  if (conversationSaved) { showToast('Conversa já foi salva.'); return; }

  // Gera título
  const { data: titleData } = await apiFetch('/chat/title', {
    method: 'POST',
    body: JSON.stringify({ mensagens: messages })
  });
  const titulo = titleData.titulo || 'Conversa';

  const { ok, data } = await apiFetch('/conversations/save', {
    method: 'POST',
    body: JSON.stringify({ professor_id: currentProfessor, titulo, mensagens: messages })
  });

  if (ok) {
    conversationSaved = true;
    showToast('Conversa salva com sucesso!', 'success');
  } else {
    showToast(data.error || 'Erro ao salvar.', 'error');
  }
}

function showUpgradeModal() {
  const modal = document.getElementById('upgrade-modal');
  if (modal) modal.style.display = 'flex';
}

function closeUpgradeModal() {
  const modal = document.getElementById('upgrade-modal');
  if (modal) modal.style.display = 'none';
}

async function upgradePlan(plano) {
  const { ok, data } = await apiFetch('/plans/upgrade', {
    method: 'POST',
    body: JSON.stringify({ plano })
  });
  if (ok) {
    const user = getUser();
    user.plano = data.user.plano;
    user.plano_expira_em = data.user.plano_expira_em;
    user.perguntas_usadas = 0;
    localStorage.setItem('sa_user', JSON.stringify(user));
    renderHeader(user);
    closeUpgradeModal();
    showToast(`Plano ${plano} ativado com sucesso!`, 'success');
  } else {
    showToast(data.error || 'Erro ao atualizar plano.', 'error');
  }
}

window.initDashboard = initDashboard;
window.selectProfessor = selectProfessor;
window.sendMessage = sendMessage;
window.handleKey = handleKey;
window.autoResize = autoResize;
window.saveConversation = saveConversation;
window.showUpgradeModal = showUpgradeModal;
window.closeUpgradeModal = closeUpgradeModal;
window.upgradePlan = upgradePlan;
window.handleImageSelect = handleImageSelect;
window.removeImage = removeImage;
window.switchTab = switchTab;
window.openHistoricoItem = openHistoricoItem;
window.autoSaveConversation = autoSaveConversation;
