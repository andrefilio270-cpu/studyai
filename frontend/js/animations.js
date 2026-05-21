// Animações temáticas por professor e chat público

const PROFESSOR_SYMBOLS = {
  carlos:  ['📐','∑','∫','π','√','∞','÷','×','²','³','Δ','≈','≠','≤','≥'],
  ana:     ['📝','✍️','A','B','C','ç','ã','á','é','í','ó','ú','!','?','"'],
  ricardo: ['⚡','⚛️','🔭','↑','↓','→','←','⊕','∴','∵','~','≡','Ω','λ','φ'],
  beatriz: ['🧪','⚗️','H₂O','CO₂','NaCl','Fe','Au','O₂','🔬','NH₃','pH','→','⇌','∆H'],
  joao:    ['🏛️','📜','⚔️','🗺️','👑','🏰','⚖️','🕌','🗽','🏺','📯','⚜️','🌍'],
  marina:  ['🌿','🧬','🦠','🌱','🔬','🐋','🦋','🍃','💧','☘️','🌊','🧫','🐝'],
  lucas:   ['🌎','ABC','Hello','OK','Yes','Hi','🗣️','📖','✅','🤝','💬','🌐','✈️'],
  miguel:  ['🇪🇸','¡','¿','ñ','Hola','Sí','No','🌹','🎸','💃','🕺','olé','amor'],
  sofia:   ['🛠️','💡','⚙️','🔧','✅','❓','📋','🔑','💻','📱','🌐','⭐','🎯'],
};

const CHAT_EMOJIS = [
  '🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐸',
  '🦄','🐧','🐦','🐤','🦋','🐢','🦎','🐬','🐳','🦈','🐙','🦑','🦀',
  '🌟','⭐','💫','✨','🌈','☁️','⚡','🔥','💎','🎈','🎉','🎊','🏀',
  '🎮','🎸','🎺','🎹','🎯','🎭','🎪','🎨','🖼️','🎠','🎡','🎢','🌸',
];

let animationLayer = null;
let currentAnimInterval = null;

function clearAnimations() {
  if (animationLayer) animationLayer.remove();
  if (currentAnimInterval) clearInterval(currentAnimInterval);
  animationLayer = null;
  currentAnimInterval = null;
}

function startProfessorAnimation(professorId) {
  clearAnimations();
  const symbols = PROFESSOR_SYMBOLS[professorId] || PROFESSOR_SYMBOLS.sofia;
  const chatArea = document.getElementById('chat-area');
  if (!chatArea) return;

  animationLayer = document.createElement('div');
  animationLayer.id = 'prof-anim-layer';
  animationLayer.style.cssText = `
    position:absolute; inset:0; pointer-events:none; overflow:hidden; z-index:0;
  `;
  chatArea.style.position = 'relative';
  chatArea.insertBefore(animationLayer, chatArea.firstChild);

  function spawnSymbol() {
    const el = document.createElement('div');
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    const size = Math.random() * 14 + 10;
    const startX = Math.random() * 90;
    const duration = Math.random() * 12 + 8;
    const delay = Math.random() * 2;
    const rotate = Math.random() * 360;
    const drift = (Math.random() - 0.5) * 60;

    el.textContent = symbol;
    el.style.cssText = `
      position:absolute;
      left:${startX}%;
      bottom:-40px;
      font-size:${size}px;
      opacity:0;
      color:rgba(192,132,252,0.35);
      font-family:monospace;
      font-weight:700;
      pointer-events:none;
      animation:symbolFloat ${duration}s ${delay}s ease-in-out forwards;
      --drift:${drift}px;
      --rotate:${rotate}deg;
    `;
    animationLayer.appendChild(el);
    setTimeout(() => el.remove(), (duration + delay) * 1000);
  }

  // Adicionar CSS da animação
  if (!document.getElementById('prof-anim-css')) {
    const style = document.createElement('style');
    style.id = 'prof-anim-css';
    style.textContent = `
      @keyframes symbolFloat {
        0%   { transform: translateY(0) translateX(0) rotate(0) scale(0.5); opacity: 0; }
        10%  { opacity: 1; }
        50%  { transform: translateY(-200px) translateX(var(--drift)) rotate(calc(var(--rotate)/2)) scale(1); }
        90%  { opacity: 0.3; }
        100% { transform: translateY(-450px) translateX(calc(var(--drift)*2)) rotate(var(--rotate)) scale(0.8); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  // Spawn inicial
  for (let i = 0; i < 6; i++) setTimeout(spawnSymbol, i * 400);
  currentAnimInterval = setInterval(spawnSymbol, 700);
}

// ─── Chat público: colisão de emojis ───
let collisionObjects = [];
let collisionFrame = null;
let collisionCanvas = null;

function startCollisionAnimation(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Canvas
  collisionCanvas = document.createElement('canvas');
  collisionCanvas.style.cssText = `
    position:fixed; inset:0; pointer-events:none; z-index:0; opacity:0.5;
  `;
  document.body.appendChild(collisionCanvas);

  function resize() {
    collisionCanvas.width = window.innerWidth;
    collisionCanvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const ctx = collisionCanvas.getContext('2d');
  const N = 18;

  // Criar objetos
  collisionObjects = [];
  for (let i = 0; i < N; i++) {
    const emoji = CHAT_EMOJIS[Math.floor(Math.random() * CHAT_EMOJIS.length)];
    const size = Math.random() * 20 + 24;
    collisionObjects.push({
      emoji,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 3,
      vy: (Math.random() - 0.5) * 3,
      size,
      r: size / 2,
    });
  }

  function animate() {
    ctx.clearRect(0, 0, collisionCanvas.width, collisionCanvas.height);
    const W = collisionCanvas.width;
    const H = collisionCanvas.height;

    collisionObjects.forEach(o => {
      // Movimento
      o.x += o.vx;
      o.y += o.vy;

      // Rebater nas bordas
      if (o.x - o.r < 0)  { o.x = o.r;     o.vx = Math.abs(o.vx); }
      if (o.x + o.r > W)  { o.x = W - o.r; o.vx = -Math.abs(o.vx); }
      if (o.y - o.r < 0)  { o.y = o.r;     o.vy = Math.abs(o.vy); }
      if (o.y + o.r > H)  { o.y = H - o.r; o.vy = -Math.abs(o.vy); }

      // Desenhar
      ctx.font = `${o.size}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.globalAlpha = 0.7;
      ctx.fillText(o.emoji, o.x, o.y);
    });

    // Colisão entre objetos
    for (let i = 0; i < collisionObjects.length; i++) {
      for (let j = i + 1; j < collisionObjects.length; j++) {
        const a = collisionObjects[i];
        const b = collisionObjects[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minDist = a.r + b.r;

        if (dist < minDist && dist > 0) {
          const nx = dx / dist;
          const ny = dy / dist;
          const relVx = a.vx - b.vx;
          const relVy = a.vy - b.vy;
          const dot = relVx * nx + relVy * ny;
          if (dot > 0) {
            a.vx -= dot * nx;
            a.vy -= dot * ny;
            b.vx += dot * nx;
            b.vy += dot * ny;
          }
          // Separar
          const overlap = (minDist - dist) / 2;
          a.x -= nx * overlap;
          a.y -= ny * overlap;
          b.x += nx * overlap;
          b.y += ny * overlap;
        }
      }
    }

    ctx.globalAlpha = 1;
    collisionFrame = requestAnimationFrame(animate);
  }

  animate();
}

function stopCollisionAnimation() {
  if (collisionFrame) cancelAnimationFrame(collisionFrame);
  if (collisionCanvas) collisionCanvas.remove();
  collisionObjects = [];
}

window.startProfessorAnimation = startProfessorAnimation;
window.clearAnimations = clearAnimations;
window.startCollisionAnimation = startCollisionAnimation;
window.stopCollisionAnimation = stopCollisionAnimation;
