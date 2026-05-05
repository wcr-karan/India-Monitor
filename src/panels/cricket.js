// Cricket Panel — India's cultural pulse
import { createPanel, showLoading } from './utils.js';
import { fetchCricketNews } from '../services/data.js';

export function renderCricketPanel() {
  const { panel, body } = createPanel('cricket', 'Cricket Hub', '🏏', { 
    live: true, 
    refreshable: true, 
    onRefresh: () => loadCricket(body) 
  });
  loadCricket(body);
  return panel;
}

async function loadCricket(container) {
  // Save current scroll position if needed
  const scrollPos = container.scrollTop;
  
  container.innerHTML = `
    <div style="padding:16px 12px;border-bottom:1px solid var(--border-subtle);">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
        <span class="news-tag sports" style="font-size:10px;">IPL 2026 • LIVE</span>
        <span style="font-family:var(--mono-font);font-size:10px;color:var(--accent-red);animation:pulse-badge 1.5s infinite;">● LIVE</span>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <div>
          <div style="font-size:13px;color:var(--text-primary);font-weight:500;">Chennai Super Kings</div>
          <div style="font-family:var(--mono-font);font-size:20px;color:var(--text-primary);margin-top:4px;">186/4 <span style="font-size:11px;color:var(--text-muted);">(18.2 ov)</span></div>
        </div>
        <div style="font-family:var(--mono-font);font-size:10px;color:var(--accent-saffron);padding:4px 8px;background:rgba(255,153,51,.1);border-radius:4px;">BATTING</div>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div>
          <div style="font-size:13px;color:var(--text-secondary);">Mumbai Indians</div>
          <div style="font-family:var(--mono-font);font-size:16px;color:var(--text-secondary);margin-top:4px;">175/8 <span style="font-size:11px;color:var(--text-muted);">(20 ov)</span></div>
        </div>
      </div>
      <div style="margin-top:10px;padding-top:8px;border-top:1px solid var(--border-subtle);font-family:var(--mono-font);font-size:11px;color:var(--accent-green-bright);">
        CSK need 12 runs from 10 balls
      </div>
    </div>

    <div style="padding:8px 12px;background:var(--bg-tertiary);font-family:var(--mono-font);font-size:9px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;">
      ▸ CRICKET HEADLINES
    </div>
    <div id="cricket-news-feed">
      <div class="panel-loading">
        <div class="shimmer-line" style="width:85%"></div>
        <div class="shimmer-line" style="width:75%"></div>
      </div>
    </div>

    <div style="padding:8px 12px;background:var(--bg-tertiary);font-family:var(--mono-font);font-size:9px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;border-top:1px solid var(--border-subtle);">
      ▸ UPCOMING MATCHES
    </div>

    <div class="news-item">
      <div class="news-time">19:30</div>
      <div class="news-content">
        <div class="news-headline">RCB vs DC • Chinnaswamy Stadium, Bengaluru</div>
        <div class="news-source">IPL 2026 • Match 52</div>
      </div>
    </div>
    <div class="news-item">
      <div class="news-time">15:30</div>
      <div class="news-content">
        <div class="news-headline">India vs Australia • 2nd Test, Day 3</div>
        <div class="news-source">Border-Gavaskar Trophy • Kolkata</div>
      </div>
    </div>
  `;

  // Fetch and render news
  const newsFeed = container.querySelector('#cricket-news-feed');
  const news = await fetchCricketNews();
  
  if (newsFeed) {
    if (news.length > 0) {
      newsFeed.innerHTML = news.map(item => `
        <div class="news-item" onclick="window.open('${item.link}', '_blank')" style="cursor:pointer">
          <div class="news-time">${item.time}</div>
          <div class="news-content">
            <div class="news-headline">${item.title}</div>
            <div class="news-source">${item.source}</div>
          </div>
        </div>
      `).join('');
    } else {
      newsFeed.innerHTML = '<div style="padding:12px;font-size:11px;color:var(--text-muted);">No news available at the moment.</div>';
    }
  }
}
