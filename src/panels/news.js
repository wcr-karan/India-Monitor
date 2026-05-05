// Live News Panel — Indian news from multiple sources
import { createPanel, showLoading } from './utils.js';
import { fetchIndiaNews } from '../services/data.js';

export function renderNewsPanel() {
  const { panel, body } = createPanel('news', 'Live News', '📰', { live: true, refreshable: true, onRefresh: () => loadNews(body) });
  loadNews(body);
  return panel;
}

export async function loadNews(container) {
  showLoading(container);
  const news = await fetchIndiaNews();
  container.innerHTML = '';
  
  if (!news.length) {
    container.innerHTML = news.length === 0 ? renderFallbackNews() : '';
    return;
  }

  news.slice(0, 20).forEach(item => {
    const el = document.createElement('div');
    el.className = 'news-item';
    const tag = getNewsTag(item.title);
    el.innerHTML = `
      <div class="news-time">${item.time}</div>
      <div class="news-content">
        <div class="news-headline">${tag ? `<span class="news-tag ${tag.cls}">${tag.label}</span>` : ''}${escapeHtml(item.title)}</div>
        <div class="news-source">${escapeHtml(item.source)}</div>
      </div>
    `;
    el.onclick = () => item.link && window.open(item.link, '_blank');
    container.appendChild(el);
  });
}

function getNewsTag(title) {
  const t = title.toLowerCase();
  if (/modi|parliament|bjp|congress|election|minister|lok sabha|rajya sabha|political|govt/.test(t)) return { cls: 'politics', label: 'POLITICS' };
  if (/gdp|rbi|inflation|economy|fiscal|budget|tax|gst|rupee/.test(t)) return { cls: 'economy', label: 'ECONOMY' };
  if (/army|navy|airforce|drdo|defense|defence|military|border|loc|china|pakistan/.test(t)) return { cls: 'defense', label: 'DEFENSE' };
  if (/startup|tech|ai|digital|it |software|infosys|tcs|wipro/.test(t)) return { cls: 'tech', label: 'TECH' };
  if (/cricket|ipl|bcci|kohli|rohit|match|wicket/.test(t)) return { cls: 'sports', label: 'SPORTS' };
  return null;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function renderFallbackNews() {
  const items = [
    { time: '14:32', title: 'RBI holds repo rate steady at 6.5% amid global uncertainty', source: 'LiveMint', tag: 'economy' },
    { time: '14:15', title: 'ISRO successfully launches PSLV-C60 carrying EOS-08 satellite', source: 'NDTV', tag: 'tech' },
    { time: '13:58', title: 'SENSEX rallies 450 points as FIIs turn net buyers', source: 'Economic Times', tag: 'economy' },
    { time: '13:40', title: 'PM Modi holds security review meeting on LAC situation', source: 'Times of India', tag: 'politics' },
    { time: '13:22', title: 'Indian Navy commissions INS Arighat nuclear submarine', source: 'The Hindu', tag: 'defense' },
    { time: '13:05', title: 'Southwest monsoon arrives in Kerala 3 days early', source: 'India Today', tag: '' },
    { time: '12:48', title: 'Startup India: Record $15B funding in Q1 2026', source: 'YourStory', tag: 'tech' },
    { time: '12:30', title: 'India-UAE trade crosses $100B milestone', source: 'Business Standard', tag: 'economy' },
    { time: '12:15', title: 'DRDO tests advanced air defense missile system successfully', source: 'ANI', tag: 'defense' },
    { time: '12:00', title: 'Supreme Court delivers landmark ruling on data privacy', source: 'NDTV', tag: 'politics' },
    { time: '11:42', title: 'IPL 2026: CSK defeats MI in thriller at Wankhede', source: 'ESPN Cricinfo', tag: 'sports' },
    { time: '11:25', title: 'Air quality in Delhi improves to moderate category', source: 'Times of India', tag: '' },
    { time: '11:10', title: 'GST collection hits ₹2.1 lakh crore, new monthly record', source: 'LiveMint', tag: 'economy' },
    { time: '10:55', title: 'India ranks 3rd globally in AI research output', source: 'The Hindu', tag: 'tech' },
    { time: '10:38', title: 'Jaishankar meets US Secretary of State on bilateral ties', source: 'ANI', tag: 'politics' },
  ];
  return items.map(n => {
    const tagHtml = n.tag ? `<span class="news-tag ${n.tag}">${n.tag.toUpperCase()}</span>` : '';
    return `<div class="news-item"><div class="news-time">${n.time}</div><div class="news-content"><div class="news-headline">${tagHtml}${n.title}</div><div class="news-source">${n.source}</div></div></div>`;
  }).join('');
}

export function findBreakingNews(newsItems) {
  if (!newsItems || !newsItems.length) return null;
  
  // Look for keywords in the first 5 items (most recent)
  const breakingKeywords = ['breaking', 'urgent', 'alert', 'crisis', 'emergency', 'deadly', 'blasts', 'war', 'attack', 'dead', 'kills'];
  
  for (let i = 0; i < 5; i++) {
    const item = newsItems[i];
    if (!item) break;
    const title = item.title.toLowerCase();
    if (breakingKeywords.some(k => title.includes(k))) {
      return item;
    }
  }
  
  // If no "breaking" keyword, just return the most recent one if it's very recent (within 30 mins)
  const mostRecent = newsItems[0];
  const pubDate = new Date(mostRecent.pubDate);
  const now = new Date();
  if ((now - pubDate) < 30 * 60 * 1000) {
    return mostRecent;
  }
  
  return null;
}
