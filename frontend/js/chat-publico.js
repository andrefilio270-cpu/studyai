let activeFilter = '';

async function initPublicChat() {
  if (!requireAuth()) return;
  const user = getUser();
  renderHeader(user);
  renderFilters();
  renderPostMateriaSelect();
  await loadPosts();
}

function renderPostMateriaSelect() {
  const sel = document.getElementById('new-post-materia');
  if (!sel) return;
  const lang = typeof getLang === 'function' ? getLang() : 'pt';
  const { all, list } = SUBJECTS_BY_LANG[lang] || SUBJECTS_BY_LANG.pt;
  sel.innerHTML = `<option value="">${all}</option>` + list.map(m => `<option>${m}</option>`).join('');
}

const SUBJECTS_BY_LANG = {
  pt: { all: 'Todas', list: ['Matemática','Português','Física','Química','História','Biologia','Inglês','Espanhol'] },
  en: { all: 'All',   list: ['Mathematics','English','Physics','Chemistry','History','Biology','Spanish'] },
  es: { all: 'Todas', list: ['Matemáticas','Español','Física','Química','Historia','Biología','Inglés'] },
};

function renderFilters() {
  const filters = document.getElementById('materia-filters');
  if (!filters) return;
  const lang = typeof getLang === 'function' ? getLang() : 'pt';
  const { all, list } = SUBJECTS_BY_LANG[lang] || SUBJECTS_BY_LANG.pt;
  const items = [all, ...list];
  filters.innerHTML = items.map((m, i) => `
    <button class="filter-btn ${i === 0 ? 'active' : ''}" onclick="filterByMateria('${i === 0 ? '' : m}', this)">${m}</button>
  `).join('');
}

async function filterByMateria(materia, btn) {
  activeFilter = materia;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  await loadPosts();
}

async function loadPosts() {
  const container = document.getElementById('posts-container');
  if (!container) return;
  container.innerHTML = '<p style="color:var(--gray-text);text-align:center;padding:24px">Carregando...</p>';

  const query = activeFilter ? `?materia=${encodeURIComponent(activeFilter)}` : '';
  const { ok, data } = await apiFetch('/public-chat' + query);

  if (!ok) { container.innerHTML = '<p style="color:var(--danger)">Erro ao carregar posts.</p>'; return; }
  if (!data.length) { container.innerHTML = '<p style="color:var(--gray-text);text-align:center;padding:40px">Nenhum post ainda. Seja o primeiro a postar!</p>'; return; }

  container.innerHTML = data.map(post => renderPost(post)).join('');
}

function renderPost(post) {
  const initial = (post.autor_nome || 'U')[0].toUpperCase();
  const badge = post.autor_plano === 'anual' ? '<span class="profile-badge badge-anual" style="font-size:.65rem">Estudante Elite ⭐</span>'
    : post.autor_plano === 'mensal' ? '<span class="profile-badge badge-mensal" style="font-size:.65rem">Membro</span>' : '';
  const date = new Date(post.criado_em).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  return `
    <div class="post-card" id="post-${post.id}">
      <div class="post-card__header">
        <div class="post-card__avatar">${initial}</div>
        <div>
          <div class="post-card__author">${escapeHtml(post.autor_nome)} ${badge}</div>
          <div class="post-card__date">${date}</div>
        </div>
        ${post.materia_tag ? `<span class="post-card__tag">${escapeHtml(post.materia_tag)}</span>` : ''}
      </div>
      <div class="post-card__content">${escapeHtml(post.conteudo).replace(/\n/g, '<br>')}</div>
      <div class="post-card__actions">
        <button class="like-btn" onclick="toggleLike(${post.id}, this)">👍 ${post.curtidas}</button>
        <button class="reply-toggle" onclick="toggleReplies(${post.id})">💬 Responder</button>
      </div>
      <div class="replies-section" id="replies-${post.id}" style="display:none"></div>
    </div>
  `;
}

async function submitPost() {
  const textarea = document.getElementById('new-post-content');
  const select = document.getElementById('new-post-materia');
  const text = textarea.value.trim();
  if (!text) { showToast('Digite algo para publicar.', 'error'); return; }

  const btn = document.getElementById('post-btn');
  btn.disabled = true;
  btn.textContent = 'Verificando...';

  const { ok, status, data } = await apiFetch('/public-chat', {
    method: 'POST',
    body: JSON.stringify({ conteudo: text, materia_tag: select.value || null })
  });

  btn.disabled = false;
  btn.textContent = 'Publicar';

  if (ok) {
    textarea.value = '';
    select.value = '';
    showToast('Post publicado!', 'success');
    await loadPosts();
  } else if (status === 422) {
    showToast(data.error, 'error');
  } else if (status === 403) {
    showToast(data.error, 'error');
  } else {
    showToast(data.error || 'Erro ao publicar.', 'error');
  }
}

async function toggleLike(postId, btn) {
  const { ok, data } = await apiFetch(`/public-chat/${postId}/like`, { method: 'POST' });
  if (ok) {
    btn.classList.toggle('liked', data.liked);
    // Atualiza contagem
    const post = document.getElementById('post-' + postId);
    if (post) {
      const likeBtn = post.querySelector('.like-btn');
      const current = parseInt(likeBtn.textContent.replace(/[^0-9]/g, '')) || 0;
      likeBtn.textContent = `👍 ${data.liked ? current + 1 : Math.max(0, current - 1)}`;
    }
  }
}

async function toggleReplies(postId) {
  const section = document.getElementById('replies-' + postId);
  if (!section) return;
  if (section.style.display === 'none') {
    section.style.display = 'flex';
    section.style.flexDirection = 'column';
    section.style.gap = '10px';
    await loadReplies(postId);
  } else {
    section.style.display = 'none';
  }
}

async function loadReplies(postId) {
  const section = document.getElementById('replies-' + postId);
  section.innerHTML = '<p style="font-size:.82rem;color:var(--gray-text)">Carregando...</p>';
  const { ok, data } = await apiFetch(`/public-chat/${postId}/replies`);
  if (!ok) { section.innerHTML = ''; return; }

  const repliesHtml = data.map(r => {
    const init = (r.autor_nome || 'U')[0].toUpperCase();
    return `<div class="reply-item">
      <div class="reply-item__avatar">${init}</div>
      <div class="reply-item__bubble"><strong>${escapeHtml(r.autor_nome)}</strong> ${escapeHtml(r.conteudo)}</div>
    </div>`;
  }).join('');

  section.innerHTML = repliesHtml + `
    <div class="reply-input-row">
      <input type="text" placeholder="Escreva uma resposta..." id="reply-input-${postId}" onkeydown="if(event.key==='Enter')submitReply(${postId})">
      <button class="btn btn-primary btn-sm" onclick="submitReply(${postId})">Responder</button>
    </div>
  `;
}

async function submitReply(postId) {
  const input = document.getElementById('reply-input-' + postId);
  const text = input.value.trim();
  if (!text) return;

  const { ok, data } = await apiFetch(`/public-chat/${postId}/reply`, {
    method: 'POST',
    body: JSON.stringify({ conteudo: text })
  });

  if (ok) {
    input.value = '';
    await loadReplies(postId);
  } else {
    showToast(data.error || 'Erro ao responder.', 'error');
  }
}

function escapeHtml(t = '') {
  return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

window.initPublicChat = initPublicChat;
window.filterByMateria = filterByMateria;
window.submitPost = submitPost;
window.toggleLike = toggleLike;
window.toggleReplies = toggleReplies;
window.submitReply = submitReply;
