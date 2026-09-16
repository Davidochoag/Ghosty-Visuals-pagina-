/* ============================================================
   Ghostyvisual — lógica del portafolio
   ------------------------------------------------------------
   Para publicar un proyecto nuevo NO edites este archivo:
   abre videos.json y agrega un objeto con id, title,
   description y category (y opcionalmente "featured": true
   para que aparezca como preview en el inicio, máximo 3).
   ============================================================ */

const CATEGORY_ORDER = ['Interviews', 'Corporativo', 'Gaming', 'Comercial', 'Artistas', 'Fútbol'];

// Logos reales embebidos como base64 (Premiere y After Effects)
const PREMIERE_SVG = `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAFGElEQVR42s2Z329URRTHPzNz793udnFjJW0pkkZJNLGlFB+k5UFMSrDxV/QBYkIw6QOJJkTwxRcT/whfNMbAAxINYiCgYBtqUAxPpSARg0lXiBUkhZbt/mR778z4cO+2oG1pl/6a5GYf5s7OZ86c8z1n5goA2KHgGw1vrYFV74N9E8xTgAcIFrdZYALkNRDHIfcJHPunwiSm4N5+FbxPQa4DDRiWtklAAWYYJt6Dr7+HHSqyzq7t4PSGiwk0CLkElpvGktaAo8Kpg5fhcJ+A3U+AuQyqCbSOlrGcTYNSoG+CbFPQ+iF4r4OvQSw3XLTXRoOXgqAogZ1g7DJs6WxNREw7HRDrQQsQKwhQyDBQWS+BGCu2iZgzp9fuM6619n99QkjAYszCS9OcAK0NwuCioj6VX4O1Adb6gEKI+LSLWDRAKSXGFOjs3M62bS9RLks8z0VKFfVpCoU8N2/+xcWLA1y9ejkCdbHWLD5guLUBjY1r2LjxWcbHQUowBqwNw0pKaG9/ju7ubi5cGOTgwc/I5bIRpF0IzXl4xPu+T7FoKJV8ymWD40AsBp4XQuZyhkJB09HxPPv2fUQs5k2mSiklSimUCq1eWbiUEinlA/5dtQ9O/aFFCEl//1my2bs4jktT0zpaWzciJYyN+bS0NNPV9QanTn2JlCmMKQBB9E8KIWqxVmNtMfJjD3CjmqFKwP9G84kTR8lk/gRqAENLSyd7936A4ziUSpbNm7fQ23scre/R2rqZpqY1WAu3b9/h0qWfcN0UHR2vsGlTGwMDv3L+fC9S1k6rAk41flFbmySXS01K6JUrvzAw8CJbt3ZSLFrq6laTSq1mbGyILVu20t39AhMTcO3aKNnsHXp63qW5+UmSSbh16y4QzLjVVQEaY9BaI4RGSoVSLqOjI0gZSoxSCtd1AcjlxsnlNIWCIZGoZf/+j0kmPTKZMkJ4BIE/a5atCnDKwSVa+0BAc/PTaB32FYtFisXQx4wxKKUQAuJxF6XAcSAejxEEPkEQLDxgqVTEmDxgqKmpoavrHdraNlAoaBIJSTr9N/n8GOCgtY7EG4SwZDJZzp3r57ffLpPJ3CWfLwCJyfceCbCia7t376FUyhGPJ1m7dh0NDY9TKhnA4rqCM2d+iLKPfGCs6woOHPicK1f6gceifjmr2lVlwfb2DQgRWsX3oVDQxGKKREJy7Fgvg4M/4zhJgiBznwKEAl8sFpAyhZRxtNYPFfMqfXCqOHMcCALFyMgIp09/x9mzpxGiZsaJlVIYo6M8bh8t1U2ng9Za+vp+5N69AsZANpvhxo1h0ukhfH88EmLLTHPPN/1VZcGTJ78lm71+XympgBhSJhe85KpaqPP5FFLGMMYCFmuXsR6cTqiN0VFOtSxmmyOgjfxq/jAVy1aeRQFUyiEWE0xMhBlBzPl8ZXEcl0RC4vseNTXzGTt5vNtlZ4/agLq6ehoa6tE6jM7r19P4/sSsKaoytr5+LY2N9QSBRUpBOj1EqZSfWyn6MMDJV/CjpwIUm+MxWoT3QpP1YGWsXMgttgjhIoT3QJDMdYuF8BAiVsXYeZ3qbNXR+ihjmZetl++ixpZXLp4tSyANKrqbWzFgJmQiLYEjIMWMx6plIoyYjqz4C0wJh0aBnlCzlAKrl8maNpxbRVfA9MChURleoh/ug/JrwDB4KjLvUserCOdmOGQ53Ac7lILfbQh55A945itwArCrgVXRdi/RZwgxBHwBuT1wdLDy9eFfkFpA+6/vl40AAAAASUVORK5CYII=" width="20" height="20" style="border-radius:4px;vertical-align:middle" alt="Premiere Pro">`;

const AE_SVG = `<img src="data:image/png;base64,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" width="20" height="20" style="border-radius:4px;vertical-align:middle" alt="After Effects">`;

const CAPCUT_SVG = `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" rx="8" fill="#000"/><text x="20" y="28" font-family="Arial Black,sans-serif" font-size="22" font-weight="900" fill="white" text-anchor="middle">C</text></svg>`;

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
      // Scroll suave al área de resultados
      if (selectedCategory) {
        setTimeout(() => {
          const el = document.getElementById('portfolioResults');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 60);
      }
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
