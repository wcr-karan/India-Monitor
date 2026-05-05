// Tech & Startups Panel
import { createPanel } from './utils.js';

export function renderTechPanel() {
  const { panel, body } = createPanel('tech', 'Tech & Startups', '🚀', {});
  loadTech(body);
  return panel;
}

function loadTech(container) {
  const items = [
    { time: '14:10', title: 'Bengaluru-based AI startup raises $120M Series C', source: 'Inc42', tag: 'FUNDING' },
    { time: '13:45', title: 'India Stack processes 15 billion UPI transactions in April', source: 'NPCI', tag: 'FINTECH' },
    { time: '13:20', title: 'TCS wins $2.5B digital transformation deal with UK bank', source: 'LiveMint', tag: 'IT SERVICES' },
    { time: '12:55', title: 'ISRO announces Gaganyaan crew selection complete', source: 'ISRO', tag: 'SPACE' },
    { time: '12:30', title: 'India to produce 1M semiconductors by 2028: Minister', source: 'ET', tag: 'CHIPS' },
    { time: '12:00', title: 'Reliance Jio launches India-made 5G small cells', source: 'Business Standard', tag: '5G' },
    { time: '11:30', title: 'IIT Madras AI lab achieves breakthrough in drug discovery', source: 'The Hindu', tag: 'AI/ML' },
    { time: '11:00', title: 'PhonePe crosses 700M registered users milestone', source: 'YourStory', tag: 'FINTECH' },
    { time: '10:30', title: 'India ranks #1 in global developer community growth', source: 'GitHub', tag: 'DEV' },
  ];

  container.innerHTML = '';
  items.forEach(item => {
    const el = document.createElement('div');
    el.className = 'news-item';
    el.innerHTML = `
      <div class="news-time">${item.time}</div>
      <div class="news-content">
        <div class="news-headline"><span class="news-tag tech">${item.tag}</span>${item.title}</div>
        <div class="news-source">${item.source}</div>
      </div>
    `;
    container.appendChild(el);
  });
}
