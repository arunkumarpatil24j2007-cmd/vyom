# Vyom — Comprehensive Architecture & Implementation Audit

**Audit Date:** 2026-10-18  
**Scope:** Full repository inspection, data flow, component hierarchy, astrology calculation engines, AI integration, design system coherence, and remediation roadmap.

---

## 1. Current Architecture Overview

- **Framework & Build System:** Vite 8.3 + React 19.2 + TypeScript + Tailwind CSS v4.
- **3D Graphics Engine:** Three.js 0.186 + React Three Fiber 9.8 + `@react-three/drei` 10.7 (Client-side WebGL canvas in `src/components/vyom/cosmic/`).
- **Routing:** `react-router-dom` v7 with client-side SPA routing (`BrowserRouter`, `Routes`, `Route`).
- **Styling Architecture:** Single global stylesheet (`src/index.css`) defining Tailwind theme variables (`--color-cream`, `--color-navy`, `--color-solar-orange`, etc.), utility classes, and glassmorphic button definitions.
- **Runtime Model:** Client-side React SPA. No external backend framework (e.g. Next.js/Express) currently running, but Vite dev server handles local serving and can host Node middleware for secure server-side AI proxying and document ingestion.

---

## 2. Route Inventory & Component Dependency Matrix

| Route Path | Primary Page Component | Header / Shell Used | Primary Data Source | Current Issues |
| :--- | :--- | :--- | :--- | :--- |
| `/` | `LandingPage.tsx` | `Navbar` (`isApp=false`) | Static marketing + `CosmicCanvas` | Duplicate text on 4 feature cards (`card_*.png` has baked-in labels + HTML buttons). |
| `/dashboard` | `DashboardPage.tsx` | `AppShell` -> `Navbar` (`isApp=true`) | `src/data/demo.ts` (`demoChart`, `demoProfiles`) | Hardcoded for "Arjun Mehta"; wall of dense text; no guest-first onboarding state. |
| `/kundli` | `KundliPage.tsx` | `AppShell` -> `Navbar` (`isApp=true`) | `demoChart` | Displays hardcoded Leo Lagna chart regardless of visitor birth details. |
| `/astrologer` | `AstrologerPage.tsx` | `AppShell` -> `Navbar` (`isApp=true`) | `setTimeout` mock simulation in `handleSend` | AI is mocked with fixed strings; no Qwen LLM connected; no visual answer block rendering. |
| `/predictions`| `PredictionsPage.tsx` | `AppShell` -> `Navbar` (`isApp=true`) | `demoChart`, `demoDashaPeriods` | Text-heavy essay cards; ungrounded percentage bars ("88% alignment"); no transit timeline. |
| `/compatibility`| `CompatibilityPage.tsx`| `AppShell` -> `Navbar` (`isApp=true`) | Hardcoded Arjun & Priya (31/36 points) | Cannot enter real two-person birth data; static Ashtakoota table. |
| `/panchang` | `PanchangPage.tsx` | `AppShell` -> `Navbar` (`isApp=true`) | Hardcoded Shukla Paksha Saptami | Static values not computed for current user location or date. |
| `/muhurat` | `MuhuratPage.tsx` | `AppShell` -> `Navbar` (`isApp=true`) | Static list of times | Hardcoded time slots; not dynamically calculated from sunrise/sunset ephemeris. |
| `/dosha` | `DoshaPage.tsx` | `AppShell` -> `Navbar` (`isApp=true`) | `demoChart` + static text | Dense text blocks without actionable visual remedy cards. |
| `/remedies` | `RemediesPage.tsx` | `AppShell` -> `Navbar` (`isApp=true`) | Static text list | Generic planet emojis/icons; lacks authentic situational illustrations and safety boundaries. |
| `/reports` | `ReportsPage.tsx` | `AppShell` -> `Navbar` (`isApp=true`) | Hardcoded reports for "Arjun Mehta" | Cannot view, export, or delete real guest session reports. |
| `/settings` | `SettingsPage.tsx` | `AppShell` -> `Navbar` (`isApp=true`) | Local state + `demoProfiles` | Hardcoded Arjun Mehta profile editing; lacks "Clear My Data" guest session control. |
| `/login`, `/signup` | `AuthPage.tsx` | Custom standalone layout | Local state (default: "Arjun Mehta") | Bypasses guest-first capability; forces registration before exploring. |

---

## 3. Shared vs. Duplicated Components & Styling Inconsistencies

1. **Navigation:**
   - `Navbar.tsx` is shared via `AppShell.tsx`, but has hardcoded user label `"Arjun Mehta"` on line 79.
   - Active state styling uses `#EDE3D4`, but some pages define custom sub-navigation headers with different border radii and margins.
   - `Header.tsx` and `Sidebar.tsx` exist in `src/components/layout/` as legacy duplicates not currently active in `App.tsx`.
2. **Design Tokens:**
   - `src/index.css` defines CSS variables under `@theme`, but individual page components repeat inline arbitrary colors (`#09132E`, `#FF4B19`, `#FAF2E8`, `#E8DCCB`).
3. **Card & Glass Controls:**
   - Buttons and cards use multiple overlapping classes (`btn-pill-orange`, `btn-pill-cream`, `btn-pill-navy-glass`, `glass-pill-capsule`, `card-navy`, `card-cream`).

---

## 4. Demo Data Locations Identified

- `src/data/demo.ts` (348 lines, 17.6KB):
  - `demoProfiles`: Contains `"Arjun Mehta"` and `"Priya Sharma"`.
  - `demoChart`: Fixed Leo Lagna chart (14°19') with fixed planetary longitudes.
  - `demoDashaPeriods`: Fixed Jupiter -> Saturn -> Mercury periods.
  - `demoConversations`: Pre-canned AI responses referencing Arjun's chart.
  - `recentAnalyses`: Hardcoded report history.
- Hardcoded references in page views:
  - `AstrologerPage.tsx` (Line 105: `Chart: Arjun M.`)
  - `AuthPage.tsx` (Line 18: `fullName = 'Arjun Mehta'`)
  - `ReportsPage.tsx` (Lines 20 & 33: `Arjun Mehta`, `Arjun & Priya`)
  - `Navbar.tsx` (Line 79: `Arjun Mehta`)

---

## 5. Broken & Incomplete Interactions

1. **Feature Card Text Duplication:** On `LandingPage.tsx`, the 4 feature cards have labels baked into `card_kundli.png`, `card_predictions.png`, `card_karmic.png`, and `card_remedies.png`. An additional HTML `<span className="glass-pill-capsule">` is rendered over each card, displaying double text.
2. **Chat Consultation Execution:** The AI Astrologer (`AstrologerPage.tsx`) uses a simple client `setTimeout` simulating a reply. No real model connection exists.
3. **No Dynamic Chart Calculations:** Creating a new chart in `NewChartPage.tsx` or entering birth details does not invoke astronomical ephemeris formulas—it falls back to `demoChart`.
4. **Lack of Guest-First Onboarding:** If a visitor arrives at `/dashboard` without entering birth details, they are presented with Arjun Mehta's chart rather than a clean, intuitive onboarding modal/flow.
5. **No Visual Answer Protocol:** Chat answers only display raw text blocks; they cannot dynamically render North/South Indian charts, SVG planetary transit timelines, or structured metric cards.

---

## 6. AI Integration Status

- **API Provider:** OpenRouter API configured via environment variables.
- **Target Model:** `qwen/qwen3.8-27b` (Verified active and responding on OpenRouter).
- **Security Requirement:** The key must never be bundled into the client build. A server-side middleware/adapter in Vite (`src/lib/ai/server/`) must securely sign and dispatch requests with `max_tokens: 1500`.

---

## 7. Calculation-Engine Status

- Currently, zero astronomical calculation libraries exist in `node_modules` (only Three.js, Lucide, Recharts).
- A deterministic, high-precision sidereal ephemeris engine must be implemented in `src/lib/astrology/calculations/`:
  - Julian Day calculation (`toJulianDay`).
  - Sidereal Lahiri Ayanamsha computation ($23^\circ 51'$ base at J2000 + precession).
  - True Ascendant (Lagna) and 12 Bhava cusps from Geographic Latitude, Longitude, and Local Sidereal Time (LST).
  - 9 Graha longitudes (Surya, Chandra, Mangala, Budha, Guru, Shukra, Shani, Rahu, Ketu).
  - 27 Nakshatras & 4 Padas.
  - Vimshottari Dasha 120-year cycle balance.
  - Ashtakoota 36-point compatibility matrix.
  - Panchang (Tithi, Nakshatra, Yoga, Karana, Var).

---

## 8. Database, Storage & Authentication Status

- Client-side anonymous guest session management with `crypto.randomUUID()` stored in `localStorage` under key `vyom_guest_session`.
- Guest data store (`src/lib/storage/guestStore.ts`):
  - Birth profile (Name, DOB, Time, Place, Lat/Lng, Timezone).
  - Calculated natal charts.
  - Saved reports and consultation history.
  - Explicit "Clear My Data" privacy wipe.
  - Optional migration when signing in.

---

## 9. Existing Assets to Preserve

- **3D WebGL Cosmic Scene:** The complete Three.js + R3F scene in `src/components/vyom/cosmic/` (rotating Zodiac wheel, vector glyphs, Saturn 3D occlusion, blue/red procedural planets, celestial ribbons, starfield) must remain untouched and mounted cleanly in `LandingPage.tsx`.
- **Cosmic Palette & Typography:** Warm cream `#FEF6EB`, midnight navy `#09132E`, solar orange `#FF4B19`, celestial gold `#FF9A20`.
- **Authentic Artwork:** Background artwork assets in `public/assets/` (`hero_cosmic_full.png`, `card_*.png`).

---

## 10. Execution Sequence

1. **Phase 2 & 3:** Standardize unified design tokens, shared `AppShell`, consistent navigation, and mobile menu.
2. **Phase 4:** Remove demo data, build guest session store, and implement onboarding/empty states.
3. **Phase 5 & 6:** Rebuild Dashboard (clean hierarchy, visual birth-chart preview, compact Panchang) and Predictions (visual transit timelines, structured categories).
4. **Phase 7 & 8:** Implement OpenRouter Qwen 3.8 27B server proxy, typed Visual Answer Protocol, and `VisualAnswer.tsx` block renderer.
5. **Phase 9, 10 & 13:** Implement classical astrology knowledge corpus (RAG retrieval, chunk metadata, citations) and document methodology in `docs/astrology-methodology.md`.
6. **Phase 11 & 12:** Implement deterministic astronomical calculation engine (Lahiri Ayanamsha, Lagna, planets, Nakshatras, Dashas, Panchang, Ashtakoota) with validation.
7. **Phase 14 & 15:** Fix landing page feature card duplicate text; rebuild Remedies with authentic respectful illustrations.
8. **Phase 16 & 18:** Add cursor-responsive card effects (`interactive-card`), comprehensive regression tests, and full browser visual QA.
