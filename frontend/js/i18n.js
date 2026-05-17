const TRANSLATIONS = {
  pt: {
    // Nav
    'nav.professors': 'Professores',
    'nav.chat': 'Chat',
    'nav.conversations': 'Conversas',
    'nav.profile': 'Perfil',
    'nav.logout': 'Sair',
    'nav.plans': 'Planos',
    'nav.login': 'Entrar',
    'nav.signup': 'Começar grátis',
    'header.questions': 'perguntas',
    'header.plan': 'Plano',

    // Landing hero
    'hero.title': 'Aprenda com os melhores',
    'hero.title.highlight': 'professores de IA',
    'hero.sub': '8 professores especializados disponíveis 24/7, sem julgamentos.',
    'hero.cta1': 'Começar grátis — 5 perguntas hoje',
    'hero.cta2': 'Ver planos',
    'hero.no_card': 'Sem cartão de crédito. Cadastro em 30 segundos.',

    // Plans
    'plans.title': 'Planos e preços',
    'plans.sub': 'Comece grátis, faça upgrade quando quiser',
    'plan.free.name': 'Gratuito',
    'plan.weekly.name': 'Semanal',
    'plan.monthly.name': 'Mensal',
    'plan.yearly.name': 'Anual',
    'plan.per.week': '/semana',
    'plan.per.month': '/mês',
    'plan.per.year': '/ano',
    'plan.per.always': '/sempre',
    'plan.popular': '⭐ MAIS POPULAR',
    'plan.yearly.equiv': 'Equivale a',
    'plan.yearly.month': '/mês',
    'plan.economy': 'de economia',
    'plan.free.feat1': '5 perguntas para testar',
    'plan.free.feat2': 'Todos os 8 professores',
    'plan.free.feat3': 'Histórico por 7 dias',
    'plan.weekly.feat1': 'Perguntas ilimitadas',
    'plan.weekly.feat2': 'Todos os 8 professores',
    'plan.weekly.feat3': 'Histórico por 30 dias',
    'plan.monthly.feat1': 'Perguntas ilimitadas',
    'plan.monthly.feat2': 'Histórico por 1 ano',
    'plan.monthly.feat3': 'Chat da comunidade',
    'plan.monthly.feat4': 'Badge "Membro"',
    'plan.yearly.feat1': 'Tudo do Mensal',
    'plan.yearly.feat2': 'Conversas salvas para sempre',
    'plan.yearly.feat3': 'Badge "Estudante Elite" dourado',
    'plan.yearly.feat4': 'Acesso prioritário a novos recursos',
    'btn.start_free': 'Começar grátis',
    'btn.subscribe': 'Assinar',
    'btn.best_value': 'Melhor valor!',

    // Features
    'features.title': 'Por que o StudyAI?',
    'features.sub': 'Muito mais do que um simples chatbot',
    'feat1.title': 'Chat por matéria',
    'feat1.desc': 'Cada professor só responde sua especialidade, com qualidade e profundidade reais.',
    'feat2.title': 'Salve suas conversas',
    'feat2.desc': 'Revise suas aulas quando quiser, exporte em PDF e compartilhe com a comunidade.',
    'feat3.title': 'Chat da Comunidade',
    'feat3.desc': 'Interaja com outros estudantes, compartilhe dicas e tire dúvidas coletivas.',
    'feat4.title': 'Moderação por IA',
    'feat4.desc': 'Ambiente 100% focado em estudos — moderação automática em tempo real.',
    'feat5.title': 'Funciona em qualquer tela',
    'feat5.desc': 'Desktop, tablet ou celular — estude onde e quando quiser.',
    'feat6.title': 'Respostas instantâneas',
    'feat6.desc': 'Sem espera, sem filas. Seus professores estão sempre disponíveis 24/7.',

    // Professors section
    'profs.title': 'Conheça nossos professores',
    'profs.sub': 'Cada professor tem personalidade, especialidade e método de ensino únicos',

    // Auth
    'login.title': 'Bem-vindo de volta!',
    'login.email': 'E-mail',
    'login.password': 'Senha',
    'login.btn': 'Entrar',
    'login.loading': 'Entrando...',
    'login.no_account': 'Não tem conta?',
    'login.signup_link': 'Cadastre-se grátis',
    'login.back': '← Voltar para o início',
    'register.title': 'Crie sua conta gratuita',
    'register.name': 'Nome completo',
    'register.name_ph': 'Seu nome',
    'register.email_ph': 'seu@email.com',
    'register.pass_ph': 'Mínimo 6 caracteres',
    'register.btn': 'Criar conta grátis',
    'register.loading': 'Criando conta...',
    'register.has_account': 'Já tem conta?',
    'register.login_link': 'Entrar',

    // Dashboard
    'dash.welcome.title': 'Escolha um professor para começar',
    'dash.welcome.sub': 'Selecione uma matéria na barra lateral e tire suas dúvidas com nossos professores de IA especializados.',
    'dash.sidebar.title': 'Professores',
    'chat.input.ph': 'Digite sua pergunta ou envie uma imagem...',
    'chat.save': '💾 Salvar',
    'chat.tab.professors': 'Professores',
    'chat.tab.history': 'Histórico',
    'chat.history.empty': 'Nenhuma conversa ainda.',
    'chat.history.loading': 'Carregando...',
    'upgrade.title': '🚀 Suas 5 perguntas gratuitas acabaram!',
    'upgrade.sub': 'Faça upgrade para continuar aprendendo',
    'upgrade.dismiss': 'Agora não',

    // Conversations
    'convs.title': '📁 Minhas Conversas',
    'convs.sub': 'Suas conversas salvas com os professores.',
    'convs.search': 'Buscar por título...',
    'convs.all_profs': 'Todos os professores',
    'convs.loading': 'Carregando...',
    'convs.empty': 'Nenhuma conversa salva ainda.',
    'convs.view': 'Ver',
    'convs.delete': 'Excluir',
    'convs.export': '📄 Exportar PDF',
    'convs.close': 'Fechar',
    'convs.confirm_delete': 'Excluir esta conversa?',

    // Public chat
    'pub.title': '💬 Chat da Comunidade',
    'pub.sub': 'Compartilhe dúvidas e dicas com outros estudantes.',
    'pub.new_post_ph': 'Compartilhe uma dúvida, dica ou resumo de estudo...',
    'pub.moderated': 'Conteúdo moderado por IA',
    'pub.publish': 'Publicar',
    'pub.all': 'Todas',
    'pub.filter_title': 'Filtrar por matéria',
    'pub.loading': 'Carregando...',
    'pub.empty': 'Nenhum post ainda. Seja o primeiro a postar!',
    'pub.reply': '💬 Responder',
    'pub.reply_ph': 'Escreva uma resposta...',
    'pub.reply_btn': 'Responder',

    // Profile
    'prof.title': '👤 Meu Perfil',
    'prof.loading': 'Carregando...',
    'prof.questions': 'Perguntas feitas',
    'prof.expires': 'Plano expira em',
    'prof.member_since': 'Membro desde',
    'prof.fav_subjects': '📚 Matérias favoritas',
    'prof.upgrade': '🚀 Fazer upgrade de plano',
    'prof.best_plan': 'Você já tem o melhor plano!',
    'prof.logout': 'Sair da conta',

    // Support
    'support.greeting': 'Oi! Tudo bem? Sou a Sofia, do suporte da StudyAI. Me conta o que está precisando que te ajudo!',
    'support.title': '🛠️ Sofia — Suporte',
    'support.subtitle': 'Dúvidas sobre a plataforma',
    'support.input_ph': 'Digite sua dúvida...',
    'support.send': 'Enviar',

    // Footer
    'footer.copy': '© 2025 StudyAI — Aprenda com os melhores professores de IA',
  },

  en: {
    'nav.professors': 'Teachers',
    'nav.chat': 'Community',
    'nav.conversations': 'History',
    'nav.profile': 'Profile',
    'nav.logout': 'Log out',
    'nav.plans': 'Plans',
    'nav.login': 'Sign in',
    'nav.signup': 'Start for free',
    'header.questions': 'questions',
    'header.plan': 'Plan',

    'hero.title': 'Learn with the best',
    'hero.title.highlight': 'AI teachers',
    'hero.sub': '8 specialized teachers available 24/7, judgment-free.',
    'hero.cta1': 'Start free — 5 questions today',
    'hero.cta2': 'See plans',
    'hero.no_card': 'No credit card needed. Sign up in 30 seconds.',

    'plans.title': 'Plans & pricing',
    'plans.sub': 'Start free, upgrade whenever you want',
    'plan.free.name': 'Free',
    'plan.weekly.name': 'Weekly',
    'plan.monthly.name': 'Monthly',
    'plan.yearly.name': 'Yearly',
    'plan.per.week': '/week',
    'plan.per.month': '/month',
    'plan.per.year': '/year',
    'plan.per.always': '/forever',
    'plan.popular': '⭐ MOST POPULAR',
    'plan.yearly.equiv': 'Equals',
    'plan.yearly.month': '/month',
    'plan.economy': 'savings',
    'plan.free.feat1': '5 questions to try',
    'plan.free.feat2': 'All 8 teachers',
    'plan.free.feat3': '7-day history',
    'plan.weekly.feat1': 'Unlimited questions',
    'plan.weekly.feat2': 'All 8 teachers',
    'plan.weekly.feat3': '30-day history',
    'plan.monthly.feat1': 'Unlimited questions',
    'plan.monthly.feat2': '1-year history',
    'plan.monthly.feat3': 'Community chat',
    'plan.monthly.feat4': '"Member" badge',
    'plan.yearly.feat1': 'Everything in Monthly',
    'plan.yearly.feat2': 'Conversations saved forever',
    'plan.yearly.feat3': 'Golden "Elite Student" badge',
    'plan.yearly.feat4': 'Priority access to new features',
    'btn.start_free': 'Start free',
    'btn.subscribe': 'Subscribe',
    'btn.best_value': 'Best value!',

    'features.title': 'Why StudyAI?',
    'features.sub': 'Much more than a simple chatbot',
    'feat1.title': 'Subject-specific chat',
    'feat1.desc': 'Each teacher only answers their specialty, with real depth and quality.',
    'feat2.title': 'Save your conversations',
    'feat2.desc': 'Review your lessons anytime, export to PDF and share with the community.',
    'feat3.title': 'Community Chat',
    'feat3.desc': 'Connect with other students, share tips and ask questions together.',
    'feat4.title': 'AI Moderation',
    'feat4.desc': '100% study-focused environment — automatic real-time moderation.',
    'feat5.title': 'Works on any screen',
    'feat5.desc': 'Desktop, tablet or mobile — study wherever and whenever you want.',
    'feat6.title': 'Instant answers',
    'feat6.desc': 'No waiting, no queues. Your teachers are always available 24/7.',

    'profs.title': 'Meet our teachers',
    'profs.sub': 'Each teacher has their own personality, specialty and teaching style',

    'login.title': 'Welcome back!',
    'login.email': 'Email',
    'login.password': 'Password',
    'login.btn': 'Sign in',
    'login.loading': 'Signing in...',
    'login.no_account': "Don't have an account?",
    'login.signup_link': 'Sign up for free',
    'login.back': '← Back to home',
    'register.title': 'Create your free account',
    'register.name': 'Full name',
    'register.name_ph': 'Your name',
    'register.email_ph': 'your@email.com',
    'register.pass_ph': 'Minimum 6 characters',
    'register.btn': 'Create free account',
    'register.loading': 'Creating account...',
    'register.has_account': 'Already have an account?',
    'register.login_link': 'Sign in',

    'dash.welcome.title': 'Choose a teacher to start',
    'dash.welcome.sub': 'Select a subject from the sidebar and ask your questions to our specialized AI teachers.',
    'dash.sidebar.title': 'Teachers',
    'chat.input.ph': 'Type your question or send an image...',
    'chat.save': '💾 Save',
    'chat.tab.professors': 'Teachers',
    'chat.tab.history': 'History',
    'chat.history.empty': 'No conversations yet.',
    'chat.history.loading': 'Loading...',
    'upgrade.title': '🚀 Your 5 free questions are up!',
    'upgrade.sub': 'Upgrade to keep learning',
    'upgrade.dismiss': 'Not now',

    'convs.title': '📁 My Conversations',
    'convs.sub': 'Your saved conversations with teachers.',
    'convs.search': 'Search by title...',
    'convs.all_profs': 'All teachers',
    'convs.loading': 'Loading...',
    'convs.empty': 'No saved conversations yet.',
    'convs.view': 'View',
    'convs.delete': 'Delete',
    'convs.export': '📄 Export PDF',
    'convs.close': 'Close',
    'convs.confirm_delete': 'Delete this conversation?',

    'pub.title': '💬 Community Chat',
    'pub.sub': 'Share questions and tips with other students.',
    'pub.new_post_ph': 'Share a question, tip or study summary...',
    'pub.moderated': 'AI-moderated content',
    'pub.publish': 'Post',
    'pub.all': 'All',
    'pub.filter_title': 'Filter by subject',
    'pub.loading': 'Loading...',
    'pub.empty': 'No posts yet. Be the first to post!',
    'pub.reply': '💬 Reply',
    'pub.reply_ph': 'Write a reply...',
    'pub.reply_btn': 'Reply',

    'prof.title': '👤 My Profile',
    'prof.loading': 'Loading...',
    'prof.questions': 'Questions asked',
    'prof.expires': 'Plan expires',
    'prof.member_since': 'Member since',
    'prof.fav_subjects': '📚 Favorite subjects',
    'prof.upgrade': '🚀 Upgrade plan',
    'prof.best_plan': 'You already have the best plan!',
    'prof.logout': 'Log out',

    'support.greeting': "Hi! I'm Sofia from StudyAI support. What can I help you with today?",
    'support.title': '🛠️ Sofia — Support',
    'support.subtitle': 'Platform questions',
    'support.input_ph': 'Type your question...',
    'support.send': 'Send',

    'footer.copy': '© 2025 StudyAI — Learn with the best AI teachers',
  },

  es: {
    'nav.professors': 'Profesores',
    'nav.chat': 'Comunidad',
    'nav.conversations': 'Historial',
    'nav.profile': 'Perfil',
    'nav.logout': 'Salir',
    'nav.plans': 'Planes',
    'nav.login': 'Iniciar sesión',
    'nav.signup': 'Empezar gratis',
    'header.questions': 'preguntas',
    'header.plan': 'Plan',

    'hero.title': 'Aprende con los mejores',
    'hero.title.highlight': 'profesores de IA',
    'hero.sub': '8 profesores especializados disponibles 24/7, sin juicios.',
    'hero.cta1': 'Empezar gratis — 5 preguntas hoy',
    'hero.cta2': 'Ver planes',
    'hero.no_card': 'Sin tarjeta de crédito. Registro en 30 segundos.',

    'plans.title': 'Planes y precios',
    'plans.sub': 'Empieza gratis, mejora cuando quieras',
    'plan.free.name': 'Gratuito',
    'plan.weekly.name': 'Semanal',
    'plan.monthly.name': 'Mensual',
    'plan.yearly.name': 'Anual',
    'plan.per.week': '/semana',
    'plan.per.month': '/mes',
    'plan.per.year': '/año',
    'plan.per.always': '/siempre',
    'plan.popular': '⭐ MÁS POPULAR',
    'plan.yearly.equiv': 'Equivale a',
    'plan.yearly.month': '/mes',
    'plan.economy': 'de ahorro',
    'plan.free.feat1': '5 preguntas para probar',
    'plan.free.feat2': 'Los 8 profesores',
    'plan.free.feat3': 'Historial por 7 días',
    'plan.weekly.feat1': 'Preguntas ilimitadas',
    'plan.weekly.feat2': 'Los 8 profesores',
    'plan.weekly.feat3': 'Historial por 30 días',
    'plan.monthly.feat1': 'Preguntas ilimitadas',
    'plan.monthly.feat2': 'Historial por 1 año',
    'plan.monthly.feat3': 'Chat comunitario',
    'plan.monthly.feat4': 'Insignia "Miembro"',
    'plan.yearly.feat1': 'Todo lo del Mensual',
    'plan.yearly.feat2': 'Conversaciones guardadas para siempre',
    'plan.yearly.feat3': 'Insignia dorada "Estudiante Elite"',
    'plan.yearly.feat4': 'Acceso prioritario a nuevas funciones',
    'btn.start_free': 'Empezar gratis',
    'btn.subscribe': 'Suscribirse',
    'btn.best_value': '¡Mejor valor!',

    'features.title': '¿Por qué StudyAI?',
    'features.sub': 'Mucho más que un simple chatbot',
    'feat1.title': 'Chat por materia',
    'feat1.desc': 'Cada profesor solo responde su especialidad, con calidad y profundidad reales.',
    'feat2.title': 'Guarda tus conversaciones',
    'feat2.desc': 'Revisa tus clases cuando quieras, exporta en PDF y comparte con la comunidad.',
    'feat3.title': 'Chat Comunitario',
    'feat3.desc': 'Interactúa con otros estudiantes, comparte consejos y resuelve dudas juntos.',
    'feat4.title': 'Moderación por IA',
    'feat4.desc': 'Entorno 100% enfocado en el estudio — moderación automática en tiempo real.',
    'feat5.title': 'Funciona en cualquier pantalla',
    'feat5.desc': 'Escritorio, tablet o móvil — estudia donde y cuando quieras.',
    'feat6.title': 'Respuestas instantáneas',
    'feat6.desc': 'Sin espera, sin colas. Tus profesores están siempre disponibles 24/7.',

    'profs.title': 'Conoce a nuestros profesores',
    'profs.sub': 'Cada profesor tiene su propia personalidad, especialidad y método de enseñanza',

    'login.title': '¡Bienvenido de vuelta!',
    'login.email': 'Correo electrónico',
    'login.password': 'Contraseña',
    'login.btn': 'Iniciar sesión',
    'login.loading': 'Iniciando sesión...',
    'login.no_account': '¿No tienes cuenta?',
    'login.signup_link': 'Regístrate gratis',
    'login.back': '← Volver al inicio',
    'register.title': 'Crea tu cuenta gratuita',
    'register.name': 'Nombre completo',
    'register.name_ph': 'Tu nombre',
    'register.email_ph': 'tu@email.com',
    'register.pass_ph': 'Mínimo 6 caracteres',
    'register.btn': 'Crear cuenta gratis',
    'register.loading': 'Creando cuenta...',
    'register.has_account': '¿Ya tienes cuenta?',
    'register.login_link': 'Iniciar sesión',

    'dash.welcome.title': 'Elige un profesor para empezar',
    'dash.welcome.sub': 'Selecciona una materia en la barra lateral y haz tus preguntas a nuestros profesores de IA especializados.',
    'dash.sidebar.title': 'Profesores',
    'chat.input.ph': 'Escribe tu pregunta o envía una imagen...',
    'chat.save': '💾 Guardar',
    'chat.tab.professors': 'Profesores',
    'chat.tab.history': 'Historial',
    'chat.history.empty': 'Aún no hay conversaciones.',
    'chat.history.loading': 'Cargando...',
    'upgrade.title': '🚀 ¡Tus 5 preguntas gratuitas se acabaron!',
    'upgrade.sub': 'Mejora tu plan para seguir aprendiendo',
    'upgrade.dismiss': 'Ahora no',

    'convs.title': '📁 Mis Conversaciones',
    'convs.sub': 'Tus conversaciones guardadas con los profesores.',
    'convs.search': 'Buscar por título...',
    'convs.all_profs': 'Todos los profesores',
    'convs.loading': 'Cargando...',
    'convs.empty': 'Aún no hay conversaciones guardadas.',
    'convs.view': 'Ver',
    'convs.delete': 'Eliminar',
    'convs.export': '📄 Exportar PDF',
    'convs.close': 'Cerrar',
    'convs.confirm_delete': '¿Eliminar esta conversación?',

    'pub.title': '💬 Chat Comunitario',
    'pub.sub': 'Comparte dudas y consejos con otros estudiantes.',
    'pub.new_post_ph': 'Comparte una duda, consejo o resumen de estudio...',
    'pub.moderated': 'Contenido moderado por IA',
    'pub.publish': 'Publicar',
    'pub.all': 'Todas',
    'pub.filter_title': 'Filtrar por materia',
    'pub.loading': 'Cargando...',
    'pub.empty': 'Sin publicaciones aún. ¡Sé el primero en publicar!',
    'pub.reply': '💬 Responder',
    'pub.reply_ph': 'Escribe una respuesta...',
    'pub.reply_btn': 'Responder',

    'prof.title': '👤 Mi Perfil',
    'prof.loading': 'Cargando...',
    'prof.questions': 'Preguntas hechas',
    'prof.expires': 'Plan vence el',
    'prof.member_since': 'Miembro desde',
    'prof.fav_subjects': '📚 Materias favoritas',
    'prof.upgrade': '🚀 Mejorar plan',
    'prof.best_plan': '¡Ya tienes el mejor plan!',
    'prof.logout': 'Cerrar sesión',

    'support.greeting': '¡Hola! Soy Sofía del soporte de StudyAI. ¿En qué puedo ayudarte hoy?',
    'support.title': '🛠️ Sofía — Soporte',
    'support.subtitle': 'Dudas sobre la plataforma',
    'support.input_ph': 'Escribe tu duda...',
    'support.send': 'Enviar',

    'footer.copy': '© 2025 StudyAI — Aprende con los mejores profesores de IA',
  }
};

function t(key) {
  const lang = localStorage.getItem('sa_lang') || 'pt';
  return (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) || TRANSLATIONS['pt'][key] || key;
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = t(key);
    } else {
      el.textContent = t(key);
    }
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    el.innerHTML = t(el.dataset.i18nHtml);
  });
  // Update page title lang attribute
  document.documentElement.lang = localStorage.getItem('sa_lang') || 'pt';
}

async function setLangAndApply(code) {
  localStorage.setItem('sa_lang', code);
  applyTranslations();
  // Re-render header
  const user = typeof getUser === 'function' ? getUser() : null;
  if (user && typeof renderHeader === 'function') renderHeader(user);
  // Update lang button
  const btn = document.getElementById('lang-btn');
  if (btn) btn.textContent = LANG_OPTIONS.find(l => l.code === code)?.label || '🌐';
  // Update prices
  if (typeof updateAllPrices === 'function') updateAllPrices();
  // Reload professors in correct language (dashboard)
  if (typeof loadProfessors === 'function') await loadProfessors();
  // Close menu
  const menu = document.getElementById('lang-menu');
  if (menu) menu.style.display = 'none';
}

const LANG_OPTIONS = [
  { code: 'pt', label: '🇧🇷 Português' },
  { code: 'en', label: '🇺🇸 English' },
  { code: 'es', label: '🇪🇸 Español' },
];

function renderLangSelector(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const current = localStorage.getItem('sa_lang') || 'pt';
  const currentLabel = LANG_OPTIONS.find(l => l.code === current)?.label || '🌐';
  container.innerHTML = `
    <div style="position:relative">
      <button id="lang-btn" onclick="toggleLangMenu()"
        style="background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.25);color:white;padding:6px 12px;border-radius:8px;font-size:.8rem;font-weight:600;cursor:pointer">
        ${currentLabel}
      </button>
      <div id="lang-menu" style="display:none;position:absolute;right:0;top:40px;background:white;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,.18);min-width:160px;overflow:hidden;z-index:300">
        ${LANG_OPTIONS.map(l => `
          <button onclick="setLangAndApply('${l.code}')"
            style="display:flex;align-items:center;gap:8px;width:100%;padding:11px 16px;font-size:.85rem;font-weight:600;text-align:left;background:${l.code === current ? '#EEF2FF' : 'none'};border:none;cursor:pointer;color:#1E293B">
            ${l.label}
          </button>
        `).join('')}
      </div>
    </div>
  `;
  document.addEventListener('click', e => {
    if (!e.target.closest('#lang-btn') && !e.target.closest('#lang-menu')) {
      const menu = document.getElementById('lang-menu');
      if (menu) menu.style.display = 'none';
    }
  });
}

function toggleLangMenu() {
  const menu = document.getElementById('lang-menu');
  if (menu) menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

// Auto-detect language from browser if not set
if (!localStorage.getItem('sa_lang')) {
  const browserLang = navigator.language?.slice(0, 2);
  if (['en', 'es'].includes(browserLang)) localStorage.setItem('sa_lang', browserLang);
  else localStorage.setItem('sa_lang', 'pt');
}

window.t = t;
window.applyTranslations = applyTranslations;
window.setLangAndApply = setLangAndApply;
window.renderLangSelector = renderLangSelector;
window.toggleLangMenu = toggleLangMenu;
window.LANG_OPTIONS = LANG_OPTIONS;
