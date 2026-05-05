// Breaking News Banner Component
import { fetchIndiaNews } from '../services/data.js';
import { findBreakingNews } from './news.js';

export function renderBreakingBanner() {
  const banner = document.createElement('div');
  banner.className = 'breaking-banner';
  banner.id = 'breaking-banner';
  banner.style.display = 'none'; // Hidden by default

  banner.innerHTML = `
    <span class="breaking-label">BREAKING NEWS</span>
    <span class="breaking-text" id="breaking-text"></span>
  `;

  banner.onclick = () => {
    const link = banner.dataset.link;
    if (link) window.open(link, '_blank');
  };

  updateBreakingBanner();
  return banner;
}

export async function updateBreakingBanner() {
  const banner = document.getElementById('breaking-banner');
  const textEl = document.getElementById('breaking-text');
  if (!banner || !textEl) return;

  const news = await fetchIndiaNews();
  const breaking = findBreakingNews(news);

  if (breaking) {
    textEl.textContent = breaking.title;
    banner.dataset.link = breaking.link;
    banner.style.display = 'flex';
    banner.classList.add('fade-in');
  } else {
    banner.style.display = 'none';
  }
}
