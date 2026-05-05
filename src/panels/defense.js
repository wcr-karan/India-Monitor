// Defense & Security Panel
import { createPanel } from './utils.js';

export function renderDefensePanel() {
  const { panel, body } = createPanel('defense', 'Defense & Security', '🛡️', {});
  loadDefense(body);
  return panel;
}

function loadDefense(container) {
  const items = [
    { time: '14:00', title: 'Indian Navy deploys carrier group to Arabian Sea for exercise', source: 'Defense Ministry', tag: 'NAVY' },
    { time: '13:30', title: 'DRDO successfully tests long-range cruise missile', source: 'DRDO Official', tag: 'MISSILE' },
    { time: '12:45', title: 'IAF Rafale squadron conducts air dominance drill over Ladakh', source: 'ANI Defense', tag: 'AIR FORCE' },
    { time: '12:00', title: 'India-Japan 2+2 ministerial dialogue concludes with defense pact', source: 'MEA', tag: 'DIPLOMACY' },
    { time: '11:15', title: 'Border Roads Organization completes strategic tunnel in Arunachal', source: 'BRO', tag: 'INFRA' },
    { time: '10:30', title: 'HAL delivers 18th Tejas LCA Mk1A to Indian Air Force', source: 'HAL', tag: 'MAKE IN INDIA' },
    { time: '09:45', title: 'Indian Army conducts high-altitude exercise near LAC', source: 'Indian Army', tag: 'ARMY' },
    { time: '09:00', title: 'Coast Guard intercepts suspicious vessel off Gujarat coast', source: 'ICG', tag: 'MARITIME' },
  ];

  container.innerHTML = '';
  items.forEach(item => {
    const el = document.createElement('div');
    el.className = 'news-item';
    el.innerHTML = `
      <div class="news-time">${item.time}</div>
      <div class="news-content">
        <div class="news-headline"><span class="news-tag defense">${item.tag}</span>${item.title}</div>
        <div class="news-source">${item.source}</div>
      </div>
    `;
    container.appendChild(el);
  });
}
