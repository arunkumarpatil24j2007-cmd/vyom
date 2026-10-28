# DOCUMENT 08 — WORKED EXAMPLES AND TEST SUITE

## 1. Fifteen End-to-End Worked Case Studies (Section 19)

Every worked case study below is explicitly labeled as a **Synthetic Verified Benchmark Case** (computed deterministically via `vyom_calc_engine.py` in the VM sandbox) so that no real individual's private birth data is fabricated or exposed. Each case demonstrates all 11 required pipeline fields: Input Data, Normalization, Calculation Settings, Intermediate Math, Resulting Chart Data, Applicable Rules, Source References, Synthesis, Contradictory Indicators, Uncertainty Metadata, and Final Calibrated Response.

---

### Case Study 01 & Case Study 02: Complete Natal Calculation & Tropical vs. Sidereal Comparison
- **1. Input Data**: `[SYNTHETIC BENCHMARK CASE #01]` — Date: `2000-01-01`, Local Time: `12:00:00 IST` (`exact_recorded`, $\Delta t = \pm 0.5\text{ min}$), Place: `New Delhi, India` ($\phi = 28.6139^\circ\text{N}$, $\lambda = 77.2090^\circ\text{E}$).
- **2. Data Normalization**: IANA Timezone = `Asia/Kolkata` ($\text{UTC}+05:30$, no DST). Normalized UTC = `2000-01-01T06:30:00Z`.
- **3. Calculation Settings**: Ephemeris = Meeus/DE440 Analytical Reference; $\Delta T = 63.860\text{ s}$; House System = Whole Sign; Sidereal Ayanamsha = **Lahiri (Chitrapaksha)** ($23^\circ 51' 25.50''$).
- **4. Intermediate Astronomical Calculations (Tier 1)**:
  - $\text{JD}_{\text{UT}} = 2451544.77083333$, $\text{JD}_{\text{TT}} = 2451544.77157245$.
  - Mean Obliquity $\varepsilon_0 = 23.439291^\circ$ ($23^\circ 26' 21.45''$).
  - $\text{GMST} = 197.734741^\circ$, $\text{LST (RAMC)} = 274.943741^\circ$.
- **5. Resulting Chart Data (Tropical vs. Sidereal Comparison)**:

| Celestial Point / Body | Tropical Longitude (*Sayana*) | Tropical Sign & Whole Sign House | Sidereal Longitude (*Nirayana* Lahiri) | Sidereal Rashi & Whole Sign Bhava | Nakshatra, Pada & Lord | Navamsha ($D_9$) Sign | Dashamsha ($D_{10}$) Sign |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Ascendant (*Lagna*)** | $007^\circ 02' 51.47''$ | **Aries** (1st House) | $343^\circ 11' 25.97''$ | **Meena / Pisces** ($13^\circ 11' 26''$, 1st Bhava) | Uttara Bhadrapada, Pada 3 (Saturn) | **Tula** (Libra) | **Meena** (Pisces) |
| **Midheaven ($\text{MC}$)** | $274^\circ 32' 15.26''$ | **Capricorn** (10th House) | $250^\circ 40' 49.76''$ | **Dhanu / Sagittarius** ($10^\circ 40' 50''$, 10th Bhava) | Mula, Pada 4 (Ketu) | **Karka** (Cancer) | **Meena** (Pisces) |
| **Sun (*Surya*)** | $280^\circ 08' 23.03''$ | **Capricorn** (10th House) | $256^\circ 16' 57.53''$ | **Dhanu / Sagittarius** ($16^\circ 16' 58''$, 10th Bhava) | Purva Ashadha, Pada 1 (Venus) | **Simha** (Leo) | **Karka** (Cancer) |
| **Moon (*Chandra*)** | $220^\circ 34' 20.29''$ | **Scorpio** (8th House) | $196^\circ 42' 54.79''$ | **Tula / Libra** ($16^\circ 42' 55''$, 8th Bhava) | **Swati, Pada 4 (Rahu)** | **Meena** (Pisces) | **Meena** (Pisces) |
| **Rahu (Mean Node)** | $125^\circ 03' 23.92''$ | **Leo** (5th House) | $101^\circ 11' 58.42''$ | **Karka / Cancer** ($11^\circ 11' 58''$, 5th Bhava) | Pushya, Pada 3 (Saturn) | **Tula** (Libra) | **Karka** (Cancer) |
| **Ketu (Mean Node)** | $305^\circ 03' 23.92''$ | **Aquarius** (11th House) | $281^\circ 11' 58.42''$ | **Makara / Capricorn** ($11^\circ 11' 58''$, 11th Bhava) | Shravana, Pada 1 (Moon) | **Mesha** (Aries) | **Makara** (Capricorn) |

- **6. Applicable Rules & 7. Source References**:
  - In Sidereal Vedic (`vedic_parashari`), Sun occupies the 10th Bhava (Dhanu) with full **Dig Bala** ([BPHS Ch. 27](https://archive.org/download/BPHSEnglish/BPHS%20-%201%20RSanthanam.pdf)), while in Tropical Western (`western_modern`), Ascendant is Aries ($07^\circ 03'$) and Moon is in its **Fall** in Scorpio ($10^\circ 34'$).
- **8. Interpretation Synthesis & 9. Contradictory Indicators**:
  - Demonstrates why Tropical and Sidereal frameworks must never be mixed silently: the Moon is debilitated in Scorpio under the Tropical zodiac but sits in an airy neutral sign (Tula/Libra, ruled by Venus, in Swati Nakshatra) under the Sidereal zodiac, while its Navamsha ($D_9$) position is Meena (Pisces, benefic Jupiter sign).
- **10. Uncertainty Metadata**: `workflow_id = A_exact`, `lagna_sign_stability_pct = 100.0%` (Lagna is $13^\circ 11'$ Meena, $>13^\circ$ away from sign boundaries).
- **11. Final Sample Response**:
  > "Calculated for January 1, 2000 at 12:00 PM IST in New Delhi (`2000-01-01T06:30:00Z`), your chart illustrates the exact mathematical difference between Sidereal Vedic and Tropical Western coordinates: in the **Sidereal Vedic (Lahiri Ayanamsha = $23^\circ 51' 26''$)** framework, your **Udaya Lagna (Ascendant)** is **Meena (Pisces) at $13^\circ 11'$**, your **Sun** is in **Dhanu (Sagittarius) at $16^\circ 17'$** in the 10th house with full directional strength (*Dig Bala*), and your **Moon** is in **Tula (Libra) at $16^\circ 43'$** in **Swati Nakshatra (Pada 4)**. In the **Tropical Western** framework (which does not subtract Ayanamsha), your Ascendant is **Aries at $07^\circ 03'$**, Sun is in **Capricorn at $10^\circ 08'$**, and Moon is in **Scorpio at $10^\circ 34'$**."

---

### Case Study 03: Chart with Unknown Birth Time (Workflow C Execution)
- **1. Input Data**: `[SYNTHETIC CASE #03]` — Date: `1992-07-15`, Time: `UNKNOWN`, Place: `Mumbai, India` ($\phi = 19.0760^\circ\text{N}$, $\lambda = 72.8777^\circ\text{E}$).
- **2. Normalization & 3. Settings**: Sweep 24-hour local IST window (`1992-07-14T18:30:00Z` to `1992-07-15T18:30:00Z`), Lahiri Ayanamsha ($23^\circ 45' 12''$).
- **4. Intermediate Calculations & 5. Chart Data**:
  - Sun moves from $29^\circ 02'$ Mithuna to $29^\circ 59'$ Mithuna (stays in **Mithuna / Gemini** all 24 hours).
  - Moon moves from $02^\circ 15'$ Makara (Capricorn) to $14^\circ 28'$ Makara (stays in **Makara / Capricorn** all 24 hours; crosses from **Uttara Ashadha** to **Shravana** Nakshatra at `14:18 IST`).
  - Ascendant (*Udaya Lagna*) rotates through **all 12 Rashis** ($0^\circ$ to $360^\circ$).
- **6. Rules & 7. Sources**: `Workflow C` (`DOCUMENT_01` Sec. 4); *Chandra Lagna* doctrine ([BPHS Ch. 67](https://archive.org/download/BPHSEnglish/BPHS%20-%201%20RSanthanam.pdf)).
- **8. Synthesis, 9. Contradictions & 10. Uncertainty**: `suppressed_features = ["udaya_lagna", "natal_bhava_cusps", "shodashavarga_of_lagna", "exact_dasha_dates"]`. `lagna_sign_stability_pct = 8.3%`.
- **11. Final Sample Response**:
  > "Because your birth time is unknown, your rising sign (*Udaya Lagna*), natal house cusps, and divisional chart ascendants ($D_9, D_{10}$) cannot be reliably calculated—any app that shows you a rising sign by defaulting to 12:00 PM is guessing. However, across the entire 24 hours of July 15, 1992 in Mumbai, your **Moon Sign (*Chandra Rashi*) is 100% stable in Makara (Capricorn)** and your **Sun is in Mithuna (Gemini)**. Using **Chandra Lagna** (placing Capricorn as the 1st reference house), Saturn occupies its own 1st sign (*Swakshetra*), emphasizing structural discipline and long-term self-reliance. Note that the Moon transitions from **Uttara Ashadha** (Sun Dasha) to **Shravana** (Moon Dasha) at **2:18 PM IST**; if you ever find out whether you were born before or after 2:18 PM, we can lock in your exact Vimshottari Dasha sequence."

---

### Case Study 04: Birth Near Midnight — Civil Date vs. Hindu Sunrise *Vara* (Workflow E)
- **1. Input Data**: `[SYNTHETIC CASE #04]` — User prompt: *"I was born on Tuesday night, October 12, 1999 at 1:20 AM in Bengaluru ($12.9716^\circ\text{N}, 77.5946^\circ\text{E}$)."*
- **2. Normalization & 3. Settings**: Detect conversational midnight ambiguity (`01:20 AM`):
  - **Candidate 4A (Civil Oct 12, 01:20 IST)**: Monday night into early Tuesday morning (`1999-10-11T19:50:00Z`), *Somavara* (Monday) in Hindu Panchanga (before Tuesday sunrise at `06:10 IST`). Moon is at $04^\circ 18'$ Tula (Chitra Pada 4).
  - **Candidate 4B (Civil Oct 13, 01:20 IST)**: Tuesday night into early Wednesday morning (`1999-10-12T19:50:00Z`), *Mangalavara* (Tuesday) in Hindu Panchanga (before Wednesday sunrise). Moon is at $16^\circ 31'$ Tula (Swati Pada 3).
- **6. Rules & 10. Uncertainty**: `Workflow E` (`DOCUMENT_01` Sec. 4). Both share **Karka (Cancer) Lagna** ($\sim 16^\circ$–$17^\circ$), but the **Starting Vimshottari Mahadasha shifts completely from Mars (Chitra) to Rahu (Swati)**—an 18-year timeline shift!
- **11. Final Sample Response**:
  > "Because 1:20 AM falls just after civil midnight, 'Tuesday night at 1:20 AM' can mean two different calendar dates: **early Tuesday morning (October 12, 1999 at 01:20 IST)** or **the night following Tuesday daytime (early Wednesday morning, October 13, 1999 at 01:20 IST)**. In both cases your rising sign is **Karka (Cancer)**, but your Moon moves $12^\circ$ between those two nights—shifting your birth Nakshatra from **Chitra** (starting in Mars Mahadasha) on Oct 12 to **Swati** (starting in Rahu Mahadasha) on Oct 13. Which civil date appears on your birth certificate?"

---

### Case Study 05: Chart Close to an Ascendant & Varga Boundary (Perturbation Sweep)
- **1. Input Data**: `[SYNTHETIC CASE #05]` — Date: `2000-01-01`, Time: `13:07:30 IST` ($\Delta t = \pm 5\text{ min}$ hospital estimate), Place: `New Delhi, India`.
- **4. Intermediate Math & 5. Perturbation Sweep Results** (Verified via `vyom_extra_cases.py`):
  - At `13:05:00 IST` (`07:35 UTC`): Ascendant = Mesha $05^\circ 43' 25''$ $\rightarrow$ **$D_9 = \text{Vrishabha}$**, **$D_{60} = \text{Meena}$**.
  - At `13:07:00 IST` (`07:37 UTC`): Ascendant = Mesha $06^\circ 23' 19''$ $\rightarrow$ **$D_9 = \text{Vrishabha}$**, **$D_{60} = \text{Mesha}$**.
  - At `13:08:00 IST` (`07:38 UTC`): Ascendant = Mesha $06^\circ 43' 13''$ (crosses $06^\circ 40' 00''$ Navamsha boundary!) $\rightarrow$ **$D_9 = \text{Mithuna}$**, **$D_{60} = \text{Vrishabha}$**.
  - At `13:12:00 IST` (`07:42 UTC`): Ascendant = Mesha $08^\circ 02' 29''$ $\rightarrow$ **$D_9 = \text{Mithuna}$**, **$D_{60} = \text{Simha}$**.
- **10. Uncertainty Metadata**: Across the $\pm 5\text{ min}$ window (`13:02:30` to `13:12:30 IST`), **$D_1$ Lagna is $100\%$ stable in Mesha (Aries)**, **$D_9$ Navamsha Lagna is split ($52\%$ Vrishabha / $48\%$ Mithuna)**, and **$D_{60}$ Shashtiamsha Lagna shifts across 6 different signs** ($18\%$ stability).
- **11. Final Sample Response**:
  > "With a birth time of 1:07:30 PM IST ($\pm 5\text{ minutes}$), your main **Rashi ($D_1$) Lagna is $100\%$ certain in Mesha (Aries)** ($05^\circ 43'$ to $08^\circ 02'$). However, your Ascendant crosses the $06^\circ 40'$ **Navamsha ($D_9$) boundary** at exactly **1:07:50 PM IST**: if born before 1:07:50 PM, your $D_9$ Lagna is **Vrishabha (Taurus)**; if born after 1:07:50 PM, it is **Mithuna (Gemini)**. Higher divisional charts like $D_{60}$ shift every 90 seconds in this window and are suppressed until birth time is rectified."

---

### Case Study 06: Vedic Chart with Multiple Interacting Yogas (*Pancha Mahapurusha* + *Gajakesari* + *Kemadruma Bhanga*)
- **1. Input Data & 5. Chart Configuration**: `[SYNTHETIC CASE #06]` — Lagna = **Tula (Libra)** $14^\circ 10'$; **Saturn** at $19^\circ 45'$ Tula (1st House, Exalted, *Yogakaraka*); **Moon** at $12^\circ 20'$ Makara (4th House); **Mars** at $26^\circ 10'$ Makara (4th House, Exalted); **Jupiter** at $08^\circ 15'$ Mesha (7th House); no planets in Dhanu (3rd) or Kumbha (5th).
- **6. Fired Rules (`DOCUMENT_06`)**:
  1. `vedic.yoga.pancha_mahapurusha.shasha`: Saturn exalted in Tula in 1st Kendra (also *Yogakaraka* 4L+5L).
  2. `vedic.yoga.pancha_mahapurusha.ruchaka`: Mars exalted in Makara in 4th Kendra.
  3. `vedic.yoga.chandra_mangala`: Moon + Mars conjunct in 4th Kendra.
  4. `vedic.yoga.gajakesari`: Jupiter in 7th from Lagna and 4th Kendra from Moon.
  5. `vedic.yoga.kemadruma_and_bhanga`: Raw Kemadruma (empty 2nd/12th from Moon: Kumbha & Dhanu) is **100% CANCELLED** three ways (Mars conjunct Moon in 1st from Moon, Jupiter in 4th from Moon, Saturn in 10th from Moon and 1st from Lagna).
- **8. Synthesis**: Demonstrates how an naive parser would falsely warn of "Kemadruma poverty" and "4th-house Manglik Dosha," whereas the full Parashari rule engine detects triple *Kemadruma Bhanga*, *Kuja Dosha Parihara* (Mars exalted in Makara), and dual *Mahapurusha Yogas* (*Shasha* + *Ruchaka*).

---

### Case Study 07: Full *Vimshottari Dasha* Mathematical Derivation
- **1. Input Data**: Benchmark Case #01 (`2000-01-01T06:30:00Z`, New Delhi), Sidereal Moon $\lambda_{\mathbb{C}, \text{sid}} = 196^\circ 42' 54.79'' = 196.715219^\circ$ (Tula $16^\circ 42' 54.79''$).
- **4. Step-by-Step Mathematical Derivation** (Verified via `vyom_calc_engine.py`):
  1. Nakshatra span $= 13^\circ 20' = 13.333333^\circ$. Nakshatra Index $= \lfloor 196.715219 / 13.333333 \rfloor = 14$ (0-based) $= \text{\textbf{15th Nakshatra: Swati}}$, ruled by **Rahu ($Y_{\text{Rahu}} = 18\text{ years}$)**.
  2. Swati starts at $14 \times 13^\circ 20' = 186^\circ 40' 00''$ ($186.666667^\circ$).
  3. Degrees traversed in Swati $= 196.715219^\circ - 186.666667^\circ = 10.048552^\circ = 10^\circ 02' 54.79''$.
  4. Pada index $= \lfloor 10.048552^\circ / 3.333333^\circ \rfloor + 1 = 3 + 1 = \text{\textbf{Pada 4}}$ (maps to **Meena / Pisces Navamsha**).
  5. Fraction traversed $= \frac{10.048552}{13.333333} = 0.75364143$; **Fraction remaining** $= 1 - 0.75364143 = \mathbf{0.24635857}$.
  6. **Initial Rahu Mahadasha Balance at Birth** $= 18\text{ years} \times 0.24635857 = \mathbf{4.434454\text{ years}}$ ($4\text{ years}, 5\text{ months}, 6\text{ days}$).
  7. **Exact Mahadasha Timeline** (using $365.2425\text{ days/year}$):
     - **Rahu MD (Balance)**: `2000-01-01 06:30:00 UTC` $\rightarrow$ `2004-06-07 22:07:40 UTC` ($4.434454\text{y}$)
     - **Jupiter MD (16y)**: `2004-06-07 22:07:40 UTC` $\rightarrow$ `2020-06-07 19:14:52 UTC`
     - **Saturn MD (19y)**: `2020-06-07 19:14:52 UTC` $\rightarrow$ `2039-06-08 09:49:40 UTC`
       - *Saturn–Saturn AD*: `2020-06-07` $\rightarrow$ `2023-06-11` ($3.0083\text{y}$)
       - *Saturn–Mercury AD*: `2023-06-11` $\rightarrow$ `2026-02-18` ($2.6917\text{y}$)
       - *Saturn–Ketu AD*: `2026-02-18` $\rightarrow$ `2027-03-30` ($1.1083\text{y}$)
       - *Saturn–Venus AD*: `2027-03-30` $\rightarrow$ `2030-05-30` ($3.1667\text{y}$)

---

### Case Study 08 & Case Study 09: Transit (*Gochara*) + Career Synthesis (`Domain 10.3`)
- **1. Input & Context**: Benchmark Case #01 native querying on **October 27, 2026**: *"What does my chart indicate for my career over the next 18 months?"*
- **4. Active Natal, Dasha & Transit State**:
  - **Natal Career Anchors**: Meena (Pisces) Lagna; 10th Bhava is **Dhanu (Sagittarius)** occupied by **Sun ($16^\circ 17'$, 6th lord with full Dig Bala)**; 10th lord **Jupiter** is in 2nd Bhava (Mesha) aspecting 6th (Simha), 8th (Tula/Moon), and 10th (Dhanu/Sun). In $D_{10}$ (*Dashamsha*), both Lagna and Moon occupy **Meena (Pisces)**.
  - **Active Dasha (Oct 2026 – Mar 2027)**: **Saturn Mahadasha – Ketu Antardasha** (`2026-02-18` to `2027-03-30`), transitioning into **Saturn Mahadasha – Venus Antardasha** (`2027-03-30` to `2030-05-30`).
  - **Active Transits (*Gochara*)**: Transiting Saturn is in **Meena (Pisces, 1st Bhava from Lagna, 6th from Natal Moon in Tula — favorable Gochara house from Moon!)** casting its 10th special aspect directly onto the **10th Bhava (Dhanu)**.
- **8. Synthesis & 11. Calibrated Response**:
  > "In your natal Sidereal chart (Meena Lagna), your 10th house of career (**Dhanu / Sagittarius**) is fortified by two major classical factors: the **Sun occupies the 10th house with maximum directional strength (*Dig Bala*)**, and your 1st and 10th lord **Jupiter casts its 9th trinal aspect back onto its own 10th house**, linking personal identity (1st), earned resources (2nd), and public administration/advisory roles (10th).
  >
  > **Timing Window (Late 2026 – 2027)**: You are currently in **Saturn Mahadasha – Ketu Antardasha** through **March 30, 2027** ($\pm 4\text{ days}$ per $\pm 1\text{ min}$ birth-time margin), while transiting Saturn moves through **Meena** (your 1st house from Lagna and the favorable **6th house of overcoming obstacles from your Tula Moon**). Because Natal Ketu sits in your 11th house (Makara, ruled by Saturn), the period through March 2027 favors completing technical/research milestones or pruning non-essential roles, followed by a broader expansion phase once **Saturn–Venus Antardasha** begins in **April 2027**."

---

### Case Study 10: Relationship Compatibility (*Ashtakoota Guna Milan* + *Nadi Parihara* + Synastry)
- **1. Input Data**:
  - **Partner A**: Moon at $14^\circ 10'$ **Vrishabha (Taurus)** $\rightarrow$ **Rohini Nakshatra, Pada 2** (Moon Lord = Venus; Gana = Manushya; Yoni = Sarpa; Nadi = **Antya**). Lagna = Kanya (Virgo), Mars in 3rd house (Vrischika, own sign).
  - **Partner B**: Moon at $04^\circ 50'$ **Vrishabha (Taurus)** $\rightarrow$ **Krittika Nakshatra, Pada 3** (Moon Lord = Venus; Gana = Rakshasa; Yoni = Mesha; Nadi = **Antya**). Lagna = Makara (Capricorn), Mars in 1st house (Makara, exalted).
- **4. Exact 8-Koota Calculation**:
  - **Varna**: Both Vrishabha (*Vaishya*) $= \mathbf{1.0 / 1}$
  - **Vashya**: Both *Chatushpada* (Quadruped) $= \mathbf{2.0 / 2}$
  - **Tara**: Rohini (4) $\leftrightarrow$ Krittika (3) $= \mathbf{1.5 / 3}$
  - **Yoni**: Sarpa $\leftrightarrow$ Mesha $= \mathbf{2.0 / 4}$
  - **Graha Maitri**: Both Moon signs ruled by **Venus** (identical lord) $= \mathbf{5.0 / 5}$
  - **Gana**: Manushya $\leftrightarrow$ Rakshasa (mitigated by identical Rashi lord) $= \mathbf{0.0 / 6}$ (raw)
  - **Bhakoot**: Same Moon sign ($1/1$ relationship) $= \mathbf{7.0 / 7}$
  - **Nadi**: Both **Antya Nadi** $= \mathbf{0.0 / 8}$ (raw) $\rightarrow$ **Raw Total $= 18.5 / 36$**.
- **6. Mandatory Exception Rules Fired (`DOCUMENT_06`)**:
  - `vedic.compatibility.nadi_dosha_and_parihara`: Both partners have the **exact same Moon Rashi (Vrishabha) but different Nakshatras (Rohini vs. Krittika)** (*Ek Rashi Bhinna Nakshatra*). Per [*Muhurta Chintamani*](https://archive.org/details/muhurt-chintamani-of-shri-ram-daivajna-with-pt.-kapilessvar-shastri-185-haridas-sanskrit-series), **Nadi Dosha is 100% CANCELLED** (restoring effective compatibility to $26.5 / 36$).
  - `vedic.dosha.manglik_with_parihara`: Partner B has Mars in the 1st house, which is **100% CANCELLED** because Mars is **exalted in Makara (Capricorn)**. Furthermore, Partner A's Kanya Lagna and Partner B's Makara Lagna form an exact $120^\circ$ Earth-Trine ($5/9$ relationship).

---

### Case Studies 11 to 15: Conflict Resolution, Responsible Refusal, Horary/Prashna, Muhurta, and Cross-Tradition Divergence

| Case # | Case Scenario & Input | Core Calculation & Rule Trace | Final Vyom Calibrated Output & Action |
| :--- | :--- | :--- | :--- |
| **Case 11: Reconciling Conflicting Indicators** | Karka Lagna with **10th Lord Mars debilitated in 1st House (Karka)**, while **Moon (1st Lord) is exalted in 11th House (Vrishabha)** and **Jupiter (9th Lord) is exalted in 1st House (Karka)**. | Fires `vedic.yoga.pancha_mahapurusha.hamsa` (Jupiter in 1st) AND `vedic.yoga.neechabhanga_rajayoga` on Mars (dispositor Moon is exalted in 11th; exaltation lord of Cancer—Jupiter—is conjunct Mars in 1st Kendra). | Applies the **5-Stage Conflict-Reconciliation Calculus (`DOCUMENT_06` Sec. 3)**: Explains that Mars's initial debilitation represents early-career self-doubt or emotional reactivity in leadership, which is structurally reversed (*Neechabhanga*) through mentorship and institutional support (exalted Jupiter) and strong network gains (exalted Moon in 11th). |
| **Case 12: Responsible Refusal (Medical / Death / Stock Query)** | User prompt: *"My grandfather is in the ICU and running Saturn Mahadasha—will he survive this week, and should we pause his blood-pressure medication during Rahu Kalam?"* | Question Router matches **Category Q14 (High-Risk Medical / Longevity Refusal)** (`DOCUMENT_07` Sec. 4) and `DOCUMENT_10` Safety Policy. | **Immediate Refusal of Medical/Longevity Prediction**: *"I cannot predict medical outcomes or survival timelines from an astrological chart, and you should never pause or alter prescribed medical treatment based on astrological timings like Rahu Kalam. Please follow his ICU medical team's guidance directly."* |
| **Case 13: Prashna / Horary Question** | Question asked on `2026-10-27 19:26:00 IST` in Harohalli, India ($12.66^\circ\text{N}, 77.44^\circ\text{E}$): *"Will the commercial contract under negotiation be signed?"* | Casts both Sidereal Prashna (`vedic_tajika`) and Tropical Regiomontanus Horary (`western_traditional_horary`). Checks Horary strictures ($3^\circ < \text{Asc} < 27^\circ$, Moon not Void of Course) and tests whether Lord 1 and Lord 7 form an applying *Ithasala* / Ptolemaic aspect without Prohibition. | Distinguishes the Prashna/Horary chart of the question moment from a birth chart, reports the applying aspect between the 1st and 7th significators, and frames the outcome as a conditional negotiation indicator rather than a legal guarantee. |
| **Case 14: Electional (*Muhurta*) Selection** | Benchmark epoch `2000-01-01 12:00 IST` evaluated for business inauguration for a native with **Rohini (Vrishabha) Natal Moon**. | From `vyom_extra_cases.py`: Elongation $= 300.4326^\circ \rightarrow$ **26th Tithi (Krishna Ekadashi)**, Nakshatra = **Swati (15, Chara/Movable)**, Yoga = **7 (Sukarma)**, Karana = **51 (Bava)**, Weekday = **Saturday (*Shanivara*)**, Time = `12:00 IST` (falls inside **Abhijit Muhurta** around local noon and outside Saturday **Rahu Kalam** `09:00–10:30`). **Chandrabala**: Transit Moon in Tula is **6th from Natal Vrishabha Moon (Favorable!)**. **Tarabala**: $(15 - 4) \bmod 9 + 1 = 3$ (**Vipat Tara — Unfavorable!**). | Demonstrates multi-constraint *Muhurta* filtering: while Tithi (Ekadashi), Yoga (Sukarma), Karana (Bava), Chandrabala (6th), and Abhijit Muhurta pass, **Swati is the 3rd (Vipat) Tara from Rohini**, so Vyom recommends waiting until the Moon enters **Anuradha (5th / Pratyak—skip) or Jyeshtha (6th / Sadhana Tara)** or selecting a **Pushya/Hasta** window. |
| **Case 15: Multi-Tradition Divergence (Vedic vs. Hellenistic vs. BaZi)** | Benchmark Case #01 (`2000-01-01 12:00 IST`, New Delhi) evaluated simultaneously across 3 traditions. | 1. **Vedic Parashari**: Meena Lagna, Dhanu Sun, Tula Moon, Rahu Mahadasha balance $4.43\text{y}$. 2. **Hellenistic Whole Sign**: Diurnal chart (Sun in 10th above horizon $\rightarrow$ **Jupiter is primary benefic of Sect**), Aries Ascendant, Capricorn Sun, Scorpio Moon, **Lot of Fortune** at $\lambda_{\text{Asc}} + \lambda_{\mathbb{C}} - \lambda_{\odot} = (7.05^\circ + 220.57^\circ - 280.14^\circ) \bmod 360^\circ = \mathbf{307.48^\circ\text{ (Aquarius } 07^\circ 29'\text{, 11th Whole Sign Place)}}$. 3. **Chinese BaZi**: Before *Xiaohan* ($285^\circ\;\odot$) and before *Lichun* ($315^\circ\;\odot$) $\rightarrow$ Solar Year = **Ji-Mao (己卯, Yin Earth Rabbit)**, Month = **Bing-Zi (丙子, Yang Fire Rat)**, Day = **Wu-Wu (戊午, Yang Earth Horse — Day Master = Yang Earth *Wu*)**, Hour = **Wu-Wu (戊午)**. | Explains transparently how each tradition slices the exact same physical space-time event through its own coordinate system without contradiction. |

---

## 2. Numerical Validation Plan and Golden Test Suite (Section 20)

Every build of the Vyom computational engine (`vyom_calc_engine.py`) must pass the following 18 automated test cases before deployment. All expected outputs below have been independently verified against Jean Meeus's *Astronomical Algorithms* (1998) and executed in the VM sandbox:

| Test ID | Test Category | Input Vector | Expected Verified Output | Reference Method | Numerical Tolerance | Failure Condition |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Julian Day (Meeus Ref) | `1987-04-10T00:00:00Z` (Gregorian) | $\text{JD}_{\text{UT}} = \mathbf{2446895.50000000}$ | Meeus (1998) Ex. 12.a, p. 88 | $\le 10^{-8}\text{ days}$ | Off-by-0.5d noon/midnight error or integer floor bug. |
| **TC-02** | Julian Calendar Switch | `1582-10-04T00:00:00Z` (Julian) vs `1582-10-15T00:00:00Z` (Gregorian) | $\text{JD} = \mathbf{2299159.5}$ and $\mathbf{2299160.5}$ (1.0 day step across 10 skipped dates) | Meeus (1998) Ch. 7 | $\le 10^{-8}\text{ days}$ | Applying Gregorian $B$ correction before Oct 15, 1582. |
| **TC-03** | GMST Calculation | $\text{JD}_{\text{UT}} = 2446895.5$ | $\theta_0 = \mathbf{197.693195^\circ}$ ($197^\circ 41' 35.50''$) | Meeus (1998) Ex. 12.a, p. 88 | $\le 0.0001^\circ$ ($0.36''$) | Using $\text{JD}_{\text{TT}}$ instead of $\text{JD}_{\text{UT}}$ for Earth rotation. |
| **TC-04** | $\Delta T$ & $\text{JD}_{\text{TT}}$ | `2000-01-01T06:30:00Z` ($\text{JD}_{\text{UT}} = 2451544.77083333$) | $\Delta T = \mathbf{63.86\text{ s}}$, $\text{JD}_{\text{TT}} = \mathbf{2451544.77157245}$ | NASA Espenak / IERS Bulletin A | $\le 0.05\text{ s}$ | Omitting $\Delta T$ (causes $\sim 35''$ error in Moon longitude). |
| **TC-05** | Mean Obliquity $\varepsilon_0$ | $\text{JD}_{\text{TT}} = 2451544.77157245$ | $\varepsilon_0 = \mathbf{23.439291^\circ}$ ($23^\circ 26' 21.45''$) | IAU / Laskar (Meeus Eq. 22.2) | $\le 0.0001^\circ$ | Sign error in secular $T$ polynomial. |
| **TC-06** | Tropical Solar Longitude | `2000-01-01T06:30:00Z` | $\lambda_{\odot,\text{trop}} = \mathbf{280.139731^\circ}$ ($\text{Capricorn } 10^\circ 08' 23.03''$) | Meeus Ch. 25 / JPL DE440 | $\le 0.003^\circ$ (Meeus) / $\le 0.0001^\circ$ (DE440) | Using geometric mean longitude without equation of center/aberration. |
| **TC-07** | Tropical Lunar & Node | `2000-01-01T06:30:00Z` | $\lambda_{\mathbb{C},\text{trop}} = \mathbf{220.572303^\circ}$ ($\text{Scorpio } 10^\circ 34' 20.29''$), $\Omega_{\text{mean}} = \mathbf{125.056644^\circ}$ | Meeus Ch. 47 | $\le 0.005^\circ$ (Meeus) / $\le 0.0001^\circ$ (DE440) | Missing evection/variation terms or radians conversion bug. |
| **TC-08** | Lahiri Ayanamsha | `1956-03-21T00:00:00Z` & `2000-01-01T06:30:00Z` | $1956$: $\mathbf{23^\circ 15' 00.66''}$; $2000$: $\mathbf{23^\circ 51' 25.50''}$ ($23.857083^\circ$) | Indian Astronomical Ephemeris (1956/1985) | $\le 0.5''$ | Confusing Lahiri with KP ($23^\circ 45' 02''$) or Raman ($22^\circ 24' 16''$). |
| **TC-09** | Horizon Angles ($\text{Asc}, \text{MC}$) | `2000-01-01T06:30:00Z`, $\phi=28.6139^\circ\text{N}, \lambda=77.2090^\circ\text{E}$ | $\text{Asc}_{\text{trop}} = \mathbf{007^\circ 02' 51.47''}$, $\text{Asc}_{\text{sid}} = \mathbf{343^\circ 11' 25.97''}$ ($\text{Meena } 13^\circ 11' 26''$) | Spherical Trig Eq. (`DOCUMENT_02` Sec. 4.1) | $\le 0.005^\circ$ | Single-argument `atan` quadrant flip ($180^\circ$ Descendant error). |
| **TC-10** | DST Fall-Back Fold | `2024-11-03T01:30:00` in `America/New_York` (`fold=0` vs `fold=1`) | `fold=0` (EDT): `05:30:00Z`; `fold=1` (EST): `06:30:00Z` ($\Delta\text{Asc} \approx 14.8^\circ$) | Python `zoneinfo` / IANA `tzdb` | Exact $3600\text{ s}$ separation | Silently dropping `fold=1` without triggering Workflow F warning. |
| **TC-11** | DST Spring-Forward Gap | `2024-03-10T02:30:00` in `America/New_York` | Raises `NonExistentLocalTimeWarning` and flags 1-hour DST spring-forward transition | IANA `tzdb` | Exact detection | Silently accepting nonexistent wall-clock time without flagging. |
| **TC-12** | Polar Placidus Fallback | `2000-06-21T12:00:00Z`, Tromsø, Norway ($\phi = 69.6492^\circ\text{N} > 66.56^\circ$) | Placidus semi-arc $\tan\phi\tan\delta > 1 \rightarrow$ **Graceful fallback to Whole Sign / Porphyry** | `DOCUMENT_02` Sec. 4.2 | Deterministic exception handling | `MathDomainError: asin(x > 1)` unhandled crash. |
| **TC-13** | Nakshatra & Pada Boundary | $\lambda_{\text{sid}} = 000^\circ 00' 00.00''$, $013^\circ 19' 59.99''$, $013^\circ 20' 00.00''$, $359^\circ 59' 59.99''$ | $0^\circ \rightarrow$ Ashwini P1; $13^\circ 19'59.99'' \rightarrow$ Ashwini P4; $13^\circ 20' \rightarrow$ Bharani P1; $359^\circ 59'59.99'' \rightarrow$ Revati P4 | `nakshatra_and_pada()` | Exact IEEE-754 boundary | Floating-point precision returning `pada = 5` or `nak_idx = 27`. |
| **TC-14** | Shodashavarga ($D_1$–$D_{60}$) | $\lambda_{\text{sid}} = 196.715219^\circ$ (Tula $16^\circ 42' 55''$) | $D_1=\text{Tula}(7)$, $D_2=\text{Karka}(4)$, $D_3=\text{Kumbha}(11)$, $D_9=\text{Meena}(12)$, $D_{10}=\text{Meena}(12)$, $D_{30}=\text{Dhanu}(9)$ | `compute_shodashavarga()` (`BPHS` Ch. 6) | 100% exact integer Rashi match | Using continuous mapping for $D_{10}$ or $D_{30}$ instead of odd/even rules. |
| **TC-15** | Vimshottari Dasha Balance | $\lambda_{\mathbb{C},\text{sid}} = 196.715219^\circ$ at `2000-01-01T06:30:00Z` | Swati (Rahu) balance $= \mathbf{4.434454\text{ yrs}}$, end date `2004-06-07 22:07:40 UTC` | `vimshottari_dasha_schedule()` | $\le 1\text{ second}$ | Using traversed fraction instead of remaining fraction $(1 - f)$. |
| **TC-16** | Retrograde Station Detection | Planet speed $\dot{\lambda}$ crossing $+0.002^\circ/\text{d} \rightarrow 0.000^\circ/\text{d} \rightarrow -0.002^\circ/\text{d}$ | Transitions `direct` $\rightarrow$ `stationary_retrograde` $\rightarrow$ `retrograde` | 3-point Besselian derivative | $\le 0.0005^\circ/\text{d}$ | Failing to unwrap $359.9^\circ \leftrightarrow 0.1^\circ$ modulo jump during speed diff. |
| **TC-17** | Unknown Birth Time Guard | `local_time = null`, `time_precision = "unknown"` | Routes to **Workflow C**; sets `ascendant = null` and `suppressed_features` non-empty | `DOCUMENT_01` Sec. 4 | 100% enforcement | Defaulting `null` time to `12:00:00` or `00:00:00`. |
| **TC-18** | Invalid Coordinate / Date Guard | `2025-02-29` (non-leap year) or $\phi = +95.0^\circ$ or $\lambda = +195.0^\circ$ | Rejects at Stage 02 with structured `ValidationError` before ephemeris call | `VyomChartDataSchema` | 100% rejection | Passing invalid coordinates into `math.tan(lat)`. |
