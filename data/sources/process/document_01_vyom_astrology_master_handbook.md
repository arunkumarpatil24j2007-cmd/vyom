# DOCUMENT 01 — VYOM ASTROLOGY MASTER HANDBOOK

## 1. Epistemological Architecture and Three-Tier Separation

The Vyom AI astrology knowledge, calculation, interpretation, and prediction repository is engineered around a strict epistemological partition. Any computational system that processes human birth data and outputs interpretive narratives must maintain an explicit boundary between physical reality, historical textual doctrine, and empirical verification. Across all modules, schemas, rule engines, and natural-language generation layers in Vyom, every statement, variable, and inference is classified into one of three non-overlapping tiers:

| Epistemological Tier | Formal Definition | Verification Mechanism | Example in Vyom |
| :--- | :--- | :--- | :--- |
| **Tier 1: Astronomical & Mathematical Facts** | Quantities of positional astronomy, spherical trigonometry, time-scale conversion, and calendar arithmetic that describe the physical geometry of the solar system and Earth's rotation. | Independently reproducible via [NASA JPL Development Ephemerides DE440/DE441](https://ssd.jpl.nasa.gov/doc/de440_de441.html), [Swiss Ephemeris](https://www.astro.com/swisseph/swephinfo_e.htm), and [Jean Meeus's Astronomical Algorithms](https://auass.com/wp-content/uploads/2021/01/Astronomical-Algorithms.pdf). | On 2000-01-01 at 06:30:00 UTC, the geocentric apparent tropical ecliptic longitude of the Sun is $280^\circ 08' 23.03''$ (Capricorn $10^\circ 08' 23.03''$), and the Greenwich Mean Sidereal Time is $274.943741^\circ$ for New Delhi ($77.2090^\circ\text{E}$). |
| **Tier 2: Traditional Astrological Doctrines & Symbolic Rules** | Historical, cultural, and textual conventions that map Tier 1 astronomical coordinates onto symbolic zodiac signs, houses, planetary dignities, yogas, and dasha periods. | Traceable to specific chapters and verses of primary classical texts such as [Brihat Parashara Hora Shastra (R. Santhanam translation)](https://archive.org/download/BPHSEnglish/BPHS%20-%201%20RSanthanam.pdf), [Brihat Jataka of Varahamihira](https://archive.org/details/brihatjataka00varaiala), [Ptolemy's Tetrabiblos](https://raw.githubusercontent.com/janegca/latex-valens/main/Valens-Anthologies-Annotated.pdf), or [Vettius Valens's Anthology](https://www.goodreads.com/book/show/63102476-the-anthology). | In Parashari Jyotisha ([BPHS Ch. 3, v. 49–50](https://archive.org/download/BPHSEnglish/BPHS%20-%201%20RSanthanam.pdf)), Surya (Sun) attains deep exaltation (*Paramuccha*) at $10^\circ$ Mesha (Aries) and debilitation (*Paramanicha*) at $10^\circ$ Tula (Libra). |
| **Tier 3: Empirical Claims & Statistical Evaluation** | Testable hypotheses asserting that Tier 2 symbolic configurations correlate with measurable human personality traits, life events, or future outcomes above chance expectations. | Evaluated via double-blind controlled trials, large-sample biometric studies, and psychometric meta-analyses such as [Shawn Carlson's 1985 Nature study](https://scispace.com/pdf/a-double-blind-test-of-astrology-1lfssa2u99.pdf), [Dean & Kelly (2003)](https://journalpsyche.org/articles/0xc062.pdf), [Hartmann, Reuter & Nyborg (2006)](https://helmuthnyborg.dk/wp-content/uploads/2016/07/Publ_2006_Date-of-birth.pdf), and [Greenberg et al. (2024)](https://www.realityslaststand.com/p/does-astrology-work-we-put-152-astrologers). | Controlled empirical studies consistently show that natal chart matching and sun-sign personality predictions perform at chance levels ($p > 0.05$, effect size $r \approx 0.00$), while perceived accuracy in unblinded settings is driven by the [Barnum/Forer effect](https://en.wikipedia.org/wiki/Barnum_effect) and subjective validation. |

Vyom never conflates Tier 1 precision with Tier 3 validity. The fact that a planet's topocentric position or a Vimshottari Dasha boundary can be computed to sub-arcsecond or sub-second precision does not imply that the traditional interpretive rule attached to that position has been scientifically validated as a causal law of human destiny. Conversely, Vyom treats Tier 2 doctrines with rigorous philological and algorithmic fidelity—preserving exact classical definitions, lineage disagreements, and mathematical conditions without distorting them into generic pop-horoscope platitudes.

---

## 2. Historical Development and Cross-Cultural Transmission of Astrology

Understanding how astrological traditions diverged and cross-pollinated is essential for designing a multi-tradition AI architecture that avoids silently merging incompatible rules. As documented by historian of exact sciences David Pingree in [*From Astral Omens to Astrology: From Babylon to Bikaner*](https://www.scribd.com/document/494154856/From-Astral-Omens-to-Astrology-From-Babylon-to-Bikaner-David-Pingree), computational and horoscopic astrology evolved through five major historical epochs:

### 2.1 Mesopotamian Astral Omens and Mathematical Astronomy (c. 1800 BCE – 300 BCE)
1. **Enuma Anu Enlil (2nd Millennium BCE)**: Compiled in Babylon and Assyria, this corpus of 68 to 70 cuneiform tablets recorded celestial omens—lunar eclipses, heliacal risings of Venus (Tablet 63, the *Venus Tablet of Ammisaduqa*), and planetary conjunctions—interpreted as state-level portents for the king and harvest rather than individual natal destinies.
2. **The Twelve-Sign Ecliptic Zodiac (5th Century BCE)**: Around 450–400 BCE, Babylonian astronomer-scribes (*ṭupšar Enuma Anu Enlil*) replaced unequal constellational reference stars (*Normalsterne*) with a uniform mathematical coordinate system dividing the ecliptic into 12 equal $30^\circ$ segments (*lu-maš*), anchored sidereally so that Aldebaran ($\alpha$ Tauri) and Antares ($\alpha$ Scorpii) stood near $15^\circ$ Taurus and $15^\circ$ Scorpio.
3. **Proto-Horoscopes (410 BCE)**: The oldest surviving cuneiform natal horoscope dates to April 29, 410 BCE. These Babylonian proto-horoscopes recorded planetary sign placements at birth using step-function arithmetic ephemerides (System A and System B) but lacked the Ascendant (*Horoskopos*) and twelve-house division.

### 2.2 Greco-Egyptian Synthesis and Hellenistic Horoscopy (c. 150 BCE – 600 CE)
1. **Alexandrian Fusion**: Following Alexander the Great's conquests, Babylonian mathematical astronomy and zodiacal divisions merged in Ptolemaic Egypt with Egyptian decanal star clocks (36 *decans* of $10^\circ$ each) and Greek geometric models of the celestial sphere.
2. **Foundational Texts**: Texts attributed to Nechepso and Petosiris (c. 150–100 BCE) introduced the four cardinal angles—the degree of the ecliptic rising on the eastern horizon (*Horoskopos* / Ascendant), setting (*Dysis*), culminating (*Mesouranema* / Midheaven), and anti-culminating (*Hypogeion*)—alongside the 12 Whole Sign houses (*topoi*), planetary sect (*hairesis*), and Hermetic Lots (*kleroi*).
3. **Divergence within Hellenistic Practice**: By the 2nd century CE, two distinct methodologies coexisted in Alexandria:
   - **Claudius Ptolemy** ([*Tetrabiblos*](https://raw.githubusercontent.com/janegca/latex-valens/main/Valens-Anthologies-Annotated.pdf), c. 150 CE) reframed astrology through Aristotelian natural philosophy (hot, cold, wet, dry), formally defining the **Tropical Zodiac** anchored to the vernal equinox ($0^\circ$ Aries) after Hipparchus's discovery of axial precession (c. 127 BCE).
   - **Vettius Valens** ([*Anthologies*](https://www.goodreads.com/book/show/63102476-the-anthology), c. 150–175 CE) and **Dorotheus of Sidon** (*Carmen Astrologicum*, c. 75 CE) preserved practical Hellenistic horoscopy, including Whole Sign houses, annual profections, time-lord systems (*chronocrators* such as Zodiacal Releasing from the Lot of Fortune and Spirit), and over 120 worked historical birth charts.

### 2.3 Indian Jyotisha: Vedanga Jyotisha, Indo-Greek Exchange, and Classical Siddhantas
1. **Vedanga Jyotisha (c. 1400–400 BCE)**: Attributed to Lagadha, indigenous Vedic astral science focused on the **27 (or 28) Nakshatras** (lunar mansions of $13^\circ 20'$), the 5-year luni-solar *yuga* cycle, *tithis* (lunar days), and *muhurta* (sacrificial timing) rather than planetary horoscopy.
2. **Indo-Greek Transmission (*Yavanajataka*, 149/150 CE & 269/270 CE)**: As demonstrated by [David Pingree's critical edition of Sphujidhvaja's *Yavanajataka*](https://en.wikipedia.org/wiki/Yavanajataka), an Alexandrian Greek horoscopic treatise was translated into Sanskrit prose by Yavanesvara in 149/150 CE in Western Kshatrapa territory (Ujjain/Gujarat) and versified by Sphujidhvaja in 269/270 CE. Sanskrit technical terms in classical Jyotisha preserve loanwords from Greek horoscopy (*Kendra* from $\kappa\acute{\varepsilon}\nu\tau\rho\omicron\nu$, *Panaphara* from $\dot{\varepsilon}\pi\alpha\nu\alpha\phi\omicron\rho\alpha$, *Apoklima* from $\dot{\alpha}\pi\acute{\omicron}\kappa\lambda\iota\mu\alpha$, *Drekkana* from $\delta\varepsilon\kappa\alpha\nu\acute{\omicron}\varsigma$, *Liptā* from $\lambda\varepsilon\pi\tau\acute{\omicron}\nu$).
3. **Siddhantic Astronomy and Classical Hora**: Indian astronomers (**Aryabhata** in the [*Aryabhatiya* (499 CE)](https://en.wikisource.org/wiki/%C4%80ryabha%E1%B9%AD%C4%ABya_of_%C4%80ryabha%E1%B9%ADa), **Varahamihira** in the *Panchasiddhantika* and [*Brihat Jataka* (6th century CE)](https://archive.org/details/brihatjataka00varaiala), and the [*Surya Siddhanta*](https://ia801405.us.archive.org/13/items/AryabhatiyaWithEnglishCommentary/Aryabhatiya-with-English-commentary_text.pdf)) integrated trigonometrical planetary models (using *jya* / sine tables) with indigenous Vedic Nakshatra metaphysics, Karma theory, the **Shodashavarga** (16 divisional charts), **Ashtakavarga**, and Nakshatra-based **Dasha** systems—culminating in the encyclopedic synthesis of [**Brihat Parashara Hora Shastra** (BPHS)](https://archive.org/download/BPHSEnglish/BPHS%20-%201%20RSanthanam.pdf), **Kalyana Varma's** [*Saravali*](https://archive.org/details/saravali00kalyuoft), **Mantreswara's** [*Phaladeepika*](https://archive.org/details/in.gov.ignca.6945), and **Vaidyanatha Dikshita's** [*Jataka Parijata*](https://www.astrokarak.com/jyotish-books/book/jataka-parijata).

### 2.4 Sasanian Persian, Medieval Islamic, and Tajika Return Transmission (c. 500 CE – 1700 CE)
1. **Baghdad Synthesis (8th–11th Centuries CE)**: Scholars such as Masha'allah, Sahl ibn Bishr, **Abu Ma'shar al-Balkhi** (*The Great Introduction to Astrology*), and **Al-Biruni** ([*The Book of Instruction in the Elements of the Art of Astrology*](https://www.renaissanceastrology.com/albiruni.html), 1029 CE) synthesized Greek, Pahlavi (Sasanian Persian), and Sanskrit *Siddhanta* texts. They formalized complex **Horary rules** (perfection via *Ittisal* / applying aspect, translation and collection of light, prohibition, frustration), **Mundane Jupiter-Saturn conjunction cycles**, and mathematical quadrant house systems (Alcabitius).
2. **Tajika Shastra in India (13th–16th Centuries CE)**: Medieval Perso-Arabic solar return (*Tahwil al-Sini*) and aspect rules returned to India via Sanskrit translations (hence *Tajika*, meaning Persian/Arabic), codified by **Neelakantha Daivajna** in [*Tajika Nilakanthi* (1587 CE)](https://archive.org/details/tajika_nilakanthi). Tajika introduced orb-based longitudinal aspects and the 16 *Tajika Yogas* (*Ikabala*, *Induvara*, *Ithasala*, *Ishrafa*, *Nakta*, *Yamaya*, *Kamboola*, *Radda*, etc.) specifically for annual solar return (*Varshaphala*) and Prashna charts.
3. **European Renaissance to Modern Western**: Latin translations of Arabic texts fueled European Renaissance astrology, culminating in **William Lilly's** [*Christian Astrology* (1647)](https://www.renaissanceastrology.com/albiruni.html). After declining during the 18th-century Enlightenment, Western astrology was revived in the late 19th and 20th centuries through Theosophy (Alan Leo) and Jungian depth psychology (Dane Rudhyar, Liz Greene), shifting emphasis from deterministic event prediction to psychological archetypes before the late-20th-century scholarly recovery of Hellenistic and Medieval texts (Project Hindsight, [Mark Riley's translation of Vettius Valens](https://www.goodreads.com/book/show/63102476-the-anthology), and [Chris Brennan](https://www.goodreads.com/book/show/63102476-the-anthology)).

### 2.5 Chinese Sexagenary and Asterism Traditions (BaZi & Zi Wei Dou Shu)
Developing largely independently in East Asia around the **Sexagenary Cycle (*Ganzhi*)** of 10 Heavenly Stems (*Tiangan*) and 12 Earthly Branches (*Dizhi*) plus Five-Phase (*Wuxing*: Wood, Fire, Earth, Metal, Water) cosmology:
- **Four Pillars of Destiny ([BaZi / 八字](https://en.wikipedia.org/wiki/Four_Pillars_of_Destiny))**: Formalized by Xu Ziping (Song Dynasty) and Wan Minying (*San Ming Tong Hui*, Ming Dynasty), BaZi constructs four stem-branch pillars for the Solar Year, Solar Month (governed by the 24 Solar Terms / *Jieqi* at $15^\circ$ tropical solar longitude intervals), Sexagenary Day, and Double-Hour, analyzing the strength and seasonal balance of the **Day Master (*Ri Zhu*)**.
- **Purple Star Astrology ([Zi Wei Dou Shu / 紫微斗數](https://fortunecloud.co/en/bazi-calculator))**: Attributed to Chen Tuan (Song Dynasty), Zi Wei Dou Shu uses the Chinese luni-solar calendar (lunar month, lunar day, birth double-hour, and year stem/branch) to place over 100 symbolic stars (led by the Emperor star *Zi Wei*) across 12 Palaces (*Ming Gong*, *Fu Qi Gong*, *Guan Lu Gong*, etc.) and applies the **Four Transformations (*Si Hua*: *Hua Lu*, *Hua Quan*, *Hua Ke*, *Hua Ji*)** across decadal and annual periods.

---

## 3. Complete 13-Stage Vyom Execution Pipeline

To answer the core research question—*how an AI system goes from birth date, birth time, and birthplace to a calculated chart, systematic interpretation, and calibrated life-domain or timing reading*—Vyom enforces a deterministic 13-stage data pipeline. Every stage consumes a strongly typed input contract, executes explicit mathematical or logical operations, logs provenance, and emits a validated output structure.

```
[Stage 01: User Input Acquisition]
       │
       ▼
[Stage 02: Birth Data Validation & Uncertainty Classification]
       │
       ▼
[Stage 03: Civil Time, IANA Time-Zone & Geodetic Normalization]
       │
       ▼
[Stage 04: Astronomical Ephemeris & Coordinate Calculation (Tier 1)]
       │
       ▼
[Stage 05: Horizon Angles, House Cusps & Zodiacal Frame Construction]
       │
       ▼
[Stage 06: Tradition-Specific Feature Extraction (Vargas, Nakshatras, Dignities, Lots)]
       │
       ▼
[Stage 07: Deterministic Rule Engine Evaluation (Yogas, Doshas, Aspects, Strengths)]
       │
       ▼
[Stage 08: Multi-Factor Chart Synthesis & Conflict Reconciliation]
       │
       ▼
[Stage 09: Life-Domain Specific Interpretation Engine]
       │
       ▼
[Stage 10: Temporal & Predictive Engine (Dashas, Gochara, Profections, Returns)]
       │
       ▼
[Stage 11: Epistemic Confidence, Sensitivity & Limitations Audit]
       │
       ▼
[Stage 12: Calibrated Natural-Language Generation & Safety Filtering]
       │
       ▼
[Stage 13: Source Traceability & Knowledge Graph Provenance Attachment]
```

### Stage-by-Stage Engineering Specification (10-Point Protocol)

For each of the 13 pipeline stages, the table and detailed breakdown below document all 10 required operational dimensions: (1) Required Information, (2) Source of Information, (3) Calculations Performed, (4) Rules Applied, (5) Traditional Rationale, (6) Co-Considered Factors, (7) Conflict Reconciliation, (8) Generated Output, (9) AI/Software Implementation, and (10) Limitations & Failure Modes.

#### Stage 01 & Stage 02: User Input Acquisition & Birth Data Validation
1. **Required Information**: Birth date ($Y, M, D$), calendar flag (`gregorian` | `julian` | `lunisolar`), birth time ($hh:mm:ss$), birth-time precision tag (`exact_recorded` | `rounded_15m` | `estimated_window` | `unknown`), birthplace string, optional coordinates ($\phi, \lambda$), target tradition (`vedic_parashari` | `vedic_kp` | `vedic_jaimini` | `western_tropical_modern` | `hellenistic_wholesign` | `bazi` | `zi_wei_dou_shu`), and user question.
2. **Source of Information**: User input form, birth certificate metadata, hospital log, or conversational prompt.
3. **Calculations Performed**: Calendar date validity check (leap-year rules: $Y \bmod 4 = 0 \land (Y \bmod 100 \neq 0 \lor Y \bmod 400 = 0)$ for Gregorian), coordinate range check ($\phi \in [-90^\circ, +90^\circ]$, $\lambda \in [-180^\circ, +180^\circ]$), and time-uncertainty propagation radius $\pm \Delta t$ (in minutes).
4. **Rules Applied**: Workflow routing rule (Section 4 below) assigning Workflow A, B, C, D, E, or F based on $\Delta t$ and boundary proximity.
5. **Traditional Rationale**: In Jyotisha and Western horoscopy, the birth moment (*Jatakala*) represents the first independent breath or severance of the umbilical cord (*BPHS* Ch. 4), which anchors the rising degree (*Lagna*) to the local horizon.
6. **Co-Considered Factors**: Whether local civil midnight vs. traditional sunrise day-boundary (*Vara*) applies to the user's stated birth date.
7. **Conflict Reconciliation**: If a user states "born on Tuesday night at 1:30 AM", flag the midnight ambiguity (civil Wednesday 01:30 vs. Hindu *Mangalavara* after midnight before Wednesday sunrise) and request confirmation before finalizing the date.
8. **Generated Output**: `ValidatedBirthRequest` JSON object with explicit `uncertainty_window_minutes` and `workflow_mode`.
9. **AI/Software Implementation**: Deterministic schema validator (Pydantic / JSON Schema Draft 2020-12) coupled with an LLM intent parser that triggers clarifying questions whenever `place_of_birth` or `date_of_birth` is missing or ambiguous.
10. **Limitations & Failure Modes**: Hospital recorded times are frequently rounded to the nearest 5, 10, or 15 minutes; treating a rounded time as exact to the second invalidates high-order divisional charts ($D_{60}$ shifts every $\sim 2$ minutes).

#### Stage 03: Civil Time, IANA Time-Zone & Geodetic Normalization
1. **Required Information**: Validated local date/time, birthplace name or $(\phi, \lambda)$, country/region code.
2. **Source of Information**: Geodetic gazetteer (GeoNames / OpenStreetMap) and the [IANA Time Zone Database (`tzdb`)](https://www.iana.org/time-zones/theory).
3. **Calculations Performed**:
   - Local Civil Time $\rightarrow$ UTC via historical offset $\Delta_{\text{TZ}}$ and Daylight Saving offset $\Delta_{\text{DST}}$:
     $$\text{UTC} = t_{\text{local}} - (\Delta_{\text{TZ}} + \Delta_{\text{DST}})$$
   - Continuous Julian Day ($\text{JD}_{\text{UT}}$) via [Meeus Chapter 7](https://auass.com/wp-content/uploads/2021/01/Astronomical-Algorithms.pdf).
   - Terrestrial Time conversion:
     $$\text{JD}_{\text{TT}} = \text{JD}_{\text{UT}} + \frac{\Delta T}{86400}$$
     where $\Delta T = \text{TT} - \text{UT1}$ is interpolated from IERS Earth orientation tables and polynomial approximations.
4. **Rules Applied**: Fold/Gap detection during DST transitions (`fold=0` vs `fold=1` for repeated fall-back hours; `NonExistentTimeError` for spring-forward skipped hours).
5. **Traditional Rationale**: Prior to standard railway time zones (late 19th century), astrologers used Local Mean Time ($\text{LMT} = \text{UT} + \lambda / 15^\circ$) or Local Apparent Solar Time (*Ishta Kala* in *Ghatis* and *Palas* after local sunrise).
6. **Co-Considered Factors**: Historical war time (e.g., British Double Summer Time, US War Time 1942–1945, Indian Bengal/Bombay time variations prior to 1955).
7. **Conflict Reconciliation**: As documented in the [IANA `tzdb` Theory and Pragmatics guide](https://www.iana.org/time-zones/theory), pre-1970 time-zone records in many sub-regions are incomplete. When a birth occurs prior to 1970 in a region with disputed DST history, Vyom computes both the standard-offset chart and the alternate-offset chart and flags if the Ascendant changes sign.
8. **Generated Output**: `NormalizedTimeLocation` containing `utc_iso`, `jd_ut`, `jd_tt`, `delta_t_seconds`, `iana_tz_id`, and `tz_confidence`.
9. **AI/Software Implementation**: Deterministic Python `zoneinfo` + IERS $\Delta T$ lookup table. Never allow an LLM to calculate UTC offsets or Julian Days via token prediction.
10. **Limitations & Failure Modes**: Unrecorded municipal clock deviations prior to 1970; births aboard ships or aircraft requiring manual coordinate entry.

#### Stage 04 & Stage 05: Astronomical Ephemeris & Chart Construction
1. **Required Information**: `jd_ut`, `jd_tt`, geodetic $(\phi, \lambda, h)$, selected zodiac (`tropical` | `sidereal`), selected `ayanamsha_id`, and `house_system_id`.
2. **Source of Information**: [NASA JPL DE440/DE441](https://ssd.jpl.nasa.gov/doc/de440_de441.html) (via MIT-licensed [Skyfield](https://rhodesmill.org/skyfield/planets.html) or custom Chebyshev evaluator) or [Swiss Ephemeris](https://www.astro.com/swisseph/swephinfo_e.htm) (under commercial license).
3. **Calculations Performed**:
   - Barycentric ICRS position/velocity $\rightarrow$ Geocentric astrometric $\rightarrow$ Light-time aberration & gravitational deflection $\rightarrow$ Frame rotation to true equator and equinox of date ($\varepsilon_0 + \Delta\varepsilon$, $\Delta\psi$) $\rightarrow$ Apparent tropical ecliptic longitude $\lambda_{\text{trop}}$, latitude $\beta$, distance $R$, and longitudinal speed $\dot{\lambda}$.
   - Sidereal reduction: $\lambda_{\text{sid}} = (\lambda_{\text{trop}} - A(t)) \bmod 360^\circ$.
   - Local Sidereal Time ($\text{LST}$), Ascendant ($\lambda_{\text{Asc}}$), Midheaven ($\lambda_{\text{MC}}$), and 12 house cusps.
4. **Rules Applied**: Station/retrograde classification ($\dot{\lambda} < 0$ is retrograde; $|\dot{\lambda}| < \epsilon_{\text{station}}$ is stationary) and house membership assignment.
5. **Traditional Rationale**: Apparent geocentric positions represent the sky as observed from Earth's reference frame, including light-time delay and annual aberration (*Spashta Graha*).
6. **Co-Considered Factors**: True vs. Mean Lunar Nodes (Rahu/Ketu); Geocentric vs. Topocentric Moon (parallax reaches up to $\sim 1^\circ$).
7. **Conflict Reconciliation**: Classical Siddhantas compute geocentric *Drig-ganita* positions; KP astrology strongly prefers True or Mean nodes consistently per lineage. Vyom computes and stores both `mean_node` and `true_node` in the chart object so downstream rules can query either explicitly.
8. **Generated Output**: Tier 1 `AstronomicalState` and `ChartFrame` JSON objects.
9. **AI/Software Implementation**: Deterministic numerical C/Rust/Python ephemeris microservice.
10. **Limitations & Failure Modes**: Quadrant house systems (Placidus, Koch) mathematically fail inside the Arctic/Antarctic circles ($|\phi| > 90^\circ - \varepsilon \approx 66.56^\circ$) because certain ecliptic degrees become circumpolar and never intersect the horizon; Vyom automatically falls back to Whole Sign or Porphyry with an explicit warning.

#### Stage 06 to Stage 13: Feature Extraction, Rule Engine, Synthesis, Timing, and NLG
Stages 06 through 13 transform the geometric `ChartFrame` into tradition-specific features (Shodashavarga $D_1$–$D_{60}$, 27 Nakshatras & Padas, Panchanga, Shadbala, Ashtakavarga, Western dignities, Lots, or BaZi pillars), evaluate formal machine-readable predicates (`DOCUMENT_06`), synthesize life-domain interpretations (`DOCUMENT_05`), compute multi-layered timing windows (Vimshottari Dasha + Gochara + Ashtakavarga or Profections + Transits), run a sensitivity perturbation pass ($\pm \Delta t$) to audit boundary fragility, and generate a cited, safety-checked natural-language response (`DOCUMENT_10`).

---

## 4. Six Operational Workflows for Birth-Time Uncertainty

A critical failure of commercial astrology apps is silently defaulting an unknown birth time to `12:00:00 PM` and presenting the resulting Ascendant, house placements, and Navamsha ($D_9$) as factual. Because the ecliptic rises at an average rate of $1^\circ$ every 4 minutes ($30^\circ$ every 2 hours), an unknown time leaves the Ascendant completely undetermined across all 12 signs. Vyom implements six distinct operational workflows:

| Workflow ID | Trigger Condition | Permitted Calculations & Interpretations | Suppressed / Prohibited Outputs | User Disclosure Protocol |
| :--- | :--- | :--- | :--- | :--- |
| **Workflow A: Exact Recorded Time** | Hospital record, birth certificate, or timed log with $\Delta t \le \pm 1\text{ min}$ and Ascendant $> 0.5^\circ$ from sign/varga boundary. | Full pipeline: Lagna, all 12 Bhavas, $D_1$ through $D_{60}$, Shadbala, Ashtakavarga, Vimshottari Dasha to Pratyantardasha level. | None (subject to sensitivity audit on $D_{60}$ if $\Delta t > 30\text{s}$). | State exact UTC, coordinates, Ayanamsha, and house system used. |
| **Workflow B: Approximate / Rounded Time** | User reports time rounded to 15/30/60 min or "around 10 AM" ($\Delta t \in [\pm 5\text{ min}, \pm 60\text{ min}]$). | Perturbation sweep across $[t_0 - \Delta t, t_0 + \Delta t]$ at 1-minute steps. Report stable features; present conditional branches if Lagna or $D_9$ crosses a boundary. | Suppress $D_{16}$–$D_{60}$ and Pratyantardasha/Sookshma dates; prohibit single-sign Lagna claims if boundary is crossed. | Explicitly display the stability percentage across the time window (e.g., "Across 09:45–10:15, Lagna is Mesha for 18 min and Vrishabha for 12 min"). |
| **Workflow C: Unknown Birth Time** | User does not know birth time ($\Delta t = \pm 12\text{ hours}$). | Compute planetary positions at 00:00 UT and 24:00 UT. Use **Chandra Lagna** (Moon sign, if Moon does not change sign that day) and **Surya Lagna** (Sun sign), planetary sign placements, and planet-to-planet aspects. | **Strictly suppress**: Ascendant (Udaya Lagna), natal house cusps, house lordships from Lagna, all Divisional Charts ($D_2$–$D_{60}$) of Lagna, and exact Dasha start dates (show 24-hour range). | Clearly state that Lagna and house cusps cannot be calculated without a birth time, and explain that the reading is anchored to Chandra Lagna / Surya Lagna. |
| **Workflow D: Conflicting Birth Records** | Two distinct candidate times exist (e.g., hospital wristband `08:15` vs. family diary `08:50`). | Generate parallel `ChartFrame_1` and `ChartFrame_2`; run diff engine to isolate invariant features vs. divergent features (e.g., $D_9$ Lagna shift). | Do not arbitrarily pick one record or average the two times. | Present a side-by-side comparison of shared indicators vs. time-dependent divergences. |
| **Workflow E: Birth Near Midnight** | Birth time falls between `00:00` and `04:00` local time. | Check for civil date vs. traditional sunrise date (*Vara*) confusion. Compute candidate charts for both Day $D$ at `00:xx` and Day $D+1$ at `00:xx`. | Do not proceed with long-range life predictions until the civil calendar date is disambiguated if the user used conversational phrasing ("Monday night at 1 AM"). | Ask a targeted confirmation question ("By 'Monday night at 1:15 AM', do you mean early Tuesday morning on the civil calendar, or early Monday morning?"). |
| **Workflow F: Birth Near TZ / DST Transition** | Birth occurs on a date/hour of a DST spring-forward gap, fall-back fold, or historical standard-time shift. | Query `tzdb` transition table. For fall-back folds (repeated hour), compute both `fold=0` (DST) and `fold=1` (Standard) charts (1 hour apart). | Never silently default to `fold=0` without flagging the 1-hour ambiguity (~$15^\circ$ Ascendant shift). | Explain that clocks were turned back during that hour and present both the Daylight Time and Standard Time chart possibilities. |

---

## 5. Master Comparison of Astrological Frameworks

To prevent cross-tradition contamination, Vyom models each astrological tradition as an isolated rule namespace operating over the shared astronomical layer:

| Dimension | Vedic Parashari (*Jyotisha*) | Vedic KP (*Krishnamurti Paddhati*) | Vedic Jaimini (*Upadesha Sutras*) | Hellenistic (*Valens / Dorotheus*) | Modern Western (*Psychological*) | Chinese Four Pillars (*BaZi*) | Chinese *Zi Wei Dou Shu* |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Zodiac Framework** | Sidereal (*Nirayana*) | Sidereal (*Nirayana*) | Sidereal (*Nirayana*) | Tropical (or Sidereal in early texts) | Tropical (*Sayana*) | Solar-Term Tropical (24 *Jieqi*) | Luni-Solar Calendar |
| **Default Ayanamsha** | Lahiri (Chitrapaksha) | KP Ayanamsha (New/Old) | Lahiri / Pushya-paksha | N/A (0° Aries = Vernal Equinox) | N/A (0° Aries = Vernal Equinox) | N/A ($315^\circ$ Sun = *Lichun* start) | N/A (Lunar month/day) |
| **Primary House System** | Whole Sign (*Rashi = Bhava*) or Sripati (*Bhava Chalita*) | Placidus Quadrant Cusps | Whole Sign + *Arudha Padas* | Whole Sign (*Topoi*) | Placidus, Koch, or Equal | Four Pillars (Year, Month, Day, Hour) | 12 Palaces (*Shier Gong*) |
| **Core Planetary Set** | 9 *Navagrahas* (Sun–Saturn + Rahu, Ketu) | 9 *Navagrahas* (Star Lord & Sub-Lord hierarchy) | 7–8 *Chara Karakas* (Atmakaraka to Darakaraka) | 7 Classical Planets (Sun–Saturn) + Lots | 10 Bodies (Sun–Pluto) + Chiron/Asteroids | 10 Heavenly Stems & 12 Earthly Branches | 14 Major Stars (*Zi Wei*, *Tian Fu*, etc.) + ~100 Minor Stars |
| **Aspect Doctrine** | *Graha Drishti* (Sign/degree based; special aspects for Mars 4/8, Jup 5/9, Sat 3/10) | Western-style longitudinal aspects to cusps | *Rashi Drishti* (Movable $\leftrightarrow$ Fixed except adjacent; Dual $\leftrightarrow$ Dual) | Sign-based & degree-based Ptolemaic ($0^\circ, 60^\circ, 90^\circ, 120^\circ, 180^\circ$) | Orb-based harmonic aspects ($0^\circ, 60^\circ, 90^\circ, 120^\circ, 180^\circ, 150^\circ, 30^\circ$) | Branch Combinations (*He*), Clashes (*Chong*), Harm, Punishment | Trine Palace Quartet (*San Fang Si Zheng*) |
| **Divisional / Harmonic Charts** | *Shodashavarga* ($D_1$ to $D_{60}$, especially $D_9$ Navamsha & $D_{10}$ Dashamsha) | 249 Sub-divisions (based on Vimshottari proportions inside Nakshatras) | Karakamsha ($D_9$ of Atmakaraka) & Swamsha | Dodekatemoria (12th-parts) & Bounds (*Horai*) | Harmonics (4th, 5th, 7th, 9th) & Midpoints (*Cosmobiology*) | Hidden Stems (*Cang Gan*) inside Earthly Branches | Natal, Decadal (*Da Xian*), & Annual (*Liu Nian*) Palace Overlays |
| **Primary Timing Engine** | *Vimshottari Dasha* (120-yr) + *Gochara* (Transits from Moon/Lagna) + *Ashtakavarga* | Vimshottari Dasha + Ruling Planets (*RP*) + Transit over Sub-Lords | *Chara Dasha*, *Narayana Dasha*, *Sthira Dasha* (Sign-based Rashi Dashas) | Annual Profections, *Zodiacal Releasing*, Decennials, Solar Returns | Outer-Planet Transits, Secondary Progressions ($1\text{d}=1\text{yr}$), Solar Arc | 10-Year Luck Pillars (*Da Yun*) & Annual Pillars (*Liu Nian*) | 10-Year Major Limits (*Da Xian*) & Four Transformations (*Si Hua*) |
