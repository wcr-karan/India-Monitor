// Weather Panel — Major Indian cities weather
import { createPanel, showLoading } from './utils.js';
import { fetchWeather } from '../services/data.js';

let activeStateFilter = null;
let currentContainer = null;

const STATE_CITY_MAPPING = {
  'Maharashtra': ['Mumbai'],
  'Karnataka': ['Bangalore'],
  'Tamil Nadu': ['Chennai'],
  'Delhi': ['Delhi'],
  'West Bengal': ['Kolkata'],
  'Telangana': ['Hyderabad'],
  'Rajasthan': ['Jaipur'],
  'Uttar Pradesh': ['Lucknow'],
};

export function renderWeatherPanel() {
  const { panel, body } = createPanel('weather', 'Weather • India', '🌤️', { 
    refreshable: true, 
    onRefresh: () => loadWeather(body) 
  });
  
  currentContainer = body;

  // Add event listeners for D3 map selection
  window.addEventListener('state-selected', (e) => {
    activeStateFilter = e.detail.stateName;
    updatePanelHeader();
    loadWeather(body);
  });

  window.addEventListener('state-cleared', () => {
    activeStateFilter = null;
    updatePanelHeader();
    loadWeather(body);
  });

  loadWeather(body);
  return panel;
}

function updatePanelHeader() {
  const header = document.querySelector('#panel-weather .panel-header');
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

async function loadWeather(container) {
  showLoading(container);

  const allCities = [
    { name: 'Delhi', lat: 28.6139, lon: 77.209 },
    { name: 'Mumbai', lat: 19.076, lon: 72.8777 },
    { name: 'Bangalore', lat: 12.9716, lon: 77.5946 },
    { name: 'Chennai', lat: 13.0827, lon: 80.2707 },
    { name: 'Kolkata', lat: 22.5726, lon: 88.3639 },
    { name: 'Hyderabad', lat: 17.385, lon: 78.4867 },
    { name: 'Jaipur', lat: 26.9124, lon: 75.7873 },
    { name: 'Lucknow', lat: 26.8467, lon: 80.9462 },
  ];

  // Filter cities if a state is selected
  let targetCities = [...allCities];
  if (activeStateFilter) {
    const allowedCities = STATE_CITY_MAPPING[activeStateFilter] || [];
    if (allowedCities.length > 0) {
      targetCities = allCities.filter(c => allowedCities.includes(c.name));
    }
  }

  const weatherData = await fetchWeather(targetCities);

  container.innerHTML = '';
  const grid = document.createElement('div');
  grid.className = 'weather-grid';

  weatherData.forEach(city => {
    const card = document.createElement('div');
    card.className = 'weather-card';
    
    // Highlight local weather cards when filter is active
    if (activeStateFilter) {
      card.style.border = '1px solid rgba(255, 153, 51, 0.4)';
      card.style.background = 'rgba(255, 153, 51, 0.03)';
    }

    card.innerHTML = `
      <div class="weather-icon">${city.icon}</div>
      <div class="weather-city">${city.name}</div>
      <div class="weather-temp">${city.temp}°C</div>
      <div class="weather-desc">${city.desc} • ${city.humidity}% 💧</div>
    `;
    grid.appendChild(card);
  });

  container.appendChild(grid);
}
