# DOCUMENT 07 — VYOM DATA SCHEMAS AND TECHNICAL ARCHITECTURE

## 1. The 9-Layer AI Knowledge Engineering Architecture (Layers A–I)

To ensure that another AI model or software engineering team can build, audit, and scale the Vyom web application without mixing astronomical computation with generative text, the entire knowledge repository is partitioned into nine decoupled architectural layers:

| Layer ID | Layer Name | Execution Mode | Primary Responsibility & Artifact Location |
| :--- | :--- | :--- | :--- |
| **Layer A** | **Core Concepts & Ontology** | Static Graph / Schema | Epistemological 3-tier definitions, cross-tradition entity IDs (`graha`, `rashi`, `bhava`, `nakshatra`), and shared coordinate models (`DOCUMENT_01`, `DOCUMENT_07`). |
| **Layer B** | **Tradition-Specific Rule Namespaces** | Deterministic Knowledge Base | Strictly isolated rule collections for `vedic_parashari`, `vedic_kp`, `vedic_jaimini`, `vedic_tajika`, `hellenistic_wholesign`, `western_modern`, `chinese_bazi`, and `chinese_zwds` (`DOCUMENT_03`, `DOCUMENT_04`, `DOCUMENT_06`). |
| **Layer C** | **Calculation Specifications** | **100% Deterministic Code** | Pure mathematical engines for IANA `tzdb` normalization, Julian Day ($\text{JD}_{\text{UT}}, \text{JD}_{\text{TT}}$), ephemeris evaluation, spherical trigonometry, house cusps, and Ayanamsha (`DOCUMENT_02`, `vyom_calc_engine.py`). |
| **Layer D** | **Interpretation Rule Engine** | **Deterministic Rule DSL** | Forward-chaining predicate evaluator that tests `ChartFrame` against Layer B rules, executes *Bhanga/Parihara* exception overrides, and emits structured `FiredRuleRecord` lists (`DOCUMENT_06`). |
| **Layer E** | **Timing & Prediction Engine** | **Deterministic Code + Scoring** | Computes Vimshottari/Ashtottari/Chara Dashas, *Gochara* transits, *Ashtakavarga* bindus, Annual Profections, Zodiacal Releasing, and Solar Returns (`DOCUMENT_03`, `DOCUMENT_05`). |
| **Layer F** | **Domain-Specific Synthesis** | Hybrid (Rule Calculus + Graph) | Aggregates Layer D and Layer E outputs across the 10 Life Domains using the 5-stage Conflict-Reconciliation Calculus (`DOCUMENT_05`, `DOCUMENT_06`). |
| **Layer G** | **Evidence, Sensitivity & Uncertainty** | Deterministic Perturbation + Policy | Runs $\pm \Delta t$ birth-time perturbation sweeps, flags Varga/Lagna boundary fragility, and attaches Tier 3 empirical evidence metadata (`DOCUMENT_01`, `DOCUMENT_10`). |
| **Layer H** | **User Question Router & Response NLG** | LLM Grounded in JSON Context | Classifies user intent, triggers follow-up questions if inputs are insufficient, and synthesizes natural-language explanations strictly constrained by Layers C–G (`DOCUMENT_07`, `DOCUMENT_10`). |
| **Layer I** | **Numerical & Behavioral Evaluation** | Automated CI/CD Test Suite | Executes golden ephemeris test vectors, edge-case regressions, and LLM safety/hallucination rubrics (`DOCUMENT_08`, `DOCUMENT_10`). |

---

## 2. Formal Shared Chart Data Schema (`VyomChartDataSchema.json`, Draft 2020-12)

The JSON Schema below defines the canonical data contract (`VyomChartRecord`) passed between the deterministic calculation microservice and the AI interpretation and retrieval layers. It preserves raw Tier 1 astronomical coordinates alongside tradition-specific feature extractions without forcing different traditions into a single interpretive mold:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://vyom.astrology.ai/schemas/v1/vyom-chart-record.schema.json",
  "title": "VyomChartRecord",
  "description": "Canonical multi-tradition astrological chart, calculation provenance, rule evaluation, and uncertainty envelope.",
  "type": "object",
  "required": [
    "chart_id",
    "calculation_version",
    "birth_input",
    "time_location_provenance",
    "astronomical_settings",
    "tier1_astronomical_state",
    "uncertainty_metadata",
    "tradition_modules"
  ],
  "properties": {
    "chart_id": { "type": "string", "format": "uuid" },
    "person_alias": { "type": "string", "description": "Pseudonymized user label; never store raw PII unnecessarily." },
    "calculation_version": { "type": "string", "example": "vyom-calc-1.0.0-de440" },
    "birth_input": {
      "type": "object",
      "required": ["local_date", "time_precision", "place_name"],
      "properties": {
        "local_date": { "type": "string", "pattern": "^\\d{4}-\\d{2}-\\d{2}$" },
        "local_time": { "type": ["string", "null"], "pattern": "^\\d{2}:\\d{2}(:\\d{2})?$" },
        "time_precision": {
          "type": "string",
          "enum": ["exact_recorded", "rounded_15m", "estimated_window", "unknown", "conflicting_records"]
        },
        "uncertainty_window_minutes": { "type": "number", "minimum": 0 },
        "alternate_time_candidates": {
          "type": "array",
          "items": { "type": "string" }
        },
        "calendar_system": { "type": "string", "enum": ["gregorian", "julian", "hindu_lunisolar", "chinese_lunisolar"], "default": "gregorian" },
        "place_name": { "type": "string" },
        "country_code": { "type": "string", "minLength": 2, "maxLength": 2 },
        "admin_region": { "type": "string" }
      }
    },
    "time_location_provenance": {
      "type": "object",
      "required": ["latitude_deg", "longitude_east_deg", "iana_timezone", "utc_datetime", "jd_ut", "jd_tt", "delta_t_seconds"],
      "properties": {
        "latitude_deg": { "type": "number", "minimum": -90.0, "maximum": 90.0 },
        "longitude_east_deg": { "type": "number", "minimum": -180.0, "maximum": 180.0 },
        "elevation_meters": { "type": "number", "default": 0.0 },
        "iana_timezone": { "type": "string", "example": "Asia/Kolkata" },
        "tzdb_version": { "type": "string", "example": "2026c" },
        "utc_offset_seconds": { "type": "integer" },
        "is_dst": { "type": "boolean" },
        "dst_fold_or_gap_flag": { "type": "string", "enum": ["normal", "ambiguous_fold_0", "ambiguous_fold_1", "nonexistent_gap_adjusted", "pre_1970_uncertain_tz"] },
        "utc_datetime": { "type": "string", "format": "date-time" },
        "jd_ut": { "type": "number" },
        "jd_tt": { "type": "number" },
        "delta_t_seconds": { "type": "number" },
        "gmst_deg": { "type": "number" },
        "gast_deg": { "type": "number" },
        "lst_deg": { "type": "number" }
      }
    },
    "astronomical_settings": {
      "type": "object",
      "required": ["ephemeris_kernel", "reference_frame", "lunar_node_mode"],
      "properties": {
        "ephemeris_kernel": { "type": "string", "enum": ["jpl_de440", "jpl_de441", "swisseph_2.10", "meeus_analytical"] },
        "reference_frame": { "type": "string", "enum": ["geocentric_apparent", "topocentric_apparent", "heliocentric"] },
        "lunar_node_mode": { "type": "string", "enum": ["mean_node", "true_osculating_node", "both"] },
        "mean_obliquity_deg": { "type": "number" },
        "true_obliquity_deg": { "type": "number" },
        "nutation_longitude_arcsec": { "type": "number" }
      }
    },
    "tier1_astronomical_state": {
      "type": "object",
      "required": ["bodies", "horizon_angles_tropical"],
      "properties": {
        "horizon_angles_tropical": {
          "type": "object",
          "properties": {
            "ascendant_deg": { "type": ["number", "null"] },
            "mc_deg": { "type": ["number", "null"] },
            "descendant_deg": { "type": ["number", "null"] },
            "ic_deg": { "type": ["number", "null"] },
            "vertex_deg": { "type": ["number", "null"] }
          }
        },
        "bodies": {
          "type": "object",
          "additionalProperties": {
            "type": "object",
            "required": ["tropical_lon_deg", "ecliptic_lat_deg", "distance_au", "speed_lon_deg_per_day", "motion_state"],
            "properties": {
              "tropical_lon_deg": { "type": "number", "minimum": 0.0, "maximum": 360.0 },
              "ecliptic_lat_deg": { "type": "number" },
              "right_ascension_deg": { "type": "number" },
              "declination_deg": { "type": "number" },
              "distance_au": { "type": "number" },
              "speed_lon_deg_per_day": { "type": "number" },
              "motion_state": { "type": "string", "enum": ["direct", "retrograde", "stationary_retrograde", "stationary_direct"] }
            }
          }
        }
      }
    },
    "uncertainty_metadata": {
      "type": "object",
      "required": ["workflow_id", "lagna_sign_stability_pct", "d9_lagna_stability_pct", "suppressed_features"],
      "properties": {
        "workflow_id": { "type": "string", "enum": ["A_exact", "B_approximate", "C_unknown_time", "D_conflicting", "E_midnight", "F_tz_dst_boundary"] },
        "lagna_sign_stability_pct": { "type": "number", "minimum": 0.0, "maximum": 100.0 },
        "d9_lagna_stability_pct": { "type": "number", "minimum": 0.0, "maximum": 100.0 },
        "nakshatra_stability_pct": { "type": "number", "minimum": 0.0, "maximum": 100.0 },
        "dasha_date_error_days_plus_minus": { "type": "number" },
        "suppressed_features": { "type": "array", "items": { "type": "string" } }
      }
    },
    "tradition_modules": {
      "type": "object",
      "properties": {
        "vedic_parashari": {
          "type": "object",
          "properties": {
            "ayanamsha_id": { "type": "string", "enum": ["lahiri_chitrapaksha", "true_chitrapaksha", "krishnamurti_kp", "bv_raman", "pushya_paksha"] },
            "ayanamsha_deg": { "type": "number" },
            "house_system": { "type": "string", "enum": ["whole_sign", "sripati_bhava_chalita", "equal_lagna"] },
            "sidereal_lagna": { "type": "object" },
            "grahas": { "type": "object" },
            "bhavas": { "type": "array" },
            "shodashavarga": { "type": "object" },
            "shadbala": { "type": "object" },
            "ashtakavarga": { "type": "object" },
            "vimshottari_dasha": { "type": "object" },
            "panchanga_at_birth": { "type": "object" },
            "fired_rules": { "type": "array", "items": { "type": "object" } }
          }
        },
        "hellenistic_wholesign": { "type": "object" },
        "western_tropical_modern": { "type": "object" },
        "chinese_bazi": { "type": "object" },
        "chinese_zwds": { "type": "object" }
      }
    }
  }
}
```

---

## 3. Knowledge Graph Ontology (Nodes, Edges, and Provenance Links)

Layer A and Layer B are indexed in a property graph (`VyomKnowledgeGraph`) that connects astrological entities, mathematical calculations, classical texts, and empirical studies via typed directed edges:

- **Core Node Types (`NodeLabel`)**:
  `Tradition`, `Graha/Planet`, `Rashi/Sign`, `Bhava/House`, `Nakshatra`, `Pada`, `Varga`, `Yoga`, `Dosha`, `DashaSystem`, `KarakaRole`, `LifeDomain`, `RuleRecord`, `ClassicalText`, `TextPassage`, `EmpiricalStudy`, `TestCase`.
- **Core Edge Types (`RelationshipType`)**:
  - `(Graha)-[:RULES_SIGN {tradition, moolatrikona_span}]->(Rashi)`
  - `(Graha)-[:EXALTED_IN {deep_degree, source_passage_id}]->(Rashi)`
  - `(Graha)-[:DEBILITATED_IN {deep_degree, source_passage_id}]->(Rashi)`
  - `(Graha)-[:NAISARGIKA_KARAKA_FOR {source_passage_id}]->(Bhava)`
  - `(Nakshatra)-[:RULED_BY_DASHA_LORD {years}]->(Graha)`
  - `(Pada)-[:MAPS_TO_NAVAMSHA]->(Rashi)`
  - `(RuleRecord)-[:EVALUATES_DOMAIN]->(LifeDomain)`
  - `(RuleRecord)-[:CITES_PASSAGE {citation_type: "direct_verse" | "commentary" | "synthesis"}]->(TextPassage)`
  - `(RuleRecord)-[:CANCELLED_BY]->(RuleRecord)`
  - `(RuleRecord)-[:CONFLICTS_WITH {disagreement_note}]->(RuleRecord)`
  - `(EmpiricalStudy)-[:TESTS_CLAIM {sample_size, effect_size, p_value}]->(RuleRecord | LifeDomain)`

---

## 4. User Question Taxonomy and Retrieval-Reasoning Router (Section 21)

When a user submits a natural-language question to Vyom, the **Question Router** classifies the query into one of 14 canonical question categories and executes the smallest verified calculation and rule subset required:

| Question Category | Required User Inputs | Stored Chart vs. Recalculation | Rules & Modules Retrieved | When to Ask Follow-Up / Refuse |
| :--- | :--- | :--- | :--- | :--- |
| **Q01: "What does my birth chart say?" (Full Natal Overview)** | Date, Time (or unknown flag), Place, Preferred Tradition. | Compute & store full `VyomChartRecord`. | Lagna, Sun, Moon, Nakshatra, top 3 Yogas, active Mahadasha-Antardasha. | If date or place is missing, ask before computing. If time is missing, offer Workflow C (Chandra Lagna) or ask for time. |
| **Q02: "What is my Lagna (Ascendant)?"** | Date, **Exact/Approx Time**, Place. | Read `sidereal_lagna` / `tropical_ascendant`. | Stage 04–05 Horizon Angles + Sensitivity Sweep ($\pm \Delta t$). | **Refuse single-sign answer if time is unknown**; if within $1^\circ$ of sign boundary, report both adjacent signs and time threshold. |
| **Q03: "What is my Moon sign (*Rashi*) and *Nakshatra*?"** | Date, Time (or 24h date if unknown), Place. | Read `moon.d1_rashi` and `moon.nakshatra`. | Nakshatra/Pada lookup (`DOCUMENT_03` Sec. 4). | If time is unknown AND Moon crosses a Rashi ($30^\circ$) or Nakshatra ($13^\circ 20'$) boundary during that 24h day, report the exact transition clock time and both options. |
| **Q04: "What are my strongest planetary placements?"** | Full birth data. | Read `shadbala`, `dignities`, `vargottama`, `ashtakavarga`. | `vedic.varga.vargottama`, *Pancha Mahapurusha*, *Shadbala* Rupa ratios vs. minimum thresholds. | Distinguish functional beneficence (house lordship) from raw positional strength (*Shadbala*)—a strong 6th/8th lord is powerful but challenging. |
| **Q05: "Which career fields fit my chart?"** | Full birth data (exact/approx time required for 10th house & $D_{10}$). | Read $D_1$ 10th/6th/2nd/11th + $D_{10}$ (*Dashamsha*). | Domain 10.3 (`career`), *Dharma-Karmadhipati*, *Amala Yoga*, $D_{10}$ Lagna/10th lord. | If birth time error $> \pm 6\text{ min}$, suppress $D_{10}$ Lagna and rely on $D_1$ 10th house and Saturn/Sun/Mercury/Jupiter karakas. |
| **Q06: "What does my current Mahadasha / Antardasha mean?"** | Full birth data + current UTC timestamp. | Recompute active Dasha slice at `now_utc`. | `vedic.dasha.mahadasha_antardasha_synthesis` + natal house lordships/placements of MD and AD lords. | If Moon is near a Nakshatra boundary and birth time is approximate, display the $\pm \text{days}$ uncertainty band on the transition date. |
| **Q07: "Which themes are associated with the next year?"** | Full birth data + target 12-month window. | Compute Dasha + *Gochara* timeline + *Tajika Varshaphala* / *Annual Profection*. | `vedic.transit.double_transit_activation`, `hellenistic.timing.annual_profections`, *Tajika Varshesha*. | Present multi-month thematic windows; never invent day-specific deterministic event predictions. |
| **Q08: "How does this transit (e.g., Sade Sati / Jupiter transit) interact with my chart?"** | Birth data + target transit planet. | Compute transit ephemeris over natal Rashi/Lagna + SAV/BAV bindus. | `vedic.transit.sade_sati_ashtakavarga_modulated`, *Kaksha* sub-zone bindus, *Vedha* checks. | Never interpret a transit in isolation from the active Mahadasha. |
| **Q09: "What does my chart indicate about marriage / relationships?"** | Full birth data (and partner's data if synastry requested). | Read 7th house, 7L, Venus/Jupiter, $UL$, $D_9$ (+ *Ashtakoota* if 2 charts). | Domain 10.5 (`marriage`), `vedic.dosha.manglik_with_parihara`, `vedic.compatibility.nadi_dosha_and_parihara`. | Prohibit fatalistic divorce/widowhood claims or reducing partner worth to a Guna score. |
| **Q10: "How do different astrological schools interpret this placement?"** | Birth data or specific placement query. | Evaluate across multiple `tradition_modules`. | Compare `vedic_parashari` vs. `vedic_kp` vs. `hellenistic_wholesign` vs. `western_modern` side-by-side. | Clearly explain whether divergence comes from Tier 1 Ayanamsha ($\sim 24^\circ$ shift) or Tier 2 house/aspect rules. |
| **Q11: "Why do two astrologers or apps disagree on my chart?"** | Birth data + the two conflicting claims. | Run diagnostic diff across Ayanamshas, House Systems, Node modes, and TZ offsets. | Diagnostic comparison table (`Lahiri` vs `Raman` vs `KP`; `Whole Sign` vs `Sripati/Placidus`; `365.2425d` vs `360d` Dasha year). | Pinpoint the exact mathematical setting causing the discrepancy. |
| **Q12: "What can be interpreted without an exact birth time?"** | Date + Place (`time_precision = unknown`). | Execute **Workflow C** (00:00 to 24:00 UT sweep). | *Chandra Lagna* (if Moon sign invariant), *Surya Lagna*, planetary sign placements, mutual planetary aspects. | Explicitly list what is known vs. what requires a birth time (Lagna, Bhavas, Vargas). |
| **Q13: "Which conclusions are directly calculated vs. interpreted?"** | Any chart or reading. | Audit output via Epistemological Tier tags. | Separate Tier 1 (Ephemeris/Angles), Tier 2 (Textual rules & citations), and Tier 3 (Empirical status). | Always provide transparent three-tier separation. |
| **Q14: Medical Diagnosis, Death Prediction, Stock/Gambling Picks, or Curses** | High-risk / out-of-bounds prompt. | **Halt astrological prediction**. | Safety Policy Guardrail (`DOCUMENT_10`). | **Refuse prediction responsibly**: explain that astrology cannot diagnose disease, predict death dates, pick stocks, or detect curses, and provide safe educational context or professional referrals. |

---

## 5. Modular System Architecture, Licensing Audit, and 8-Phase Implementation Roadmap

### 5.1 Deterministic Code vs. LLM Responsibility Boundary
A cardinal architectural rule of Vyom is **Zero LLM Arithmetic**:
- **100% Deterministic Microservices (Rust / Python / C)**: Geocoding, IANA `tzdb` resolution, Julian Day conversion, Ephemeris evaluation, Ayanamsha subtraction, Ascendant/MC/Cusp trigonometry, Shodashavarga sign mapping, Nakshatra/Pada lookup, Vimshottari/Ashtottari/Chara Dasha date schedules, Shadbala, Ashtakavarga matrices, Ashtakoota Guna scoring, and Rule DSL predicate evaluation.
- **LLM Orchestration & Generation Layer**: Conversational slot-filling for missing birth details, translating user questions into structured query intents, synthesizing structured `FiredRuleRecord` JSON objects into clear, empathetic, well-cited natural-language prose, explaining historical disagreements across schools, and enforcing safety/uncertainty disclosures.

### 5.2 Software Dependency & Licensing Audit for Commercial Web SaaS

| Software / Dataset Component | License Type | Commercial SaaS Implications & Vyom Architectural Decision |
| :--- | :--- | :--- |
| **[Swiss Ephemeris (`libswe` / `pyswisseph`)](https://www.astro.com/swisseph/swephinfo_e.htm)** | **Dual License**: **GNU AGPL-3.0** (Free) OR **[Swiss Ephemeris Professional License](https://roxyapi.com/blogs/swiss-ephemeris-agpl-licensing-saas)** (Paid commercial license from Astrodienst AG, ~CHF 700–750 one-time for 99 years). | **Critical Trap**: Running `pyswisseph` on a backend server accessed by users over a network (SaaS/Web App) under the free default triggers **AGPL-3.0 Section 13**, legally requiring open-sourcing the entire Vyom web application codebase. **Vyom Decision**: Either purchase the one-time Astrodienst Professional Edition commercial license before commercial deployment, OR use the **MIT-licensed Skyfield + NASA JPL DE440/DE441** stack below. |
| **[NASA JPL Development Ephemerides (`DE440` / `DE441`)](https://ssd.jpl.nasa.gov/doc/Park.2021.AJ.DE440.pdf)** | **Public Domain / CC-BY 4.0** (US Government work / Caltech JPL open access with attribution). | **100% Permissive for Commercial SaaS** with citation to Park et al. (2021), *The Astronomical Journal*, 161:105. |
| **[Skyfield (Brandon Rhodes)](https://rhodesmill.org/skyfield/planets.html)** & **IAU SOFA / ERFA (`pyerfa`)** | **MIT License** / **BSD-3-Clause** (ERFA). | **100% Permissive for Commercial SaaS**. Evaluates JPL `de440.bsp` Chebyshev polynomials in pure Python/NumPy to sub-milliarcsecond precision with zero AGPL contagion. |
| **[IANA Time Zone Database (`tzdb` / Python `zoneinfo`)](https://www.iana.org/time-zones)** | **Public Domain**. | **100% Permissive for Commercial SaaS**. Pin `tzdata` package version in every `VyomChartRecord` for reproducibility. |
| **Classical Text Translations & Modern Commentaries** | **Public Domain** (pre-1929 translations such as Burgess's *Surya Siddhanta*, Vijnananda's *Brihat Jataka*, Subrahmanya Sastri's *Phaladeepika*) vs. **Copyrighted Modern Translations** (Santhanam, G.C. Sharma, Riley's *Valens* [CC-BY-NC / open PDF]). | **Vyom Decision**: Store **abstracted mathematical rules, Sanskrit technical terms, and chapter/verse locators** (facts/ideas are not copyrightable), and quote verbatim only short scholarly excerpts or public-domain editions. Never ingest full copyrighted books into public redistribution. |

### 5.3 Eight-Phase Engineering Implementation Roadmap

| Phase | Milestone Title | Core Deliverables | Upstream Dependencies | Quantitative Acceptance Criteria | Unresolved Risks & Mitigations |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Phase 1** | **Verified Astronomical Calculation Core** | Time-zone normalizer (`tzdb`), $\Delta T$ interpolator, JPL DE440 / Swiss Ephemeris wrapper, Horizon Angle & Cusp engine. | None | Planetary longitudes within $\le 0.001^\circ$ ($3.6''$) and Ascendant/MC within $\le 0.01^\circ$ ($36''$) of JPL Horizons / Swiss Ephemeris across 50 test vectors (-500 CE to 2050 CE). | Pre-1970 local civil time ambiguity $\rightarrow$ mitigated by Workflow F dual-offset calculation. |
| **Phase 2** | **Core Vedic Chart Construction** | Ayanamsha module (Lahiri, True Chitrapaksha, KP, Raman), 27 Nakshatras & Padas, Shodashavarga ($D_1$–$D_{60}$), Panchanga, Arudha Padas. | Phase 1 | 100% exact sign agreement on all 16 Vargas and Nakshatra Padas against manual analytical derivations and *Jagannatha Hora* benchmarks. | Lineage variations in $D_2, D_3, D_{24}, D_{30}$ $\rightarrow$ expose explicit method flags in API. |
| **Phase 3** | **Machine-Readable Rule Repository & Knowledge Graph** | JSON Rule DSL engine, 250+ attributed Vedic & comparative rules, *Shadbala* & *Ashtakavarga* calculators, *Bhanga/Parihara* override links. | Phase 2 | 100% schema validation against `VyomRuleSchema`; zero unattributed rules; deterministic unit test coverage for every Yoga and Dosha cancellation. | False-positive yoga inflation $\rightarrow$ enforce orb, dignity, and Kendra cancellation predicates. |
| **Phase 4** | **Multi-Factor Interpretation Engine** | 10 Life-Domain synthesis engines, 5-stage Conflict-Reconciliation Calculus, Workflows A–F uncertainty perturbation engine. | Phase 2, Phase 3 | Automated perturbation sweep ($\pm \Delta t$) completes in $< 150\text{ ms}$; zero single-placement personality claims; full suppression of $D_{60}$ when $\Delta t > 1\text{ min}$. | Conflicting classical verses $\rightarrow$ preserve competing rules side-by-side with textual attribution. |
| **Phase 5** | **Dasha, Transit (*Gochara*) & Compatibility Engine** | 5-level Vimshottari, Ashtottari, Yogini, and Chara Dasha engines; Double-Transit & Kakshya timeline scanner; 36-point *Ashtakoota* + Parihara engine. | Phase 2, Phase 3 | Dasha balance and transition dates match analytical reference within $< 1\text{ second}$ for fixed year-length definitions (`365.2425d` and `360d`). | Year-length discrepancy across user expectations $\rightarrow$ display both or clearly label `365.2425d` default. |
| **Phase 6** | **Comparative Traditions (Western, Hellenistic, Chinese)** | Hellenistic Sect, Lots, Profections & Zodiacal Releasing; Western Progressions, Solar Arc & Horary; Chinese *BaZi* (24 *Jieqi*) & *Zi Wei Dou Shu* modules. | Phase 1 | Strict namespace isolation; zero cross-contamination between Tropical and Sidereal modules; exact *Lichun* ($315^\circ\;\odot$) solar-term root finding for BaZi. | Luni-solar leap month splits in *Zi Wei Dou Shu* $\rightarrow$ support both split-15th and next-month conventions. |
| **Phase 7** | **AI Retrieval, Question Router & Grounded NLG** | 14-category Question Router, RAG over Knowledge Graph, Grounded Prompt Templates, Epistemic Tier tagging, Safety Guardrail Filter. | Phases 3–6 | Zero hallucinated planetary positions or fake Sanskrit citations in 1,000 red-team prompts; 100% refusal compliance on medical/fatalistic/curse queries. | LLM sycophancy when users ask leading questions ("Confirm my marriage is doomed") $\rightarrow$ enforce deterministic system prompt overrides. |
| **Phase 8** | **Validation, Privacy Hardening & Production Deployment** | Ephemeral chart calculation mode, field-level encryption at rest, CI regression suite, observability & citation audit dashboard. | Phases 1–7 | Sub-500ms API latency for full chart + Dasha + rule evaluation; GDPR/DPDP compliance with zero retention Option for guest calculations. | Third-party LLM logging of birth data $\rightarrow$ strip PII (`name`, exact address) before sending structured `ChartFrame` to LLM layer. |
