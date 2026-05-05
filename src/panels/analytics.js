// Analytics Panel — Visual charts for Markets and GDP
import { createPanel } from './utils.js';
import Chart from 'chart.js/auto';

export function renderAnalyticsPanel() {
  const { panel, body } = createPanel('analytics', 'Visual Analytics', '📊', { refreshable: true, onRefresh: () => renderCharts(body) });
  
  // Create containers for charts
  body.innerHTML = `
    <div class="analytics-container">
      <div class="chart-section">
        <div class="chart-header">
          <span class="chart-title">Market Trends (NIFTY 50)</span>
          <span class="chart-period">Last 12 Months</span>
        </div>
        <div class="chart-canvas-wrapper">
          <canvas id="marketChart"></canvas>
        </div>
      </div>
      
      <div class="chart-divider"></div>
      
      <div class="chart-section">
        <div class="chart-header">
          <span class="chart-title">GDP Growth Rate (%)</span>
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

let marketChartInstance = null;
let gdpChartInstance = null;

function renderCharts(container) {
  // Destroy existing instances if any
  if (marketChartInstance) marketChartInstance.destroy();
  if (gdpChartInstance) gdpChartInstance.destroy();

  const ctxMarket = container.querySelector('#marketChart');
  const ctxGDP = container.querySelector('#gdpChart');

  if (!ctxMarket || !ctxGDP) return;

  // Chart Global Defaults
  Chart.defaults.color = '#999';
  Chart.defaults.font.family = "'JetBrains Mono', 'SF Mono', monospace";
  Chart.defaults.font.size = 10;

  // Market Trends Data (NIFTY 50)
  marketChartInstance = new Chart(ctxMarket, {
    type: 'line',
    data: {
      labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
      datasets: [{
        label: 'NIFTY 50',
        data: [18200, 18800, 19400, 19300, 20100, 19800, 20500, 21700, 21500, 22200, 22500, 22800],
        borderColor: '#4ade80',
        backgroundColor: 'rgba(74, 222, 128, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: '#4ade80',
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
          ticks: { callback: (val) => val / 1000 + 'k' }
        },
        x: {
          grid: { display: false }
        }
      }
    }
  });

  // GDP Growth Data
  gdpChartInstance = new Chart(ctxGDP, {
    type: 'bar',
    data: {
      labels: ['2020', '2021', '2022', '2023', '2024', '2025', '2026(P)'],
      datasets: [{
        label: 'GDP Growth Rate',
        data: [-6.6, 8.7, 7.2, 7.0, 7.6, 7.2, 7.0],
        backgroundColor: (context) => {
          const val = context.raw;
          return val < 0 ? 'rgba(239, 68, 68, 0.6)' : 'rgba(255, 153, 51, 0.6)';
        },
        borderColor: (context) => {
          const val = context.raw;
          return val < 0 ? '#ef4444' : '#FF9933';
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
