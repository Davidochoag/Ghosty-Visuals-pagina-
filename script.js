/* ============================================================
   Ghostyvisual — lógica del portafolio
   ------------------------------------------------------------
   Para publicar un proyecto nuevo NO edites este archivo:
   abre videos.json y agrega un objeto con id, title,
   description y category (y opcionalmente "featured": true
   para que aparezca como preview en el inicio, máximo 3).
   ============================================================ */

const CATEGORY_ORDER = ['Interviews', 'Corporativo', 'Gaming', 'Comercial', 'Artistas', 'Fútbol'];

const SKILLS = [
  'Adobe Premiere Pro',
  'After Effects',
  'CapCut',
  'Sony Vegas',
  'Marketing Digital',
  'Contenido Audiovisual'
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

/* ---------- previews de video en el inicio ---------- */
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
    const src = `https://www.youtube.com/embed/${encodeURIComponent(v.id)}?autoplay=1&mute=1&loop=1&playlist=${encodeURIComponent(v.id)}&controls=0&modestbranding=1&playsinline=1&rel=0`;
    return `
      <button class="preview-card" data-id="${escapeHtml(v.id)}" aria-label="Reproducir ${escapeHtml(v.title)}">
        <span class="preview-card__frame">
          <iframe src="${src}" title="${escapeHtml(v.title)}" tabindex="-1" allow="autoplay; encrypted-media"></iframe>
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
  skillsList.innerHTML = SKILLS.map(s => `<li>${escapeHtml(s)}</li>`).join('');
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
