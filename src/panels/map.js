// India Map panel — SVG map of India with state outlines
import { INDIA_STATES_SVG } from '../data/india-states.js';

export function renderMap() {
  const container = document.createElement('div');
  container.className = 'map-container';
  container.id = 'india-map';

  // Toolbar
  const toolbar = document.createElement('div');
  toolbar.className = 'map-toolbar';

  const left = document.createElement('div');
  left.className = 'map-toolbar-left';

  const layers = ['States', 'Weather', 'AQI', 'Seismic'];
  layers.forEach((name, i) => {
    const btn = document.createElement('button');
    btn.className = `map-layer-btn${i === 0 ? ' active' : ''}`;
    btn.textContent = name;
    btn.onclick = () => {
      document.querySelectorAll('.map-layer-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    };
    left.appendChild(btn);
  });

  const right = document.createElement('div');
  right.className = 'map-toolbar-right';
  right.innerHTML = `<span style="font-family:var(--mono-font);font-size:10px;color:var(--text-muted);">28 STATES • 8 UTs</span>`;

  toolbar.appendChild(left);
  toolbar.appendChild(right);
  container.appendChild(toolbar);

  // SVG Map
  const mapBody = document.createElement('div');
  mapBody.className = 'india-svg-map';
  mapBody.innerHTML = INDIA_STATES_SVG;
  container.appendChild(mapBody);

  // Tooltip
  const tooltip = document.createElement('div');
  tooltip.className = 'state-tooltip';
  tooltip.style.display = 'none';
  tooltip.id = 'map-tooltip';
  container.appendChild(tooltip);

  // Add hover interactions after render
  requestAnimationFrame(() => {
    const paths = container.querySelectorAll('.state-path');
    paths.forEach(path => {
      path.addEventListener('mouseenter', (e) => {
        const name = path.getAttribute('data-name') || 'Unknown';
        tooltip.textContent = name;
        tooltip.style.display = 'block';
      });
      path.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        tooltip.style.left = (e.clientX - rect.left + 12) + 'px';
        tooltip.style.top = (e.clientY - rect.top - 8) + 'px';
      });
      path.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
      });
    });
  });

  return container;
}
