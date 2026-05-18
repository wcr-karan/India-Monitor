import { createPanel } from './utils.js';

// Each channel's YouTube @handle — the proxy scrapes /@handle/live to get the real video ID
const CHANNELS = [
  { name: 'India Today', handle: 'IndiaToday' },
  { name: 'Aaj Tak',     handle: 'aajtak' },
  { name: 'NDTV 24x7',   handle: 'ndtv' },
  { name: 'Republic TV',  handle: 'RepublicWorld' },
  { name: 'WION',         handle: 'WION' },
  { name: 'DD News',      handle: 'DDnewslive' },
];

// Cache so switching back to a channel doesn't re-fetch
const videoIdCache = {};

async function fetchLiveVideoId(handle) {
  if (videoIdCache[handle]) return videoIdCache[handle];
  try {
    const res = await fetch(`/api/youtube-live?handle=${encodeURIComponent(handle)}`);
    const data = await res.json();
    if (data.videoId) {
      videoIdCache[handle] = data.videoId;
      return data.videoId;
    }
  } catch (e) {
    console.error('[LiveTV] Failed to fetch video ID:', e);
  }
  return null;
}

export function renderLiveTVPanel() {
  const { panel, body } = createPanel('livetv', 'Live TV', '📺', { live: true });

  let currentChannel = CHANNELS[0];

  // --- helpers ---
  const setStatus = (statusEl, channelName, loading = false) => {
    if (!statusEl) return;
    statusEl.innerHTML = `
      <span style="display:inline-flex;align-items:center;gap:5px;">
        <span style="width:7px;height:7px;border-radius:50%;background:${loading ? '#555' : 'var(--accent-red)'};
          ${loading ? '' : 'animation:pulse-badge 1.5s infinite'};display:inline-block;transition:background .3s;"></span>
        <span style="color:var(--text-muted);font-size:10px;font-family:var(--mono-font);">${loading ? 'CONNECTING' : 'LIVE'}</span>
      </span>
      <span style="font-size:10px;font-family:var(--mono-font);color:var(--text-secondary);">${channelName}</span>
    `;
  };

  const showLoading = (container, channelName) => {
    container.innerHTML = `
      <div style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;">
        <div style="width:32px;height:32px;border:2px solid #333;border-top-color:var(--accent-red);
          border-radius:50%;animation:spin 0.8s linear infinite;"></div>
        <div style="font-size:11px;color:var(--text-muted);font-family:var(--mono-font);">
          Tuning in to ${channelName}…
        </div>
      </div>`;
  };

  const showError = (container, handle) => {
    container.innerHTML = `
      <div style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:16px;">
        <div style="font-size:28px;opacity:.4;">📡</div>
        <div style="font-size:11px;color:var(--text-muted);font-family:var(--mono-font);text-align:center;line-height:1.6;">
          No live stream found.<br>Channel may not be broadcasting right now.
        </div>
        <a href="https://www.youtube.com/@${handle}/live" target="_blank" rel="noopener"
          style="font-size:10px;font-family:var(--mono-font);color:var(--accent-red);
            text-decoration:none;border:1px solid var(--accent-red);padding:4px 12px;
            border-radius:4px;transition:all .2s;"
          onmouseover="this.style.background='var(--accent-red)';this.style.color='#fff'"
          onmouseout="this.style.background='transparent';this.style.color='var(--accent-red)'">
          ▶ Open on YouTube
        </a>
      </div>`;
  };

  const loadChannel = async (channel) => {
    const container = body.querySelector('#iframe-container');
    const statusEl = body.querySelector('#stream-status');
    if (!container) return;

    setStatus(statusEl, channel.name, true);
    showLoading(container, channel.name);

    const videoId = await fetchLiveVideoId(channel.handle);

    setStatus(statusEl, channel.name, false);

    if (!videoId) {
      showError(container, channel.handle);
      return;
    }

    container.innerHTML = `
      <iframe
        id="live-player"
        width="100%"
        height="100%"
        src="https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0&modestbranding=1"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        style="border:none;border-radius:4px;"
      ></iframe>`;
  };

  // --- render shell ---
  body.innerHTML = `
    <style>
      @keyframes spin { to { transform: rotate(360deg); } }
    </style>
    <div style="padding:10px;display:flex;flex-direction:column;height:100%;box-sizing:border-box;">
      <div id="channel-bar"
        style="display:flex;gap:5px;margin-bottom:8px;overflow-x:auto;flex-wrap:wrap;padding-bottom:2px;">
        ${CHANNELS.map(c => `
          <button
            class="channel-btn"
            data-handle="${c.handle}"
            style="
              background: ${c.handle === currentChannel.handle ? 'var(--accent-red)' : 'var(--bg-tertiary)'};
              color: ${c.handle === currentChannel.handle ? '#fff' : 'var(--text-secondary)'};
              border: 1px solid ${c.handle === currentChannel.handle ? 'var(--accent-red)' : 'var(--border-subtle)'};
              border-radius: 4px; padding: 4px 10px; font-size: 10px;
              cursor: pointer; white-space: nowrap; font-family: var(--mono-font);
              transition: all .2s; font-weight: 500; letter-spacing: .3px;
            "
          >${c.name}</button>
        `).join('')}
      </div>
      <div id="stream-status"
        style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;padding:0 2px;">
      </div>
      <div id="iframe-container"
        style="background:#0a0a0a;border-radius:4px;overflow:hidden;flex:1;min-height:190px;
          display:flex;align-items:center;justify-content:center;position:relative;">
      </div>
    </div>
  `;

  // kick off initial load
  loadChannel(currentChannel);

  // channel switching
  body.querySelectorAll('.channel-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const handle = btn.getAttribute('data-handle');
      if (handle === currentChannel.handle) return;

      currentChannel = CHANNELS.find(c => c.handle === handle);

      body.querySelectorAll('.channel-btn').forEach(b => {
        const active = b.getAttribute('data-handle') === handle;
        b.style.background   = active ? 'var(--accent-red)' : 'var(--bg-tertiary)';
        b.style.color        = active ? '#fff' : 'var(--text-secondary)';
        b.style.borderColor  = active ? 'var(--accent-red)' : 'var(--border-subtle)';
      });

      loadChannel(currentChannel);
    });
  });

  return panel;
}
