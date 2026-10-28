# Vyom — Comprehensive Redesign & Architecture Plan

## 1. Executive Summary & Audit Findings

### Current Shortcomings Identified & Resolved
1. **Visual Disconnect**: The landing page features a cinematic midnight-navy 3D cosmic WebGL scene, liquid-glass pill buttons, and photographic capsule cards on warm cream (`#FEF6EB`). Previously, internal pages (especially Predictions, Kundli, Overview) were text-heavy card grids with minimal visual engagement.
2. **Navigation Inconsistencies**: Navigation has been unified into a single global application shell (`src/components/layout/Navbar.tsx` and `src/components/layout/AppShell.tsx`), sharing identical height, fonts, rounded geometry, active state indicator, and session controls.
3. **Predictions Page Visual Transformation**: The text-heavy card layout was replaced with:
   - `PlanetaryTransitVisualizer`: Interactive celestial transit radar mapping planetary transits against natal Lagna, with aspect (Drishti) lines and dignity meters.
   - `DashaTimelineVisualizer`: Horizontal Vimshottari 120-year sequence timeline with active Mahadasha pin and Antardasha sub-cycles.
   - Actionable Opportunity, Caution, and Suggested Action triad with authentic classical citations (*BPHS*, *Phaladeepika*, *Saravali*).
4. **Astrology Visualization Engines**:
   - `KundliPage`: Large interactive North Indian Diamond Chart and South Indian Fixed Signs Chart with instant toggle and planetary dignity inspector.
   - `CompatibilityPage`: `AshtakootaRadar` featuring 36-guna radial score gauge, 8-factor progress matrix, and dual-partner Moon & Nakshatra comparison without fake default scores.
   - `PanchangPage` & `MuhuratPage`: `SolarArcPanchang` showing diurnal sky arc from sunrise to sunset, Abhijit peak, and 8-segment Choghadiya ribbon. Emojis replaced with `lucide-react` icons.
   - `DoshaPage` & `RemediesPage`: Visual chart cancellation (Bhanga) diagnostic and illustrated remedy cards with step-by-step guidance.
   - `AstrologerPage`: Claude/ChatGPT-level conversational layout with session history sidebar, quick topic chips, and visual block cards (charts, timelines, remedies, citations).
5. **Icon & Emoji Hygiene**: Emojis were completely removed and replaced with consistent `lucide-react` icons and astronomical vector glyphs.
6. **Zero Tech Leaks**: No AI model names, API tokens, or technical terms exposed anywhere in the client UI.

---

## 2. Redesign Architecture & Component Consolidation

### A. Unified Application Shell & Navigation
- **File**: `src/components/layout/Navbar.tsx`: Shared by both landing page and internal application shell, maintaining identical styling, logo alignment, and route awareness.
- **File**: `src/components/layout/AppShell.tsx`: Global application shell with consistent padding, responsive `max-w-7xl` container, and branded footer.

### B. Visual Forecasting & Celestial Engines
- **File**: `src/components/visual/PlanetaryTransitVisualizer.tsx`: Interactive celestial transit radar mapping real-time planetary transits against the native's Lagna.
- **File**: `src/components/visual/DashaTimelineVisualizer.tsx`: Horizontal interactive Vimshottari 120-year timeline with active Mahadasha pin, Antardasha sub-cycles, and planetary theme badges.
- **File**: `src/components/visual/SolarArcPanchang.tsx`: Diurnal solar arc, sunrise/sunset apex, and 8-segment Choghadiya ribbon.
- **File**: `src/components/visual/AshtakootaRadar.tsx`: Radial score dial and 8-factor progress matrix for 36 Guna Milan.
- **File**: `src/components/charts/SouthIndianChart.tsx`: Fixed 12-box square grid for South Indian astrological format.

### C. Internal Page Overhauls
1. **Overview (`src/pages/DashboardPage.tsx`)**:
   - Hero Cosmic Insight with transit indicators.
   - Live North Indian chart summary with Lagna & Chandra indicators.
   - Dasha Timeline strip (Vimshottari 120-year cycle).
   - 5-card Visual Feature Gallery (Kundli, Predictions, Compatibility, Dosha, Remedies).
2. **Predictions (`src/pages/PredictionsPage.tsx`)**:
   - Visual forecast dashboard integrating `PlanetaryTransitVisualizer` and `DashaTimelineVisualizer`.
   - Category selector with vibrant astrological color themes.
   - Actionable Opportunity / Caution / Action triad with collapsible classical citations.
3. **Kundli (`src/pages/KundliPage.tsx`)**:
   - Interactive North Indian Diamond Chart and South Indian Fixed Signs Chart with toggle.
   - Side inspector displaying planetary degrees, nakshatras, dignity, and house types.
4. **Compatibility (`src/pages/CompatibilityPage.tsx`)**:
   - Dual-partner visual comparison cards with Moon & Nakshatra alignments.
   - `AshtakootaRadar` 36-guna radial score gauge and 8-factor matrix.
5. **Panchang & Muhurat (`src/pages/PanchangPage.tsx`, `src/pages/MuhuratPage.tsx`)**:
   - `SolarArcPanchang` diurnal arc, Abhijit Muhurta, and Choghadiya timeline.
   - Muhurat categories using Lucide icons (`Briefcase`, `Home`, `Heart`, `Car`, `Plane`) with zero emojis.
6. **Dosha & Remedies (`src/pages/DoshaPage.tsx`, `src/pages/RemediesPage.tsx`)**:
   - Visual chart-based cancellation (Bhanga) diagnostics for Kuja, Sade Sati, Kaal Sarp.
   - Illustrated visual remedy cards with step-by-step guidance and optimal timing.
7. **Astrologer (`src/pages/AstrologerPage.tsx`)**:
   - Chat layout with recent consultations sidebar, quick topic chips, and visual block rendering.

---

## 3. Verification & Acceptance
- **Build Status**: `npm run build` passes with 0 errors (`tsc -b && vite build`).
- **Browser Automation Verification**: All routes navigated and verified live via `browser_subagent`.
- **Zero Tech Leaks**: Verified zero model names, API tokens, or technical terms exposed anywhere in the client UI.
- **Visual Cohesion**: Consistent warm cream (`#FEF6EB`), midnight navy (`#09132E`), solar orange (`#FF4B19`), and celestial gold theme preserved across all pages.
