// India Intelligence Map — D3.js powered interactive map
import * as d3 from 'd3';
import { createPanel } from './utils.js';

export function renderMap() {
  const container = document.createElement('div');
  container.className = 'map-container';
  container.id = 'india-map';

  // Toolbar Section
  const toolbar = document.createElement('div');
  toolbar.className = 'map-toolbar';

  const left = document.createElement('div');
  left.className = 'map-toolbar-left';

  const modes = ['States', 'Weather', 'AQI', 'Seismic'];
  modes.forEach((name, i) => {
    const btn = document.createElement('button');
    btn.className = `map-layer-btn${i === 0 ? ' active' : ''}`;
    btn.textContent = name;
    btn.onclick = () => {
      document.querySelectorAll('.map-layer-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      updateMapMode(name);
    };
    left.appendChild(btn);
  });

  const right = document.createElement('div');
  right.className = 'map-toolbar-right';
  right.innerHTML = `<span style="font-family:var(--mono-font);font-size:10px;color:var(--text-muted);">D3 ENGINE • GEOSPATIAL INTEL</span>`;

  toolbar.appendChild(left);
  toolbar.appendChild(right);
  container.appendChild(toolbar);

  // SVG Container
  const mapBody = document.createElement('div');
  mapBody.className = 'india-svg-map';
  container.appendChild(mapBody);

  // Legend
  const legend = document.createElement('div');
  legend.className = 'map-legend';
  legend.id = 'map-legend';
  legend.style.display = 'none';
  container.appendChild(legend);

  // Tooltip
  const tooltip = document.createElement('div');
  tooltip.className = 'state-tooltip';
  tooltip.style.display = 'none';
  tooltip.id = 'map-tooltip';
  container.appendChild(tooltip);

  // Initialize Map
  initD3Map(mapBody);

  return container;
}

let svg, g, projection, path, statesData;
let currentMode = 'States';
let selectedStateName = null;

async function initD3Map(container) {
  const width = container.clientWidth || 800;
  const height = container.clientHeight || 600;

  svg = d3.select(container)
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet');

  // Add Defs for filters
  const defs = svg.append('defs');
  
  // Neon Glow Filter
  const filter = defs.append('filter').attr('id', 'neon-glow');
  filter.append('feGaussianBlur').attr('stdDeviation', '1.5').attr('result', 'blur');
  const feMerge = filter.append('feMerge');
  feMerge.append('feMergeNode').attr('in', 'blur');
  feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

  g = svg.append('g');

  // Projection
  projection = d3.geoMercator()
    .center([82, 22])
    .scale(width * 1.5)
    .translate([width / 2, height / 2]);

  path = d3.geoPath().projection(projection);

  // Zoom support
  const zoom = d3.zoom()
    .scaleExtent([1, 8])
    .on('zoom', (event) => {
      g.attr('transform', event.transform);
    });
  svg.call(zoom);

  try {
    const geoJsonUrl = import.meta.env.VITE_INDIA_GEOJSON_URL || '/data/india.json';
    const data = await d3.json(geoJsonUrl);
    statesData = data.features;

    // Draw States
    g.selectAll('.state-path')
      .data(statesData)
      .enter()
      .append('path')
      .attr('class', 'state-path')
      .attr('d', path)
      .on('mouseenter', showTooltip)
      .on('mousemove', moveTooltip)
      .on('mouseleave', hideTooltip)
      .on('click', (event, d) => selectState(d.properties.NAME_1, event.currentTarget));

    // Radar Sweep Animation
    const radar = g.append('circle')
      .attr('class', 'radar-sweep')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', 0);

    function sweep() {
      radar.attr('r', 0).attr('opacity', 0.5)
        .transition().duration(4000).ease(d3.easeLinear)
        .attr('r', width)
        .attr('opacity', 0)
        .on('end', sweep);
    }
    sweep();

    // Add City Markers
    addCityMarkers();

    // Initial render
    updateMapMode('States');

  } catch (err) {
    console.error('Error loading map data:', err);
    container.innerHTML = '<div class="empty-state">Failed to load geospatial data.</div>';
  }
}

function addCityMarkers() {
  const cities = [
    { name: 'Delhi', coords: [77.1025, 28.7041] },
    { name: 'Mumbai', coords: [72.8777, 19.0760] },
    { name: 'Bangalore', coords: [77.5946, 12.9716] },
    { name: 'Chennai', coords: [80.2707, 13.0827] },
    { name: 'Kolkata', coords: [88.3639, 22.5726] },
    { name: 'Hyderabad', coords: [78.4867, 17.3850] }
  ];

  const cityGroups = g.selectAll('.city-group')
    .data(cities)
    .enter()
    .append('g')
    .attr('class', 'city-group')
    .attr('transform', d => `translate(${projection(d.coords)})`);

  cityGroups.append('circle')
    .attr('class', 'city-marker-pulse')
    .attr('r', 3);

  cityGroups.append('circle')
    .attr('class', 'city-marker')
    .attr('r', 2);
}

function updateMapMode(mode) {
  currentMode = mode;
  const legend = document.getElementById('map-legend');
  legend.style.display = mode === 'States' ? 'none' : 'block';

  if (mode === 'AQI') {
    renderAQIMode();
  } else if (mode === 'Weather') {
    renderWeatherMode();
  } else if (mode === 'Seismic') {
    renderSeismicMode();
  } else {
    g.selectAll('.state-path')
      .transition().duration(500)
      .style('fill', '#071a12')
      .style('stroke', '#00ff9c');
  }
}

function renderAQIMode() {
  const colorScale = d3.scaleLinear()
    .domain([50, 150, 300])
    .range(['#22c55e', '#facc15', '#ef4444']);

  g.selectAll('.state-path')
    .transition().duration(500)
    .style('fill', d => colorScale(mockValue(d.properties.NAME_1, 50, 400)))
    .style('stroke', 'rgba(255,255,255,0.1)');

  const legend = document.getElementById('map-legend');
  legend.innerHTML = `
    <div style="margin-bottom:8px;font-weight:600;color:#e5e5e5;">AQI INDEX</div>
    <div class="legend-item"><div class="legend-color" style="background:#22c55e"></div> Good (0-50)</div>
    <div class="legend-item"><div class="legend-color" style="background:#facc15"></div> Moderate (101-200)</div>
    <div class="legend-item"><div class="legend-color" style="background:#ef4444"></div> Hazardous (300+)</div>
  `;
}

function renderWeatherMode() {
  const colorScale = d3.scaleSequential(d3.interpolateCool).domain([45, 15]);

  g.selectAll('.state-path')
    .transition().duration(500)
    .style('fill', d => colorScale(mockValue(d.properties.NAME_1, 15, 45)))
    .style('stroke', 'rgba(255,255,255,0.2)');

  const legend = document.getElementById('map-legend');
  legend.innerHTML = `
    <div style="margin-bottom:8px;font-weight:600;color:#e5e5e5;">TEMPERATURE (°C)</div>
    <div class="legend-item"><div class="legend-color" style="background:#20aadb"></div> 15°C (Cool)</div>
    <div class="legend-item"><div class="legend-color" style="background:#3b82f6"></div> 25°C (Mild)</div>
    <div class="legend-item"><div class="legend-color" style="background:#1e3a8a"></div> 35°C+ (Hot)</div>
  `;
}

function renderSeismicMode() {
  g.selectAll('.state-path')
    .transition().duration(500)
    .style('fill', '#05070a')
    .style('stroke', '#333');

  const zones = [
    { name: 'Himalayan Belt', coords: [80, 30], r: 40, color: '#ef4444' },
    { name: 'Kutch', coords: [70, 23], r: 30, color: '#f97316' },
    { name: 'Andaman', coords: [93, 12], r: 25, color: '#facc15' }
  ];

  g.selectAll('.seismic-zone').remove();
  
  const seismic = g.selectAll('.seismic-zone')
    .data(zones)
    .enter()
    .append('circle')
    .attr('class', 'seismic-zone')
    .attr('cx', d => projection(d.coords)[0])
    .attr('cy', d => projection(d.coords)[1])
    .attr('r', 0)
    .attr('fill', 'none')
    .attr('stroke', d => d.color)
    .attr('stroke-width', 2);

  function pulse() {
    seismic.attr('r', 0).attr('opacity', 1)
      .transition().duration(2000).ease(d3.easeQuadOut)
      .attr('r', d => d.r)
      .attr('opacity', 0)
      .on('end', pulse);
  }
  pulse();

  const legend = document.getElementById('map-legend');
  legend.innerHTML = `
    <div style="margin-bottom:8px;font-weight:600;color:#e5e5e5;">SEISMIC ACTIVITY</div>
    <div class="legend-item"><div class="legend-color" style="background:#ef4444"></div> High Risk (Zone V)</div>
    <div class="legend-item"><div class="legend-color" style="background:#f97316"></div> Moderate (Zone IV)</div>
  `;
}

function showTooltip(event, d) {
  const name = d.properties.NAME_1;
  const tooltip = document.getElementById('map-tooltip');
  
  // Mock data for demo
  const pop = (Math.random() * 200 + 10).toFixed(1) + 'M';
  const gsdp = '$' + (Math.random() * 500 + 50).toFixed(0) + 'B';
  const val = currentMode === 'AQI' ? mockValue(name, 50, 400) : currentMode === 'Weather' ? mockValue(name, 15, 45) + '°C' : 'N/A';

  tooltip.innerHTML = `
    <div style="font-weight:700;font-size:13px;margin-bottom:8px;color:#fff;">${name.toUpperCase()}</div>
    <div class="tooltip-row"><span class="tooltip-label">POPULATION</span><span class="tooltip-value">${pop}</span></div>
    <div class="tooltip-row"><span class="tooltip-label">GSDP</span><span class="tooltip-value">${gsdp}</span></div>
    <div class="tooltip-row"><span class="tooltip-label">${currentMode.toUpperCase()}</span><span class="tooltip-value">${val}</span></div>
  `;
  tooltip.style.display = 'block';
  
  d3.select(event.currentTarget).style('stroke', '#fff').style('stroke-width', 1.5);
}

function moveTooltip(event) {
  const tooltip = document.getElementById('map-tooltip');
  const container = document.getElementById('india-map');
  const rect = container.getBoundingClientRect();
  tooltip.style.left = (event.clientX - rect.left + 15) + 'px';
  tooltip.style.top = (event.clientY - rect.top - 10) + 'px';
}

function hideTooltip(event, d) {
  const tooltip = document.getElementById('map-tooltip');
  tooltip.style.display = 'none';
  
  // If this is the currently selected state, preserve its highlighted stroke
  const isSelected = d && d.properties && d.properties.NAME_1 === selectedStateName;
  d3.select(event.currentTarget)
    .style('stroke', isSelected ? 'var(--accent-saffron)' : (currentMode === 'States' ? '#00ff9c' : 'rgba(255,255,255,0.2)'))
    .style('stroke-width', isSelected ? 2 : 0.5);
}

function mockValue(name, min, max) {
  // Deterministic random based on name
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return Math.abs(hash % (max - min)) + min;
}

function selectState(stateName, element) {
  if (selectedStateName === stateName) {
    clearStateSelection();
    return;
  }

  selectedStateName = stateName;

  // Apply visual focus in D3 map (glow effect on selected, dim others)
  g.selectAll('.state-path')
    .transition().duration(350)
    .style('fill', d => d.properties.NAME_1 === stateName ? 'rgba(255, 153, 51, 0.25)' : '#020906')
    .style('stroke', d => d.properties.NAME_1 === stateName ? 'var(--accent-saffron)' : 'rgba(0, 255, 156, 0.1)')
    .style('stroke-width', d => d.properties.NAME_1 === stateName ? 2 : 0.5)
    .attr('filter', d => d.properties.NAME_1 === stateName ? 'url(#neon-glow)' : null);

  // Emit dynamic event
  window.dispatchEvent(new CustomEvent('state-selected', { detail: { stateName } }));
  updateResetButton();
}

function clearStateSelection() {
  selectedStateName = null;

  // Restore regular map styling based on mode
  updateMapMode(currentMode);

  window.dispatchEvent(new CustomEvent('state-cleared'));
  updateResetButton();
}

function updateResetButton() {
  const right = document.querySelector('.map-toolbar-right');
  if (!right) return;

  let resetBtn = document.getElementById('map-reset-btn');
  if (selectedStateName) {
    if (!resetBtn) {
      resetBtn = document.createElement('button');
      resetBtn.id = 'map-reset-btn';
      resetBtn.className = 'header-btn';
      resetBtn.style.padding = '3px 8px';
      resetBtn.style.fontSize = '10px';
      resetBtn.style.borderColor = 'var(--accent-saffron)';
      resetBtn.style.color = 'var(--accent-saffron)';
      resetBtn.style.background = 'rgba(255, 153, 51, 0.1)';
      resetBtn.style.marginLeft = '10px';
      resetBtn.style.cursor = 'pointer';
      resetBtn.innerHTML = `FOCUS: ${selectedStateName.toUpperCase()} <span style="font-weight:bold;margin-left:4px;">✕</span>`;
      resetBtn.onclick = (e) => {
        e.stopPropagation();
        clearStateSelection();
      };
      right.insertBefore(resetBtn, right.firstChild);
    } else {
      resetBtn.innerHTML = `FOCUS: ${selectedStateName.toUpperCase()} <span style="font-weight:bold;margin-left:4px;">✕</span>`;
    }
  } else {
    if (resetBtn) resetBtn.remove();
  }
}
