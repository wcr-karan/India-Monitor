// Air Quality Panel
import { createPanel } from './utils.js';

export function renderAirQualityPanel() {
  const { panel, body } = createPanel('aqi', 'Air Quality Index', '🌫️', {});
  loadAQI(body);
  return panel;
}

function loadAQI(container) {
  const cities = [
    { name: 'Delhi', aqi: 185, status: 'Unhealthy', cls: 'aqi-unhealthy' },
    { name: 'Mumbai', aqi: 78, status: 'Moderate', cls: 'aqi-moderate' },
    { name: 'Bangalore', aqi: 52, status: 'Good', cls: 'aqi-good' },
    { name: 'Chennai', aqi: 65, status: 'Moderate', cls: 'aqi-moderate' },
    { name: 'Kolkata', aqi: 142, status: 'USG', cls: 'aqi-unhealthy-sensitive' },
    { name: 'Hyderabad', aqi: 88, status: 'Moderate', cls: 'aqi-moderate' },
    { name: 'Lucknow', aqi: 198, status: 'Unhealthy', cls: 'aqi-unhealthy' },
    { name: 'Gurgaon', aqi: 210, status: 'V. Unhealthy', cls: 'aqi-very-unhealthy' },
    { name: 'Pune', aqi: 45, status: 'Good', cls: 'aqi-good' },
    { name: 'Ahmedabad', aqi: 95, status: 'Moderate', cls: 'aqi-moderate' },
  ];

  container.innerHTML = '';
  cities.forEach(city => {
    const el = document.createElement('div');
    el.className = 'state-list-item';
    el.innerHTML = `
      <div>
        <div class="state-name">${city.name}</div>
        <div style="font-size:10px;color:var(--text-muted);margin-top:1px;">${city.status}</div>
      </div>
      <div class="state-metric ${city.cls}" style="font-size:16px;font-weight:600;">${city.aqi}</div>
    `;
    container.appendChild(el);
  });
}
