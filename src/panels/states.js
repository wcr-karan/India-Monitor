// States Dashboard Panel
import { createPanel } from './utils.js';

export function renderStatesPanel() {
  const { panel, body } = createPanel('states', 'State Dashboard', '🏛️', {});
  loadStates(body);
  return panel;
}

function loadStates(container) {
  const states = [
    { name: 'Uttar Pradesh', pop: '231M', gdp: '₹21.7L Cr' },
    { name: 'Maharashtra', pop: '126M', gdp: '₹35.5L Cr' },
    { name: 'Tamil Nadu', pop: '78M', gdp: '₹22.4L Cr' },
    { name: 'Karnataka', pop: '68M', gdp: '₹20.1L Cr' },
    { name: 'Gujarat', pop: '64M', gdp: '₹19.8L Cr' },
    { name: 'West Bengal', pop: '100M', gdp: '₹15.1L Cr' },
    { name: 'Rajasthan', pop: '81M', gdp: '₹12.8L Cr' },
    { name: 'Andhra Pradesh', pop: '53M', gdp: '₹13.4L Cr' },
    { name: 'Madhya Pradesh', pop: '85M', gdp: '₹11.2L Cr' },
    { name: 'Telangana', pop: '39M', gdp: '₹13.7L Cr' },
    { name: 'Kerala', pop: '35M', gdp: '₹9.8L Cr' },
    { name: 'Delhi NCR', pop: '32M', gdp: '₹9.5L Cr' },
  ];

  container.innerHTML = '';

  // Header row
  const headerRow = document.createElement('div');
  headerRow.className = 'state-list-item';
  headerRow.style.cssText = 'background:var(--bg-tertiary);font-family:var(--mono-font);font-size:9px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.8px;';
  headerRow.innerHTML = `<div>STATE</div><div style="display:flex;gap:20px;"><span style="width:50px;text-align:right;">POP</span><span style="width:80px;text-align:right;">GSDP</span></div>`;
  container.appendChild(headerRow);

  states.forEach(state => {
    const el = document.createElement('div');
    el.className = 'state-list-item';
    el.innerHTML = `
      <div class="state-name">${state.name}</div>
      <div style="display:flex;gap:20px;font-family:var(--mono-font);font-size:11px;">
        <span style="width:50px;text-align:right;color:var(--text-secondary);">${state.pop}</span>
        <span style="width:80px;text-align:right;color:var(--text-accent);">${state.gdp}</span>
      </div>
    `;
    container.appendChild(el);
  });
}
