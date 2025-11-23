// visitor.js - load projects from localStorage key 'projects', search, and admin shortcut

// popup close
const welcomePopup = document.getElementById('welcomePopup');
const closePopup = document.getElementById('closePopup');
if (closePopup && welcomePopup) {
  closePopup.addEventListener('click', () => {
    welcomePopup.style.display = 'none';
  });
}

// elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const projectList = document.getElementById('projectList');
const statsBar = document.getElementById('statsBar');
const totalCountEl = document.getElementById('totalCount');
const lastUploadedEl = document.getElementById('lastUploaded');

// helper to load array from localStorage
function loadProjects() {
  try {
    const raw = JSON.parse(localStorage.getItem('projects') || '[]');
    // ensure array
    return Array.isArray(raw) ? raw.slice().reverse() : [];
  } catch (e) {
    console.error('Error parsing projects from localStorage', e);
    return [];
  }
}

function humanDate(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  return d.toLocaleString();
}

function renderList(items) {
  projectList.innerHTML = '';
  if (!items || items.length === 0) {
    projectList.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:#667085;padding:40px;background:linear-gradient(180deg,#fff,#fbfdff);border-radius:12px">Belum ada project. Coba kembali nanti atau hubungi pemilik.</div>`;
    statsBar.style.display = 'none';
    return;
  }

  statsBar.style.display = 'flex';
  totalCountEl.textContent = `Total project: ${items.length}`;
  // show latest uploaded timestamp if exists
  lastUploadedEl.textContent = items[0].uploadedAt ? `Terakhir: ${humanDate(items[0].uploadedAt)}` : '';

  items.forEach(it => {
    const card = document.createElement('article');
    card.className = 'project-card';

    const mediaTag = (it.type && it.type.startsWith('video')) ? 'video' : 'img';
    let mediaHtml = '';
    if (mediaTag === 'video') {
      mediaHtml = `<video src="${it.video || it.url || it.video}" controls preload="metadata"></video>`;
    } else {
      mediaHtml = `<img src="${it.video || it.url || ''}" alt="${(it.name||'')}" />`;
    }

    card.innerHTML = `
      ${mediaHtml}
      <div class="project-title">${escapeHtml(it.name || 'Project')}</div>
      <div class="project-sub">${escapeHtml(it.buyLink || it.buy || '')}</div>
      <a class="buy-btn" href="${it.buyLink || it.buy || '#'}" target="_blank" rel="noopener">Beli Project File</a>
    `;
    projectList.appendChild(card);
  });
}

function escapeHtml(s){ return String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c])); }

// initial render
let projects = loadProjects();
renderList(projects);

// search handling
searchBtn.addEventListener('click', doSearch);
searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') doSearch();
});

function doSearch() {
  const q = (searchInput.value || '').trim().toLowerCase();
  if (!q) {
    projects = loadProjects();
    renderList(projects);
    return;
  }

  if (q === 'admin✓') {
    // admin shortcut
    window.location.href = 'admin.html';
    return;
  }

  const all = loadProjects();
  const filtered = all.filter(p => (p.name || '').toLowerCase().includes(q));
  renderList(filtered);
}

// optional: refresh list when returning from admin
window.addEventListener('focus', () => {
  projects = loadProjects();
  renderList(projects);
});
