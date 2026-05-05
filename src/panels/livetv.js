import { createPanel } from './utils.js';

export function renderLiveTVPanel() {
  const { panel, body } = createPanel('livetv', 'Live TV', '📺', { live: true });
  
  const channels = [
    { name: 'India Today', id: 'IndiaToday', videoId: '9oKZLUVGXL4' },
    { name: 'Aaj Tak', id: 'AajTak', videoId: '1Dso3PVZvpI' },
    { name: 'NDTV 24x7', id: 'NDTV', videoId: 'gjuWUj3O9ss' },
  ];
  
  let currentChannel = channels[0];

  const updateIframe = () => {
    const iframeContainer = body.querySelector('#iframe-container');
    if (iframeContainer) {
      iframeContainer.innerHTML = `<iframe 
        width="100%" 
        height="220" 
        src="https://www.youtube.com/embed/${currentChannel.videoId}?autoplay=1&mute=1" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen
        style="border-radius: 4px;"
      ></iframe>`;
    }
  };

  body.innerHTML = `
    <div style="padding:12px;">
      <div style="display:flex;gap:8px;margin-bottom:12px;overflow-x:auto;padding-bottom:4px;" class="hide-scrollbar">
        ${channels.map(c => `
          <button 
            class="channel-btn" 
            data-id="${c.id}"
            style="
              background: ${c.id === currentChannel.id ? 'var(--accent-red)' : 'var(--bg-tertiary)'};
              color: ${c.id === currentChannel.id ? '#fff' : 'var(--text-secondary)'};
              border: 1px solid var(--border-subtle);
              border-radius: 4px;
              padding: 6px 12px;
              font-size: 11px;
              cursor: pointer;
              white-space: nowrap;
              font-family: var(--mono-font);
              transition: all 0.2s;
              font-weight: 500;
            "
          >${c.name}</button>
        `).join('')}
      </div>
      <div id="iframe-container" style="background:#000;border-radius:4px;overflow:hidden;height:220px;display:flex;align-items:center;justify-content:center;">
        <div class="panel-loading">
          <div class="shimmer-line" style="width:100px;margin-bottom:8px;"></div>
          <div style="font-size:10px;color:var(--text-muted);">Loading stream...</div>
        </div>
      </div>
    </div>
  `;

  // Initialize iframe shortly after render
  setTimeout(updateIframe, 100);

  // Add event listeners
  const buttons = body.querySelectorAll('.channel-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.target.getAttribute('data-id');
      currentChannel = channels.find(c => c.id === id);
      
      // Update active state
      buttons.forEach(b => {
        if (b.getAttribute('data-id') === id) {
          b.style.background = 'var(--accent-red)';
          b.style.color = '#fff';
        } else {
          b.style.background = 'var(--bg-tertiary)';
          b.style.color = 'var(--text-secondary)';
        }
      });
      
      updateIframe();
    });
  });

  return panel;
}
