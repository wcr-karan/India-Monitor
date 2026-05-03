// Header component
export function renderHeader() {
  const header = document.createElement('header');
  header.className = 'app-header';

  const left = document.createElement('div');
  left.className = 'header-left';

  left.innerHTML = `
    <div class="app-logo">
      <span class="logo-flag">🇮🇳</span>
      <span>India Monitor</span>
      <span class="logo-dot"></span>
    </div>
    <span class="header-time" id="header-time"></span>
    <span class="header-badge">v1.0</span>
  `;

  const right = document.createElement('div');
  right.className = 'header-right';

  const themeBtn = document.createElement('button');
  themeBtn.className = 'header-btn';
  themeBtn.id = 'theme-toggle';
  themeBtn.textContent = '◐ Theme';
  themeBtn.onclick = toggleTheme;

  const statusEl = document.createElement('span');
  statusEl.className = 'header-badge';
  statusEl.id = 'connection-status';
  statusEl.textContent = '● ONLINE';
  statusEl.style.color = '#22c55e';

  right.appendChild(themeBtn);
  right.appendChild(statusEl);

  header.appendChild(left);
  header.appendChild(right);

  // Update header clock
  updateHeaderClock();
  setInterval(updateHeaderClock, 1000);

  return header;
}

function updateHeaderClock() {
  const el = document.getElementById('header-time');
  if (!el) return;
  const now = new Date();
  const opts = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
  el.textContent = `IST ${now.toLocaleTimeString('en-IN', opts)}`;
}

function toggleTheme() {
  const html = document.documentElement;
  const current = html.dataset.theme || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  html.dataset.theme = next;
  localStorage.setItem('india-monitor-theme', next);
}
