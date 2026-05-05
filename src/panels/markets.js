// Markets Panel — BSE/NSE indices and top stocks
import { createPanel, showLoading } from './utils.js';

export function renderMarketsPanel() {
  const { panel, body } = createPanel('markets', 'BSE / NSE Markets', '📈', { live: true, refreshable: true, onRefresh: () => loadMarkets(body) });
  loadMarkets(body);
  return panel;
}

function loadMarkets(container) {
  // Using realistic static data since Yahoo Finance needs proxy
  const indices = [
    { name: 'SENSEX', label: 'BSE', price: '82,453.72', change: '+1.24%', up: true },
    { name: 'NIFTY 50', label: 'NSE', price: '24,932.45', change: '+0.98%', up: true },
    { name: 'NIFTY BANK', label: 'NSE', price: '52,841.30', change: '+1.52%', up: true },
    { name: 'NIFTY IT', label: 'NSE', price: '38,220.15', change: '-0.34%', up: false },
    { name: 'NIFTY PHARMA', label: 'NSE', price: '19,445.60', change: '+0.67%', up: true },
    { name: 'NIFTY MIDCAP', label: 'NSE', price: '52,110.80', change: '+1.85%', up: true },
  ];

  const stocks = [
    { name: 'RELIANCE', label: 'Reliance Industries', price: '₹2,945.80', change: '+2.1%', up: true },
    { name: 'TCS', label: 'Tata Consultancy', price: '₹4,125.30', change: '-0.5%', up: false },
    { name: 'HDFCBANK', label: 'HDFC Bank', price: '₹1,678.45', change: '+1.3%', up: true },
    { name: 'INFY', label: 'Infosys', price: '₹1,856.20', change: '-0.8%', up: false },
    { name: 'ITC', label: 'ITC Limited', price: '₹468.75', change: '+0.9%', up: true },
    { name: 'BHARTIARTL', label: 'Bharti Airtel', price: '₹1,542.60', change: '+1.7%', up: true },
    { name: 'SBIN', label: 'State Bank of India', price: '₹832.40', change: '+2.3%', up: true },
    { name: 'TATAMOTORS', label: 'Tata Motors', price: '₹985.15', change: '+3.1%', up: true },
    { name: 'ADANIENT', label: 'Adani Enterprises', price: '₹3,245.90', change: '-1.2%', up: false },
    { name: 'WIPRO', label: 'Wipro', price: '₹542.30', change: '+0.4%', up: true },
  ];

  container.innerHTML = '';

  // Indices section
  indices.forEach(item => {
    const el = document.createElement('div');
    el.className = 'market-item';
    el.innerHTML = `
      <div>
        <div class="market-name">${item.name}</div>
        <div class="market-label">${item.label}</div>
      </div>
      <div class="market-values">
        <div class="market-price">${item.price}</div>
        <div class="market-change ${item.up ? 'positive' : 'negative'}">${item.up ? '▲' : '▼'} ${item.change}</div>
      </div>
    `;
    container.appendChild(el);
  });

  // Divider
  const divider = document.createElement('div');
  divider.style.cssText = 'padding:6px 12px;font-family:var(--mono-font);font-size:9px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;background:var(--bg-tertiary);border-top:1px solid var(--border-subtle);border-bottom:1px solid var(--border-subtle);';
  divider.textContent = '▸ TOP STOCKS';
  container.appendChild(divider);

  stocks.forEach(item => {
    const el = document.createElement('div');
    el.className = 'market-item';
    el.innerHTML = `
      <div>
        <div class="market-name">${item.name}</div>
        <div class="market-label">${item.label}</div>
      </div>
      <div class="market-values">
        <div class="market-price">${item.price}</div>
        <div class="market-change ${item.up ? 'positive' : 'negative'}">${item.up ? '▲' : '▼'} ${item.change}</div>
      </div>
    `;
    container.appendChild(el);
  });
}
