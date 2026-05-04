// Simplified SVG outline of India with major state boundaries
// Each path has data-name for tooltip
export const INDIA_STATES_SVG = `
<svg viewBox="60 5 40 45" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
  <defs>
    <radialGradient id="mapGlow" cx="78" cy="25" r="25" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="rgba(19,136,8,0.08)"/>
      <stop offset="100%" stop-color="rgba(5,10,8,0)"/>
    </radialGradient>
    <filter id="glow"><feGaussianBlur stdDeviation="0.3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <rect x="55" y="0" width="50" height="55" fill="url(#mapGlow)"/>
  <!-- Jammu & Kashmir -->
  <path class="state-path" data-name="Jammu & Kashmir" d="M73,8 L75,7.5 L77,8 L78,9.5 L77,11 L75.5,11.5 L74,11 L73,9.5 Z" filter="url(#glow)"/>
  <!-- Himachal Pradesh -->
  <path class="state-path" data-name="Himachal Pradesh" d="M75.5,11.5 L77,11 L78,12 L77.5,13 L76,13.5 L75,12.5 Z"/>
  <!-- Punjab -->
  <path class="state-path" data-name="Punjab" d="M73,11 L75,11.5 L75,12.5 L74.5,13.5 L73,14 L72,13 Z"/>
  <!-- Haryana -->
  <path class="state-path" data-name="Haryana" d="M74.5,13.5 L76,13.5 L76.5,14.5 L76,15.5 L74.5,15.5 L73.5,14.5 Z"/>
  <!-- Uttarakhand -->
  <path class="state-path" data-name="Uttarakhand" d="M77.5,13 L79,12.5 L80,13.5 L79.5,14.5 L78,14.5 L77,14 Z"/>
  <!-- Delhi -->
  <circle class="state-path" data-name="Delhi (NCR)" cx="75.5" cy="15" r="0.4" fill="rgba(255,153,51,0.3)" stroke="var(--accent-saffron)" stroke-width="0.3"/>
  <!-- Rajasthan -->
  <path class="state-path" data-name="Rajasthan" d="M69,15 L73,14 L74,15.5 L74,18 L72,20 L69,20 L67,18 L68,16 Z"/>
  <!-- Uttar Pradesh -->
  <path class="state-path" data-name="Uttar Pradesh" d="M74.5,15.5 L78,14.5 L80,15 L82,16 L82,18 L80,19 L78,19.5 L76,19 L74.5,18 Z"/>
  <!-- Gujarat -->
  <path class="state-path" data-name="Gujarat" d="M66,20 L69,20 L70,22 L69,24 L67,25 L65,24 L64,22 L65,20.5 Z"/>
  <!-- Madhya Pradesh -->
  <path class="state-path" data-name="Madhya Pradesh" d="M72,20 L76,19 L78,19.5 L80,20 L80,22.5 L78,24 L75,24 L72,23 L71,21 Z"/>
  <!-- Maharashtra -->
  <path class="state-path" data-name="Maharashtra" d="M69,24 L72,23 L75,24 L78,24 L78,26 L77,28 L74,29 L71,28 L69,26.5 Z"/>
  <!-- Bihar -->
  <path class="state-path" data-name="Bihar" d="M82,18 L84,17.5 L86,18 L86,19.5 L84,20 L82,19.5 Z"/>
  <!-- Jharkhand -->
  <path class="state-path" data-name="Jharkhand" d="M82,19.5 L84,20 L86,20.5 L85.5,22 L83.5,22.5 L82,21.5 Z"/>
  <!-- West Bengal -->
  <path class="state-path" data-name="West Bengal" d="M86,18 L87.5,17 L88,18.5 L87.5,21 L86.5,23 L85.5,24 L85,22 L86,20.5 Z"/>
  <!-- Odisha -->
  <path class="state-path" data-name="Odisha" d="M80,22.5 L83.5,22.5 L85,24 L84,26 L82,27 L80,26 L79,24 Z"/>
  <!-- Chhattisgarh -->
  <path class="state-path" data-name="Chhattisgarh" d="M78,22 L80,22.5 L80,25 L79,26 L78,26 L77,24.5 Z"/>
  <!-- Goa -->
  <path class="state-path" data-name="Goa" d="M71,28.5 L72,28 L72.5,29 L71.5,29.5 Z" fill="rgba(255,153,51,0.2)" stroke="var(--accent-saffron)" stroke-width="0.3"/>
  <!-- Karnataka -->
  <path class="state-path" data-name="Karnataka" d="M71,29 L74,29 L75,31 L74,33 L72,34 L70,33 L69,31 Z"/>
  <!-- Telangana -->
  <path class="state-path" data-name="Telangana" d="M76,26 L79,26 L80,27.5 L79,29 L77,29.5 L75.5,28 Z"/>
  <!-- Andhra Pradesh -->
  <path class="state-path" data-name="Andhra Pradesh" d="M75.5,28 L77,29.5 L80,29 L82,28 L83,30 L82,32 L80,34 L77,33 L75,31 Z"/>
  <!-- Tamil Nadu -->
  <path class="state-path" data-name="Tamil Nadu" d="M75,33 L77,33 L79,34 L80,36 L79,38 L77,39 L75,37 L74,35 Z"/>
  <!-- Kerala -->
  <path class="state-path" data-name="Kerala" d="M72,34 L74,35 L74.5,37 L73.5,39 L72,39.5 L71,38 L71,36 Z"/>
  <!-- Northeast cluster -->
  <path class="state-path" data-name="Assam" d="M88,15 L91,14.5 L93,15 L93,16.5 L91,17 L89,17 L88,16 Z"/>
  <path class="state-path" data-name="Meghalaya" d="M89,17 L91,17 L91.5,18 L90,18.5 L88.5,18 Z"/>
  <path class="state-path" data-name="Tripura" d="M90,18.5 L91,19 L91,20 L90,20.5 L89.5,19.5 Z"/>
  <path class="state-path" data-name="Mizoram" d="M91,19 L92,19 L92.5,20.5 L91.5,21 L91,20 Z"/>
  <path class="state-path" data-name="Manipur" d="M92,17 L93,17 L93.5,18.5 L92.5,19 L92,18 Z"/>
  <path class="state-path" data-name="Nagaland" d="M93,15.5 L94,15 L94.5,16.5 L93.5,17 L93,16.5 Z"/>
  <path class="state-path" data-name="Arunachal Pradesh" d="M91,13.5 L93,13 L95,13.5 L95,14.5 L93,15 L91,14.5 Z"/>
  <path class="state-path" data-name="Sikkim" d="M87,15.5 L88,15 L88.5,16 L87.5,16.5 Z"/>
  <!-- Islands indicators -->
  <circle class="state-path" data-name="Andaman & Nicobar" cx="90" cy="32" r="0.8" fill="rgba(19,136,8,0.15)" stroke="rgba(19,136,8,0.4)" stroke-width="0.3"/>
  <circle class="state-path" data-name="Lakshadweep" cx="68" cy="34" r="0.5" fill="rgba(19,136,8,0.15)" stroke="rgba(19,136,8,0.4)" stroke-width="0.3"/>
  <!-- Key city markers -->
  <circle cx="75.5" cy="15" r="0.25" fill="#FF9933" opacity="0.8"><animate attributeName="r" values="0.25;0.4;0.25" dur="3s" repeatCount="indefinite"/></circle>
  <circle cx="72.8" cy="32.5" r="0.2" fill="#4ade80" opacity="0.6"/>
  <circle cx="76.5" cy="37" r="0.2" fill="#4ade80" opacity="0.6"/>
  <circle cx="88.5" cy="22" r="0.2" fill="#4ade80" opacity="0.6"/>
  <circle cx="72.5" cy="28.5" r="0.2" fill="#4ade80" opacity="0.6"/>
</svg>
`;
