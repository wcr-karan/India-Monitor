// ============================================
// India Monitor — Main Application Entry
// ============================================
import './styles/main.css';
import { renderHeader } from './panels/header.js';
import { renderMap } from './panels/map.js';
import { renderNewsPanel } from './panels/news.js';
import { renderMarketsPanel } from './panels/markets.js';
import { renderWeatherPanel } from './panels/weather.js';
import { renderEconomyPanel } from './panels/economy.js';
import { renderDefensePanel } from './panels/defense.js';
import { renderTechPanel } from './panels/tech.js';
import { renderClockPanel } from './panels/clock.js';
import { renderAirQualityPanel } from './panels/airquality.js';
import { renderStatesPanel } from './panels/states.js';
import { renderCricketPanel } from './panels/cricket.js';
import { startAutoRefresh } from './services/refresh.js';

function boot() {
  const app = document.getElementById('app');
  if (!app) return;

  // Clear skeleton
  app.innerHTML = '';

  // Tricolor bar at top
  const tricolor = document.createElement('div');
  tricolor.className = 'tricolor-bar';
  tricolor.innerHTML = '<div class="saffron"></div><div class="white"></div><div class="green"></div>';
  app.appendChild(tricolor);

  // Header
  const header = renderHeader();
  app.appendChild(header);

  // Main content
  const main = document.createElement('div');
  main.className = 'app-main';

  // Map section
  const mapSection = renderMap();
  main.appendChild(mapSection);

  // Panel grid
  const grid = document.createElement('div');
  grid.className = 'panel-grid';
  grid.id = 'panel-grid';

  // Add panels in order
  grid.appendChild(renderNewsPanel());
  grid.appendChild(renderCricketPanel());
  grid.appendChild(renderMarketsPanel());
  grid.appendChild(renderWeatherPanel());
  grid.appendChild(renderEconomyPanel());
  grid.appendChild(renderAirQualityPanel());
  grid.appendChild(renderDefensePanel());
  grid.appendChild(renderTechPanel());
  grid.appendChild(renderStatesPanel());
  grid.appendChild(renderClockPanel());

  main.appendChild(grid);
  app.appendChild(main);

  // Remove no-transition class after paint
  requestAnimationFrame(() => {
    document.documentElement.classList.remove('no-transition');
  });

  // Start auto-refresh
  startAutoRefresh();
}

// Boot on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
