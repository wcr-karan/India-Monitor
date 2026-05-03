// Panel utility helpers
export function createPanel(id, title, icon, options = {}) {
  const panel = document.createElement('div');
  panel.className = 'panel fade-in';
  panel.id = `panel-${id}`;

  const header = document.createElement('div');
  header.className = 'panel-header';

  const titleEl = document.createElement('span');
  titleEl.className = 'panel-title';
  titleEl.innerHTML = `<span class="panel-title-icon">${icon}</span>${title}`;

  const actions = document.createElement('div');
  actions.className = 'panel-actions';

  if (options.live) {
    const badge = document.createElement('span');
    badge.className = 'panel-badge live';
    badge.textContent = 'LIVE';
    actions.appendChild(badge);
  }

  if (options.refreshable) {
    const refreshBtn = document.createElement('button');
    refreshBtn.className = 'panel-action-btn';
    refreshBtn.innerHTML = '↻';
    refreshBtn.title = 'Refresh';
    refreshBtn.onclick = () => options.onRefresh?.();
    actions.appendChild(refreshBtn);
  }

  header.appendChild(titleEl);
  header.appendChild(actions);

  const body = document.createElement('div');
  body.className = 'panel-body';
  body.id = `panel-body-${id}`;

  panel.appendChild(header);
  panel.appendChild(body);

  return { panel, body };
}

export function showLoading(container) {
  container.innerHTML = `
    <div class="panel-loading">
      <div class="shimmer-line" style="width:85%"></div>
      <div class="shimmer-line" style="width:70%"></div>
      <div class="shimmer-line" style="width:60%"></div>
      <div class="shimmer-line" style="width:75%"></div>
      <div class="shimmer-line" style="width:50%"></div>
    </div>
  `;
}

export function showEmpty(container, icon, message) {
  container.innerHTML = `
    <div class="empty-state">
      <div class="empty-state-icon">${icon}</div>
      <div>${message}</div>
    </div>
  `;
}

export function formatTime(date) {
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });
}

export function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}
