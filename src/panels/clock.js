// Clock Panel — IST + world clocks
import { createPanel } from './utils.js';

export function renderClockPanel() {
  const { panel, body } = createPanel('clock', 'India Clock', '🕐', {});
  body.id = 'clock-panel-body';
  updateClock();
  setInterval(updateClock, 1000);
  return panel;
}

function updateClock() {
  const container = document.getElementById('clock-panel-body');
  if (!container) return;

  const now = new Date();
  const istOpts = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
  const dateOpts = { timeZone: 'Asia/Kolkata', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

  const worldCities = [
    { name: 'New York', tz: 'America/New_York' },
    { name: 'London', tz: 'Europe/London' },
    { name: 'Dubai', tz: 'Asia/Dubai' },
    { name: 'Singapore', tz: 'Asia/Singapore' },
    { name: 'Tokyo', tz: 'Asia/Tokyo' },
    { name: 'Sydney', tz: 'Australia/Sydney' },
  ];

  const worldHtml = worldCities.map(c => {
    const t = now.toLocaleTimeString('en-IN', { timeZone: c.tz, hour: '2-digit', minute: '2-digit', hour12: false });
    return `<div class="world-clock-item"><div class="world-clock-city">${c.name}</div><div class="world-clock-time">${t}</div></div>`;
  }).join('');

  container.innerHTML = `
    <div class="clock-display">
      <div class="clock-time">${now.toLocaleTimeString('en-IN', istOpts)}</div>
      <div class="clock-date">${now.toLocaleDateString('en-IN', dateOpts)}</div>
      <div class="clock-label">Indian Standard Time (IST) • UTC+5:30</div>
      <div class="world-clocks">${worldHtml}</div>
    </div>
  `;
}
