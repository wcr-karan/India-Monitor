// Auto-refresh scheduler
import { loadNews } from '../panels/news.js';

const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

export function startAutoRefresh() {
  // Refresh news panel every 5 minutes
  setInterval(() => {
    const newsBody = document.getElementById('panel-body-news');
    if (newsBody) loadNews(newsBody);
  }, REFRESH_INTERVAL);

  // Update connection status
  setInterval(() => {
    const el = document.getElementById('connection-status');
    if (el) {
      el.textContent = navigator.onLine ? '● ONLINE' : '● OFFLINE';
      el.style.color = navigator.onLine ? '#22c55e' : '#ef4444';
    }
  }, 3000);
}
