// Weather Panel — Major Indian cities weather
import { createPanel, showLoading } from './utils.js';
import { fetchWeather } from '../services/data.js';

export function renderWeatherPanel() {
  const { panel, body } = createPanel('weather', 'Weather • India', '🌤️', { refreshable: true, onRefresh: () => loadWeather(body) });
  loadWeather(body);
  return panel;
}

async function loadWeather(container) {
  showLoading(container);

  const cities = [
    { name: 'Delhi', lat: 28.6139, lon: 77.209 },
    { name: 'Mumbai', lat: 19.076, lon: 72.8777 },
    { name: 'Bangalore', lat: 12.9716, lon: 77.5946 },
    { name: 'Chennai', lat: 13.0827, lon: 80.2707 },
    { name: 'Kolkata', lat: 22.5726, lon: 88.3639 },
    { name: 'Hyderabad', lat: 17.385, lon: 78.4867 },
    { name: 'Jaipur', lat: 26.9124, lon: 75.7873 },
    { name: 'Lucknow', lat: 26.8467, lon: 80.9462 },
  ];

  const weatherData = await fetchWeather(cities);

  container.innerHTML = '';
  const grid = document.createElement('div');
  grid.className = 'weather-grid';

  weatherData.forEach(city => {
    const card = document.createElement('div');
    card.className = 'weather-card';
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
