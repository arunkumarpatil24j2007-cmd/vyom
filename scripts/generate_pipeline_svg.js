import fs from 'fs';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 560" width="100%" height="100%" style="background: #09132E; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <defs>
    <!-- Gradients -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#09132E" />
      <stop offset="50%" stop-color="#0D1A3E" />
      <stop offset="100%" stop-color="#070E22" />
    </linearGradient>
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#15224A" stop-opacity="0.9" />
      <stop offset="100%" stop-color="#0E1838" stop-opacity="0.9" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FF9A20" />
      <stop offset="100%" stop-color="#FFD166" />
    </linearGradient>
    <linearGradient id="orangeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FF4B19" />
      <stop offset="100%" stop-color="#FF7A45" />
    </linearGradient>
    <linearGradient id="greenGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#08745B" />
      <stop offset="100%" stop-color="#10B981" />
    </linearGradient>

    <!-- Filter for soft glows -->
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background Canvas -->
  <rect width="1200" height="560" fill="url(#bgGrad)" />

  <!-- Subtle Celestial Grid Lines & Concentric Orbits -->
  <circle cx="600" cy="280" r="380" stroke="#FF9A20" stroke-opacity="0.06" stroke-width="1" fill="none" stroke-dasharray="4 6" />
  <circle cx="600" cy="280" r="500" stroke="#FF9A20" stroke-opacity="0.04" stroke-width="1" fill="none" />
  <circle cx="600" cy="280" r="240" stroke="#FF4B19" stroke-opacity="0.05" stroke-width="1" fill="none" />

  <!-- Outer Card Border -->
  <rect x="20" y="20" width="1160" height="520" rx="24" fill="none" stroke="#E8DCCB" stroke-opacity="0.15" stroke-width="1.5" />

  <!-- Header Section -->
  <g transform="translate(60, 60)">
    <circle cx="10" cy="10" r="6" fill="#FF4B19" />
    <circle cx="10" cy="10" r="12" stroke="#FF4B19" stroke-opacity="0.3" fill="none" />
    <text x="32" y="15" fill="#FF9A20" font-size="12" font-weight="700" letter-spacing="2">THE VYOM CONSULTATION PIPELINE</text>
    <text x="0" y="48" fill="#FEF6EB" font-size="26" font-weight="800" letter-spacing="-0.5">Deterministic Engine → Grounded RAG → Explainable Guidance</text>
    <text x="0" y="74" fill="#9BA3B8" font-size="14" font-weight="400">Every reading is grounded in astronomical mathematics and classical shastras before the AI writes a single word.</text>
  </g>

  <!-- Stage Connecting Flow Line -->
  <path d="M 155 310 L 1045 310" stroke="#E8DCCB" stroke-opacity="0.18" stroke-width="2" stroke-dasharray="6 6" />

  <!-- ═════════ STAGE 1: ROUTING ═════════ -->
  <g transform="translate(60, 180)">
    <!-- Stage Card -->
    <rect width="200" height="290" rx="16" fill="url(#cardGrad)" stroke="#E8DCCB" stroke-opacity="0.15" stroke-width="1" />
    <rect x="0" y="0" width="200" height="4" rx="2" fill="url(#greenGrad)" />
    
    <!-- Stage Indicator Pill -->
    <rect x="16" y="16" width="76" height="22" rx="11" fill="#08745B" fill-opacity="0.25" stroke="#10B981" stroke-opacity="0.4" stroke-width="1" />
    <text x="54" y="31" fill="#34D399" font-size="10" font-weight="700" text-anchor="middle">STAGE 1</text>
    
    <text x="16" y="66" fill="#FEF6EB" font-size="16" font-weight="700">Intent &amp; Safety</text>
    <text x="16" y="85" fill="#FF9A20" font-size="12" font-weight="600">Question Triage</text>
    
    <!-- Description -->
    <text x="16" y="118" fill="#C5CEE0" font-size="12" line-height="18">
      <tspan x="16" dy="0">• 10 Life Domains</tspan>
      <tspan x="16" dy="20">• Safety Guardrails</tspan>
      <tspan x="16" dy="20">• Crisis Topic Filter</tspan>
      <tspan x="16" dy="20">• Canonical Intent</tspan>
    </text>

    <text x="16" y="210" fill="#8892B0" font-size="11">
      <tspan x="16" dy="0">High-risk medical or</tspan>
      <tspan x="16" dy="16">crisis questions trigger</tspan>
      <tspan x="16" dy="16">care protocols instantly.</tspan>
    </text>

    <!-- Tag -->
    <rect x="16" y="254" width="100" height="20" rx="6" fill="#10B981" fill-opacity="0.15" />
    <text x="66" y="268" fill="#34D399" font-size="10" font-weight="700" text-anchor="middle">DETERMINISTIC</text>
  </g>

  <!-- Arrow 1 -> 2 -->
  <polygon points="275,310 265,305 265,315" fill="#FF9A20" />

  <!-- ═════════ STAGE 2: CALCULATION ═════════ -->
  <g transform="translate(285, 180)">
    <rect width="200" height="290" rx="16" fill="url(#cardGrad)" stroke="#E8DCCB" stroke-opacity="0.15" stroke-width="1" />
    <rect x="0" y="0" width="200" height="4" rx="2" fill="url(#greenGrad)" />
    
    <rect x="16" y="16" width="76" height="22" rx="11" fill="#08745B" fill-opacity="0.25" stroke="#10B981" stroke-opacity="0.4" stroke-width="1" />
    <text x="54" y="31" fill="#34D399" font-size="10" font-weight="700" text-anchor="middle">STAGE 2</text>
    
    <text x="16" y="66" fill="#FEF6EB" font-size="16" font-weight="700">Ephemeris</text>
    <text x="16" y="85" fill="#FF9A20" font-size="12" font-weight="600">Chart Mathematics</text>
    
    <text x="16" y="118" fill="#C5CEE0" font-size="12">
      <tspan x="16" dy="0">• Lahiri Ayanamsha</tspan>
      <tspan x="16" dy="20">• True Lagna &amp; Cusps</tspan>
      <tspan x="16" dy="20">• 9 Grahas &amp; Dignities</tspan>
      <tspan x="16" dy="20">• 120-Yr Vimshottari</tspan>
    </text>

    <text x="16" y="210" fill="#8892B0" font-size="11">
      <tspan x="16" dy="0">Calculated in pure TS</tspan>
      <tspan x="16" dy="16">from first principles.</tspan>
      <tspan x="16" dy="16">No external API calls.</tspan>
    </text>

    <rect x="16" y="254" width="100" height="20" rx="6" fill="#10B981" fill-opacity="0.15" />
    <text x="66" y="268" fill="#34D399" font-size="10" font-weight="700" text-anchor="middle">DETERMINISTIC</text>
  </g>

  <!-- Arrow 2 -> 3 -->
  <polygon points="500,310 490,305 490,315" fill="#FF9A20" />

  <!-- ═════════ STAGE 3: RULES ═════════ -->
  <g transform="translate(510, 180)">
    <rect width="200" height="290" rx="16" fill="url(#cardGrad)" stroke="#E8DCCB" stroke-opacity="0.15" stroke-width="1" />
    <rect x="0" y="0" width="200" height="4" rx="2" fill="url(#greenGrad)" />
    
    <rect x="16" y="16" width="76" height="22" rx="11" fill="#08745B" fill-opacity="0.25" stroke="#10B981" stroke-opacity="0.4" stroke-width="1" />
    <text x="54" y="31" fill="#34D399" font-size="10" font-weight="700" text-anchor="middle">STAGE 3</text>
    
    <text x="16" y="66" fill="#FEF6EB" font-size="16" font-weight="700">Parashari Rules</text>
    <text x="16" y="85" fill="#FF9A20" font-size="12" font-weight="600">Classical Evaluation</text>
    
    <text x="16" y="118" fill="#C5CEE0" font-size="12">
      <tspan x="16" dy="0">• 20+ Shastric Yogas</tspan>
      <tspan x="16" dy="20">• Manglik Cancellations</tspan>
      <tspan x="16" dy="20">• Sade Sati Transit</tspan>
      <tspan x="16" dy="20">• Factor Role Weighing</tspan>
    </text>

    <text x="16" y="210" fill="#8892B0" font-size="11">
      <tspan x="16" dy="0">Afflictions checked</tspan>
      <tspan x="16" dy="16">with cancellations.</tspan>
      <tspan x="16" dy="16">Outputs fixed roles.</tspan>
    </text>

    <rect x="16" y="254" width="100" height="20" rx="6" fill="#10B981" fill-opacity="0.15" />
    <text x="66" y="268" fill="#34D399" font-size="10" font-weight="700" text-anchor="middle">DETERMINISTIC</text>
  </g>

  <!-- Arrow 3 -> 4 -->
  <polygon points="725,310 715,305 715,315" fill="#FF9A20" />

  <!-- ═════════ STAGE 4: RETRIEVAL ═════════ -->
  <g transform="translate(735, 180)">
    <rect width="200" height="290" rx="16" fill="url(#cardGrad)" stroke="#E8DCCB" stroke-opacity="0.15" stroke-width="1" />
    <rect x="0" y="0" width="200" height="4" rx="2" fill="url(#greenGrad)" />
    
    <rect x="16" y="16" width="76" height="22" rx="11" fill="#08745B" fill-opacity="0.25" stroke="#10B981" stroke-opacity="0.4" stroke-width="1" />
    <text x="54" y="31" fill="#34D399" font-size="10" font-weight="700" text-anchor="middle">STAGE 4</text>
    
    <text x="16" y="66" fill="#FEF6EB" font-size="16" font-weight="700">BM25 Retrieval</text>
    <text x="16" y="85" fill="#FF9A20" font-size="12" font-weight="600">Curated Library</text>
    
    <text x="16" y="118" fill="#C5CEE0" font-size="12">
      <tspan x="16" dy="0">• 2,845+ Verified Chunks</tspan>
      <tspan x="16" dy="20">• 11 Classical Texts</tspan>
      <tspan x="16" dy="20">• BPHS, Phaladeepika</tspan>
      <tspan x="16" dy="20">• Source-Kind Filtering</tspan>
    </text>

    <text x="16" y="210" fill="#8892B0" font-size="11">
      <tspan x="16" dy="0">No hallucinated quotes.</tspan>
      <tspan x="16" dy="16">Fiction &amp; occult filtered</tspan>
      <tspan x="16" dy="16">by strict domain policy.</tspan>
    </text>

    <rect x="16" y="254" width="100" height="20" rx="6" fill="#10B981" fill-opacity="0.15" />
    <text x="66" y="268" fill="#34D399" font-size="10" font-weight="700" text-anchor="middle">DETERMINISTIC</text>
  </g>

  <!-- Arrow 4 -> 5 -->
  <polygon points="950,310 940,305 940,315" fill="#FF4B19" />

  <!-- ═════════ STAGE 5: SYNTHESIS ═════════ -->
  <g transform="translate(960, 180)">
    <rect width="180" height="290" rx="16" fill="url(#cardGrad)" stroke="#FF4B19" stroke-opacity="0.4" stroke-width="1.5" />
    <rect x="0" y="0" width="180" height="4" rx="2" fill="url(#orangeGrad)" />
    
    <rect x="16" y="16" width="76" height="22" rx="11" fill="#FF4B19" fill-opacity="0.25" stroke="#FF4B19" stroke-opacity="0.5" stroke-width="1" />
    <text x="54" y="31" fill="#FF7A45" font-size="10" font-weight="700" text-anchor="middle">STAGE 5</text>
    
    <text x="16" y="66" fill="#FEF6EB" font-size="16" font-weight="700">Grounded AI</text>
    <text x="16" y="85" fill="#FF4B19" font-size="12" font-weight="600">Explainable Synthesis</text>
    
    <text x="16" y="118" fill="#C5CEE0" font-size="12">
      <tspan x="16" dy="0">• Gemini Flash LLM</tspan>
      <tspan x="16" dy="20">• Plain-Language UI</tspan>
      <tspan x="16" dy="20">• Contract Validator</tspan>
      <tspan x="16" dy="20">• Roles Preserved</tspan>
    </text>

    <text x="16" y="210" fill="#8892B0" font-size="11">
      <tspan x="16" dy="0">Post-generation schema</tspan>
      <tspan x="16" dy="16">validator enforces</tspan>
      <tspan x="16" dy="16">roles and timing integrity.</tspan>
    </text>

    <rect x="16" y="254" width="148" height="20" rx="6" fill="#FF4B19" fill-opacity="0.2" />
    <text x="90" y="268" fill="#FF7A45" font-size="10" font-weight="700" text-anchor="middle">GENERATIVE + VALIDATED</text>
  </g>

  <!-- Bottom Principle Banner -->
  <g transform="translate(60, 495)">
    <rect width="1080" height="32" rx="8" fill="#15224A" stroke="#E8DCCB" stroke-opacity="0.1" stroke-width="1" />
    <text x="540" y="21" fill="#FEF6EB" font-size="12" font-weight="500" text-anchor="middle">
      <tspan fill="#FF9A20" font-weight="700">Core Guarantee:</tspan> Identical birth details + identical question = identical astrological assessment &amp; rule evaluation every time.
    </text>
  </g>
</svg>
`;

fs.writeFileSync('docs/assets/pipeline-workflow.svg', svg);
console.log('pipeline-workflow.svg generated successfully!');
