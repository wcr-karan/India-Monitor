// Cricket Panel — India's cultural pulse
import { createPanel, showLoading } from './utils.js';
import { fetchCricketNews, fetchLiveScores } from '../services/data.js';

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
        <span class="news-tag sports" style="font-size:10px;">LIVE MATCHES</span>
        <span style="font-family:var(--mono-font);font-size:10px;color:var(--accent-red);animation:pulse-badge 1.5s infinite;">● LIVE</span>
      </div>
      <div id="live-scores-feed">
        <div class="panel-loading">
          <div class="shimmer-line" style="width:100%"></div>
          <div class="shimmer-line" style="width:80%"></div>
        </div>
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

  // Fetch and render data
  const newsFeed = container.querySelector('#cricket-news-feed');
  const liveScoresFeed = container.querySelector('#live-scores-feed');

  // Fetch data in parallel
  const [news, liveScores] = await Promise.all([
    fetchCricketNews(),
    fetchLiveScores()
  ]);
  
  if (liveScoresFeed) {
    if (liveScores.length > 0) {
      liveScoresFeed.innerHTML = liveScores.slice(0, 4).map(item => `
        <div style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.05); cursor:pointer" onclick="window.open('${item.link}', '_blank')">
          <div style="font-family:var(--mono-font);font-size:13px;color:var(--text-primary);font-weight:500;line-height:1.4;">
            ${item.title}
          </div>
        </div>
      `).join('');
      
      // Remove border from last item
      const lastItem = liveScoresFeed.lastElementChild;
      if (lastItem) {
        lastItem.style.borderBottom = 'none';
        lastItem.style.marginBottom = '0';
        lastItem.style.paddingBottom = '0';
      }
    } else {
      liveScoresFeed.innerHTML = '<div style="font-size:12px;color:var(--text-muted);">No live matches at the moment.</div>';
    }
  }

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
  
  // Restore scroll pos if it existed
  if (scrollPos) {
    container.scrollTop = scrollPos;
  }
}
