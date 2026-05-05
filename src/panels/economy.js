// Economy Panel — Key Indian economic indicators
import { createPanel } from './utils.js';

export function renderEconomyPanel() {
  const { panel, body } = createPanel('economy', 'Indian Economy', '🏦', {});
  loadEconomy(body);
  return panel;
}

function loadEconomy(container) {
  const indicators = [
    { label: 'GDP Growth', value: '7.2%', change: '▲ +0.3pp', up: true, sub: 'Q4 FY26 (YoY)' },
    { label: 'CPI Inflation', value: '4.87%', change: '▼ -0.15pp', up: false, sub: 'March 2026' },
    { label: 'Repo Rate', value: '6.25%', change: '— Unchanged', up: null, sub: 'RBI MPC' },
    { label: 'INR/USD', value: '₹83.42', change: '▼ -0.12', up: false, sub: 'Forex' },
    { label: 'FDI Inflows', value: '$71.3B', change: '▲ +8.2%', up: true, sub: 'FY26 YTD' },
    { label: 'Forex Reserves', value: '$658.2B', change: '▲ +$2.4B', up: true, sub: 'RBI Weekly' },
    { label: 'GST Collection', value: '₹2.10L Cr', change: '▲ +12%', up: true, sub: 'Monthly' },
    { label: 'Fiscal Deficit', value: '5.1%', change: '▼ Target 5.3%', up: true, sub: '% of GDP' },
    { label: 'IIP Growth', value: '5.8%', change: '▲ +1.2pp', up: true, sub: 'Feb 2026' },
    { label: 'Trade Balance', value: '-$19.8B', change: '▼ Deficit up', up: false, sub: 'Monthly' },
  ];

  container.innerHTML = '';
  const grid = document.createElement('div');
  grid.className = 'stat-grid';

  indicators.forEach(ind => {
    const card = document.createElement('div');
    card.className = 'stat-card';
    const changeClass = ind.up === true ? 'up' : ind.up === false ? 'down' : '';
    card.innerHTML = `
      <div class="stat-label">${ind.label}</div>
      <div class="stat-value">${ind.value}</div>
      <div class="stat-change ${changeClass}">${ind.change}</div>
      <div class="stat-subtitle">${ind.sub}</div>
    `;
    grid.appendChild(card);
  });

  container.appendChild(grid);
}
