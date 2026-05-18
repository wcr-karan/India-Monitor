// Air Quality Panel
import { createPanel } from './utils.js';

let activeStateFilter = null;
let currentContainer = null;

const STATE_CITY_MAPPING = {
  'Maharashtra': ['Mumbai', 'Pune'],
  'Karnataka': ['Bangalore'],
  'Tamil Nadu': ['Chennai'],
  'Delhi': ['Delhi', 'Gurgaon'],
  'West Bengal': ['Kolkata'],
  'Telangana': ['Hyderabad'],
  'Uttar Pradesh': ['Lucknow'],
};

export function renderAirQualityPanel() {
  const { panel, body } = createPanel('aqi', 'Air Quality Index', '🌫️', {});
  currentContainer = body;

  // Add event listeners for D3 map selection
  window.addEventListener('state-selected', (e) => {
    activeStateFilter = e.detail.stateName;
    updatePanelHeader();
    loadAQI(body);
  });

  window.addEventListener('state-cleared', () => {
    activeStateFilter = null;
    updatePanelHeader();
    loadAQI(body);
  });

  loadAQI(body);
  return panel;
}

function updatePanelHeader() {
  const header = document.querySelector('#panel-aqi .panel-header');
  if (!header) return;

  let badge = header.querySelector('.state-filter-badge');
  if (activeStateFilter) {
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'state-filter-badge';
      badge.style.background = 'rgba(255, 153, 51, 0.15)';
      badge.style.color = 'var(--accent-saffron)';
      badge.style.border = '1px solid rgba(255, 153, 51, 0.3)';
      badge.style.fontSize = '9px';
      badge.style.padding = '2px 6px';
      badge.style.borderRadius = '3px';
      badge.style.fontFamily = 'var(--mono-font)';
      badge.style.fontWeight = '600';
      badge.style.marginLeft = '8px';
      
      const titleEl = header.querySelector('.panel-title');
      if (titleEl) titleEl.appendChild(badge);
    }
    badge.innerHTML = `${activeStateFilter.toUpperCase()}`;
  } else {
    if (badge) badge.remove();
  }
}

function loadAQI(container) {
  const allCities = [
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

  // Filter cities if a state is selected
  let targetCities = [...allCities];
  if (activeStateFilter) {
    const allowedCities = STATE_CITY_MAPPING[activeStateFilter] || [];
    if (allowedCities.length > 0) {
      targetCities = allCities.filter(c => allowedCities.includes(c.name));
    }
  }

  container.innerHTML = '';
  targetCities.forEach(city => {
    const el = document.createElement('div');
    el.className = 'state-list-item';
    
    // Highlight local weather cards when filter is active
    if (activeStateFilter) {
      el.style.borderBottom = '1px solid rgba(255, 153, 51, 0.2)';
      el.style.background = 'rgba(255, 153, 51, 0.02)';
    }

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
