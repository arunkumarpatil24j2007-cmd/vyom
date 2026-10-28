import fs from 'fs';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 480" width="100%" height="100%" style="background: #09132E; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#09132E" />
      <stop offset="50%" stop-color="#0D1A3E" />
      <stop offset="100%" stop-color="#070E22" />
    </linearGradient>
    <linearGradient id="cardLeft" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1B1C28" />
      <stop offset="100%" stop-color="#13141F" />
    </linearGradient>
    <linearGradient id="cardRight" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#132742" />
      <stop offset="100%" stop-color="#0D1D34" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FF9A20" />
      <stop offset="100%" stop-color="#FFD166" />
    </linearGradient>
    <linearGradient id="orangeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FF4B19" />
      <stop offset="100%" stop-color="#FF7A45" />
    </linearGradient>
  </defs>

  <rect width="1200" height="480" fill="url(#bgGrad)" />

  <!-- Outer Frame -->
  <rect x="20" y="20" width="1160" height="440" rx="20" fill="none" stroke="#E8DCCB" stroke-opacity="0.15" stroke-width="1.5" />

  <!-- Title Header -->
  <g transform="translate(50, 48)">
    <text x="0" y="14" fill="#FF9A20" font-size="11" font-weight="700" letter-spacing="1.5">PHILOSOPHY IN ACTION • THE VYOM DIFFERENCE</text>
    <text x="0" y="42" fill="#FEF6EB" font-size="22" font-weight="800">From Opaque Celestial Jargon to Grounded Human Guidance</text>
  </g>

  <!-- ════════ LEFT CARD: TYPICAL ASTROLOGY (Width: 520) ════════ -->
  <g transform="translate(50, 115)">
    <rect width="530" height="320" rx="14" fill="url(#cardLeft)" stroke="#E8DCCB" stroke-opacity="0.1" stroke-width="1" />
    <rect x="0" y="0" width="530" height="4" rx="2" fill="#EF4444" fill-opacity="0.8" />

    <!-- Badge -->
    <rect x="20" y="20" width="190" height="24" rx="12" fill="#EF4444" fill-opacity="0.15" stroke="#EF4444" stroke-opacity="0.3" />
    <text x="32" y="36" fill="#F87171" font-size="11" font-weight="700">❌ TYPICAL ASTROLOGY OUTPUT</text>

    <text x="20" y="74" fill="#FEF6EB" font-size="15" font-weight="700">Raw Technical Placements &amp; Sanskrit Formulas</text>

    <!-- Raw text block -->
    <g transform="translate(20, 95)">
      <rect width="490" height="125" rx="8" fill="#090A10" stroke="#E8DCCB" stroke-opacity="0.08" />
      <text x="16" y="26" fill="#9BA3B8" font-size="12" font-style="italic">
        <tspan x="16" dy="0">"Sun in the 10th house in Capricorn, aspected by Saturn from the</tspan>
        <tspan x="16" dy="20">7th house. The 10th lord is placed in the 4th house in Cancer</tspan>
        <tspan x="16" dy="20">with Moon. Kendra-Trikona Yoga formed by Jupiter and Moon in</tspan>
        <tspan x="16" dy="20">mutual quadrants. Kuja in 12th indicates partial Manglik."</tspan>
      </text>
    </g>

    <!-- The Problem Breakdown -->
    <g transform="translate(20, 240)">
      <text x="0" y="16" fill="#EF4444" font-size="12" font-weight="700">Why this leaves users stranded:</text>
      <text x="0" y="36" fill="#8892B0" font-size="11.5">• Requires years of Sanskrit &amp; Jyotish study to understand.</text>
      <text x="0" y="54" fill="#8892B0" font-size="11.5">• Offers no practical guidance for career decisions or timing.</text>
      <text x="0" y="72" fill="#8892B0" font-size="11.5">• Reports afflictions without checking traditional cancellation yogas.</text>
    </g>
  </g>

  <!-- ════════ RIGHT CARD: VYOM'S ANSWER (Width: 540) ════════ -->
  <g transform="translate(615, 115)">
    <rect width="535" height="320" rx="14" fill="url(#cardRight)" stroke="#FF4B19" stroke-opacity="0.3" stroke-width="1" />
    <rect x="0" y="0" width="535" height="4" rx="2" fill="url(#orangeGrad)" />

    <!-- Badge -->
    <rect x="20" y="20" width="180" height="24" rx="12" fill="#10B981" fill-opacity="0.15" stroke="#10B981" stroke-opacity="0.3" />
    <text x="32" y="36" fill="#34D399" font-size="11" font-weight="700">✅ HOW VYOM ANSWERS</text>

    <text x="20" y="74" fill="#FEF6EB" font-size="15" font-weight="700">Answer-First Structured Life Guidance</text>

    <!-- Structured Reading Snippet -->
    <g transform="translate(20, 95)">
      <rect width="495" height="155" rx="8" fill="#09132E" stroke="#FF9A20" stroke-opacity="0.2" />
      
      <!-- Summary -->
      <text x="14" y="24" fill="#FEF6EB" font-size="12" font-weight="600">
        <tspan x="14" dy="0">"Your chart suggests strong potential for a structured, steady career in</tspan>
        <tspan x="14" dy="18">leadership or public service where long-term discipline is rewarded."</tspan>
      </text>

      <!-- Key Factors Tagged -->
      <g transform="translate(14, 55)">
        <rect width="64" height="18" rx="4" fill="#10B981" fill-opacity="0.2" />
        <text x="8" y="13" fill="#34D399" font-size="9.5" font-weight="700">SUPPORTS</text>
        <text x="76" y="13" fill="#C5CEE0" font-size="11">High executive vitality and natural collaborative authority</text>

        <rect y="24" width="64" height="18" rx="4" fill="#10B981" fill-opacity="0.2" />
        <text x="8" y="37" fill="#34D399" font-size="9.5" font-weight="700">SUPPORTS</text>
        <text x="76" y="37" fill="#C5CEE0" font-size="11">Emotional steadiness under professional pressure</text>

        <rect y="48" width="64" height="18" rx="4" fill="#FF9A20" fill-opacity="0.2" />
        <text x="8" y="61" fill="#FFD166" font-size="9.5" font-weight="700">TIMING</text>
        <text x="76" y="61" fill="#C5CEE0" font-size="11">Next 18-month Dasha window favors taking on greater scope</text>
      </g>
    </g>

    <!-- Why this works -->
    <g transform="translate(20, 268)">
      <text x="0" y="14" fill="#34D399" font-size="12" font-weight="700">Why this empowers the individual:</text>
      <text x="0" y="32" fill="#C5CEE0" font-size="11">• Clear, actionable, and grounded in converging chart evidence.</text>
      <text x="0" y="48" fill="#C5CEE0" font-size="11">• Honest about possibilities rather than deterministic guarantees.</text>
    </g>
  </g>
</svg>
`;

fs.writeFileSync('docs/assets/before-after-comparison.svg', svg);
console.log('before-after-comparison.svg generated successfully!');
