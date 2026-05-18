// Analytics Panel — Visual charts for Markets and GDP
import { createPanel } from './utils.js';
import Chart from 'chart.js/auto';

let activeStateFilter = null;
let currentContainer = null;
let marketChartInstance = null;
let gdpChartInstance = null;

export function renderAnalyticsPanel() {
  const { panel, body } = createPanel('analytics', 'Visual Analytics', '📊', { 
    refreshable: true, 
    onRefresh: () => renderCharts(body) 
  });
  
  currentContainer = body;

  // Add event listeners for D3 map state selection
  window.addEventListener('state-selected', (e) => {
    activeStateFilter = e.detail.stateName;
    updatePanelHeader();
    renderCharts(body);
  });

  window.addEventListener('state-cleared', () => {
    activeStateFilter = null;
    updatePanelHeader();
    renderCharts(body);
  });

  // Create containers for charts
  body.innerHTML = `
    <div class="analytics-container">
      <div class="chart-section">
        <div class="chart-header">
          <span class="chart-title" id="market-chart-title">Market Trends (NIFTY 50)</span>
          <span class="chart-period" id="market-chart-period">Last 12 Months</span>
        </div>
        <div class="chart-canvas-wrapper">
          <canvas id="marketChart"></canvas>
        </div>
      </div>
      
      <div class="chart-divider"></div>
      
      <div class="chart-section">
        <div class="chart-header">
          <span class="chart-title" id="gdp-chart-title">GDP Growth Rate (%)</span>
          <span class="chart-period">Annual (2020-2026)</span>
        </div>
        <div class="chart-canvas-wrapper">
          <canvas id="gdpChart"></canvas>
        </div>
      </div>
    </div>
  `;

  // Delay chart rendering slightly to ensure DOM is ready
  setTimeout(() => renderCharts(body), 100);
  
  return panel;
}

function updatePanelHeader() {
  const header = document.querySelector('#panel-analytics .panel-header');
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

function renderCharts(container) {
  // Destroy existing chart instances before redrawing
  if (marketChartInstance) marketChartInstance.destroy();
  if (gdpChartInstance) gdpChartInstance.destroy();

  const ctxMarket = container.querySelector('#marketChart');
  const ctxGDP = container.querySelector('#gdpChart');

  if (!ctxMarket || !ctxGDP) return;

  // Chart Global Defaults
  Chart.defaults.color = '#999';
  Chart.defaults.font.family = "'JetBrains Mono', 'SF Mono', monospace";
  Chart.defaults.font.size = 10;

  // Dynamic titles based on state focus
  const marketTitleEl = container.querySelector('#market-chart-title');
  const gdpTitleEl = container.querySelector('#gdp-chart-title');

  let marketLabels, marketData, marketLabel;
  let gdpLabels, gdpData, gdpLabel;

  if (activeStateFilter) {
    if (marketTitleEl) marketTitleEl.textContent = `Economic Performance Index (${activeStateFilter})`;
    if (gdpTitleEl) gdpTitleEl.textContent = `GSDP Growth Rate (%)`;

    // State-specific mock market data
    marketLabels = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];
    const baseIndex = mockStateSeed(activeStateFilter, 100, 150);
    marketData = marketLabels.map((m, idx) => Math.round(baseIndex + (idx * 3.5) + (Math.sin(idx) * 8)));
    marketLabel = `${activeStateFilter} Index`;

    // State-specific mock GDP growth rate
    gdpLabels = ['2020', '2021', '2022', '2023', '2024', '2025', '2026(P)'];
    const avgGrowth = mockStateSeed(activeStateFilter, 5, 9);
    gdpData = [-4.5, avgGrowth + 2.1, avgGrowth - 0.4, avgGrowth + 0.5, avgGrowth + 1.2, avgGrowth, avgGrowth + 0.3];
    gdpLabel = `${activeStateFilter} GSDP`;
  } else {
    if (marketTitleEl) marketTitleEl.textContent = 'Market Trends (NIFTY 50)';
    if (gdpTitleEl) gdpTitleEl.textContent = 'GDP Growth Rate (%)';

    // National Nifty data
    marketLabels = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];
    marketData = [18200, 18800, 19400, 19300, 20100, 19800, 20500, 21700, 21500, 22200, 22500, 22800];
    marketLabel = 'NIFTY 50';

    // National GDP Growth data
    gdpLabels = ['2020', '2021', '2022', '2023', '2024', '2025', '2026(P)'];
    gdpData = [-6.6, 8.7, 7.2, 7.0, 7.6, 7.2, 7.0];
    gdpLabel = 'GDP Growth Rate';
  }

  // Draw Market Trends Chart
  marketChartInstance = new Chart(ctxMarket, {
    type: 'line',
    data: {
      labels: marketLabels,
      datasets: [{
        label: marketLabel,
        data: marketData,
        borderColor: activeStateFilter ? '#FF9933' : '#4ade80',
        backgroundColor: activeStateFilter ? 'rgba(255, 153, 51, 0.1)' : 'rgba(74, 222, 128, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: activeStateFilter ? '#FF9933' : '#4ade80',
        pointHoverBorderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0a0a0a',
          titleColor: '#e5e5e5',
          bodyColor: '#e5e5e5',
          borderColor: '#2a2a2a',
          borderWidth: 1,
          padding: 8,
          displayColors: false,
          callbacks: {
            label: (context) => `Points: ${context.parsed.y.toLocaleString()}`
          }
        }
      },
      scales: {
        y: {
          grid: { color: '#1a1a1a' },
          ticks: { callback: (val) => activeStateFilter ? val : val / 1000 + 'k' }
        },
        x: {
          grid: { display: false }
        }
      }
    }
  });

  // Draw GDP Chart
  gdpChartInstance = new Chart(ctxGDP, {
    type: 'bar',
    data: {
      labels: gdpLabels,
      datasets: [{
        label: gdpLabel,
        data: gdpData,
        backgroundColor: (context) => {
          const val = context.raw;
          if (val < 0) return 'rgba(239, 68, 68, 0.6)';
          return activeStateFilter ? 'rgba(0, 255, 156, 0.5)' : 'rgba(255, 153, 51, 0.6)';
        },
        borderColor: (context) => {
          const val = context.raw;
          if (val < 0) return '#ef4444';
          return activeStateFilter ? '#00ff9c' : '#FF9933';
        },
        borderWidth: 1,
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0a0a0a',
          titleColor: '#e5e5e5',
          bodyColor: '#e5e5e5',
          borderColor: '#2a2a2a',
          borderWidth: 1,
          padding: 8,
          displayColors: false,
          callbacks: {
            label: (context) => `Growth: ${context.parsed.y}%`
          }
        }
      },
      scales: {
        y: {
          grid: { color: '#1a1a1a' },
          ticks: { callback: (val) => val + '%' }
        },
        x: {
          grid: { display: false }
        }
      }
    }
  });
}

function mockStateSeed(name, min, max) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return Math.abs(hash % (max - min)) + min;
}
