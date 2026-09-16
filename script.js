/* ============================================================
   Ghostyvisual — lógica del portafolio
   ------------------------------------------------------------
   Para publicar un proyecto nuevo NO edites este archivo:
   abre videos.json y agrega un objeto con id, title,
   description y category (y opcionalmente "featured": true
   para que aparezca como preview en el inicio, máximo 3).
   ============================================================ */

const CATEGORY_ORDER = ['Interviews', 'Corporativo', 'Gaming', 'Comercial', 'Artistas', 'Fútbol'];

// SVG logos de herramientas principales (inline, sin dependencias externas)
const PREMIERE_SVG = `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="8" fill="#00005B"/><path d="M13 34V14h7.2c1.7 0 3.1.3 4.3.9 1.2.6 2.1 1.5 2.7 2.6.6 1.1.9 2.4.9 3.9 0 1.5-.3 2.8-1 3.9-.6 1.1-1.6 2-2.8 2.6-1.2.6-2.7.9-4.4.9H16.8V34H13zm3.8-8.8h3.2c1.3 0 2.3-.4 3-1.1.7-.7 1-1.7 1-3 0-1.3-.3-2.3-1-3-.7-.7-1.7-1.1-3-1.1h-3.2v8.2z" fill="#9999FF"/></svg>`;

const AE_SVG = `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="8" fill="#00005B"/><path d="M28.6 34l-1.5-4.4h-7.3L18.3 34H15l6.8-20h4.3L33 34h-4.4zm-2.4-7.4l-2.7-8.1-2.7 8.1h5.4z" fill="#9999FF"/><path d="M33 25.5c0-2.8.7-4.9 2-6.4 1.3-1.5 3.1-2.2 5.5-2.2.5 0 .9 0 1.3.1v3.3c-.4-.1-.8-.1-1.2-.1-1.2 0-2.2.4-2.9 1.2-.7.8-1 2-1 3.6V34H33V25.5z" fill="#9999FF"/></svg>`;

const CAPCUT_SVG = `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="8" fill="#1a1a1a"/><path d="M24 10 L38 18 L38 30 L24 38 L10 30 L10 18 Z" fill="none" stroke="white" stroke-width="2"/><path d="M20 19 L30 24 L20 29 Z" fill="white"/></svg>`;

const SKILLS = [
  { name: 'Adobe Premiere Pro', svg: PREMIERE_SVG },
  { name: 'After Effects',      svg: AE_SVG },
  { name: 'CapCut',             svg: CAPCUT_SVG },
  { name: 'Sony Vegas',         svg: null },
  { name: 'Marketing Digital',  svg: null },
  { name: 'Contenido Audiovisual', svg: null }
];

const ICON_PLAY = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7-11-7z"/></svg>';

const heroPreviewsEl = document.getElementById('heroPreviews');
const categoryBoxesEl = document.getElementById('categoryBoxes');
const resultsEl = document.getElementById('portfolioResults');
const skillsList = document.getElementById('skillsList');

let videos = [];
let selectedCategory = null;

/* ---------- utilidades ---------- */
function escapeHtml(str = '') {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function categoryMatches(video, cat) {
  return (video.category || '').trim().toLowerCase() === cat.toLowerCase();
}

/* ---------- carga de datos ---------- */
async function loadVideos() {
  try {
    const res = await fetch('videos.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('No se pudo leer videos.json');
    videos = await res.json();
  } catch (err) {
    console.error(err);
    resultsEl.innerHTML = '<p class="portfolio-results__empty">No se pudieron cargar los proyectos. Verifica que videos.json esté junto a index.html.</p>';
    return;
  }

  warnUnmatchedCategories();
  renderHeroPreviews();
  renderCategoryBoxes();
  renderResults();
}

function warnUnmatchedCategories() {
  const known = new Set(CATEGORY_ORDER.map(c => c.toLowerCase()));
  videos
    .filter(v => !known.has((v.category || '').trim().toLowerCase()))
    .forEach(v => console.warn(`"${v.title}" tiene una categoría que no coincide con ninguna de ${CATEGORY_ORDER.join(', ')}: "${v.category}"`));
}

/* ---------- una tarjeta de video (usada en los resultados del portafolio) ---------- */
function cardTemplate(v) {
  return `
    <article class="card">
      <button class="card__media" data-id="${escapeHtml(v.id)}" aria-label="Reproducir ${escapeHtml(v.title)}">
        <img
          src="https://img.youtube.com/vi/${encodeURIComponent(v.id)}/maxresdefault.jpg"
          alt="Miniatura de ${escapeHtml(v.title)}"
          loading="lazy"
          onerror="this.onerror=null;this.src='https://img.youtube.com/vi/${encodeURIComponent(v.id)}/hqdefault.jpg';"
        >
        <span class="card__play" aria-hidden="true">${ICON_PLAY}</span>
        <i class="card__corner card__corner--tl" aria-hidden="true"></i>
        <i class="card__corner card__corner--br" aria-hidden="true"></i>
      </button>
      <div class="card__body">
        <span class="card__tag">${escapeHtml(v.category)}</span>
        <h3>${escapeHtml(v.title)}</h3>
        <p>${escapeHtml(v.description)}</p>
      </div>
    </article>
  `;
}

function wireCardClicks(container) {
  container.querySelectorAll('.card__media').forEach(btn => {
    btn.addEventListener('click', () => {
      const video = videos.find(v => v.id === btn.dataset.id);
      if (video) openModal(video);
    });
  });
}

/* ---------- cajitas de categoría (nada se muestra hasta elegir una) ---------- */
function renderCategoryBoxes() {
  categoryBoxesEl.innerHTML = CATEGORY_ORDER.map(cat => {
    const count = videos.filter(v => categoryMatches(v, cat)).length;
    return `
      <button class="category-box" data-category="${cat}" aria-pressed="${cat === selectedCategory}">
        <span class="category-box__name">${cat}</span>
        <span class="category-box__count">${count} proyecto${count === 1 ? '' : 's'}</span>
      </button>
    `;
  }).join('');

  categoryBoxesEl.querySelectorAll('.category-box').forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.category;
      selectedCategory = selectedCategory === cat ? null : cat;
      categoryBoxesEl.querySelectorAll('.category-box').forEach(b => {
        b.setAttribute('aria-pressed', String(b.dataset.category === selectedCategory));
      });
      renderResults();
    });
  });
}

function renderResults() {
  if (!selectedCategory) {
    resultsEl.innerHTML = '<p class="portfolio-results__empty">Elige una categoría para ver los proyectos.</p>';
    return;
  }
  const items = videos.filter(v => categoryMatches(v, selectedCategory));
  if (!items.length) {
    resultsEl.innerHTML = `
      <h3 class="portfolio-group__title">${escapeHtml(selectedCategory)}</h3>
      <p class="portfolio-results__empty">Todavía no hay proyectos en esta categoría. Vuelve pronto.</p>
    `;
    return;
  }
  resultsEl.innerHTML = `
    <h3 class="portfolio-group__title">${escapeHtml(selectedCategory)}</h3>
    <div class="cards-grid">${items.map(cardTemplate).join('')}</div>
  `;
  wireCardClicks(resultsEl);
}

/* ---------- previews de video en el inicio (miniaturas, sin reproductor embebido) ---------- */
function renderHeroPreviews() {
  const featured = videos.filter(v => v.featured).slice(0, 3);
  const slots = [0, 1, 2].map(i => featured[i] || null);

  heroPreviewsEl.innerHTML = slots.map(v => {
    if (!v) {
      return `
        <div class="preview-card preview-card--placeholder">
          <span class="preview-card__frame preview-card__frame--empty">Agrega video</span>
          <span class="preview-card__title preview-card__title--placeholder">Agrega texto</span>
        </div>
      `;
    }
    return `
      <button class="preview-card" data-id="${escapeHtml(v.id)}" aria-label="Reproducir ${escapeHtml(v.title)}">
        <span class="preview-card__frame">
          <img
            src="https://img.youtube.com/vi/${encodeURIComponent(v.id)}/maxresdefault.jpg"
            alt="Miniatura de ${escapeHtml(v.title)}"
            loading="lazy"
            onerror="this.onerror=null;this.src='https://img.youtube.com/vi/${encodeURIComponent(v.id)}/hqdefault.jpg';"
          >
          <span class="preview-card__play" aria-hidden="true">${ICON_PLAY}</span>
        </span>
        <span class="preview-card__title">${escapeHtml(v.title)}</span>
      </button>
    `;
  }).join('');

  heroPreviewsEl.querySelectorAll('.preview-card:not(.preview-card--placeholder)').forEach(btn => {
    btn.addEventListener('click', () => {
      const video = videos.find(v => v.id === btn.dataset.id);
      if (video) openModal(video);
    });
  });
}

/* ---------- habilidades ---------- */
function renderSkills() {
  skillsList.innerHTML = SKILLS.map(s => {
    const logo = s.svg ? `<span class="skill__logo" aria-hidden="true">${s.svg}</span>` : '';
    return `<li class="${s.svg ? 'skill--has-logo' : ''}">${logo}<span class="skill__name">${escapeHtml(s.name)}</span></li>`;
  }).join('');
}

/* ---------- modal ---------- */
const modal = document.getElementById('modal');
const modalPlayer = document.getElementById('modalPlayer');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalCloseBtn = document.getElementById('modalClose');
let lastFocused = null;

function openModal(video) {
  lastFocused = document.activeElement;
  modalPlayer.innerHTML = `<iframe src="https://www.youtube.com/embed/${encodeURIComponent(video.id)}?autoplay=1&rel=0" title="${escapeHtml(video.title)}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
  modalTitle.textContent = video.title;
  modalDesc.textContent = video.description;
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');
  modalCloseBtn.focus();
}

function closeModal() {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  modalPlayer.innerHTML = '';
  document.body.classList.remove('no-scroll');
  if (lastFocused) lastFocused.focus();
}

modalCloseBtn.addEventListener('click', closeModal);
document.getElementById('modalBackdrop').addEventListener('click', closeModal);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
});

/* ---------- nav móvil ---------- */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(open));
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

/* ---------- barra de progreso (scrubber) ---------- */
const scrubFill = document.getElementById('scrubFill');
const scrubTime = document.getElementById('scrubTime');
const REEL_SECONDS = 180; // duración simbólica del "reel", solo decorativo

function updateScrub() {
  const scrollTop = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const progress = max > 0 ? Math.min(Math.max(scrollTop / max, 0), 1) : 0;
  scrubFill.style.width = `${progress * 100}%`;
  const seconds = Math.round(progress * REEL_SECONDS);
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  scrubTime.textContent = `${mm}:${ss}`;
}

let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => { updateScrub(); ticking = false; });
    ticking = true;
  }
});
window.addEventListener('resize', updateScrub);

/* ---------- init ---------- */
renderSkills();
loadVideos();
updateScrub();
