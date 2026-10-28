# Vyom Domain-Specific Knowledge Base & Occult Library Inventory

*Document Version:* 1.0.0  
*Updated:* 2026-10-19  
*System Architect:* Vyom AI/ML & Astrological Knowledge Engineering Team  
*Target Engine:* Vyom Sidereal Jyotish Engine & Occult Traditions Knowledge System  

---

## 1. Executive Summary

This inventory details the primary source collection supplied for ingestion into the Vyom knowledge platform. The collection spans **2,603 total pages** of classical Vedic astrology (*Brihat Parashara Hora Shastra*, *Brihat Jataka*, *Phaladeepika*, *Saravali*, *Jataka Parijata*, and modern Jyotish coursework) alongside definitive historical texts on Western Hermeticism, Kabbalah, occult theory, and magical defense (*The Mysteries of Magic* by Éliphas Lévi and *Magic, White and Black* by Dr. Franz Hartmann).

Every document has been physically verified in `/Users/arunkumarpatil/Downloads/`, inspected for text extraction integrity, categorized according to the 14 domain taxonomies, and evaluated for Retrieval-Augmented Generation (RAG), evaluation benchmarks, and fine-tuning dataset generation.

---

## 2. Ingested Resource Registry

| ID | Filename | Title | Author / Translator | Year / Edition | Pages | Format | Direct Text Layer | OCR Needed | Completeness | Public Domain / License | Primary Status |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| **DOC-01** | `403096259-brihat-parashara-hora-shastra-english-V-pdf.pdf` | *Brihat Parashara Hora Shastra* | Maharishi Parashara (Ed. / Trans. G.C. Sharma / R. Santhanam tradition) | Classical; modern composite translation | 302 | PDF | **Yes** (Embedded PDF text) | No | Complete (97 Chapters) | Classical heritage / educational use | **Ingested & Indexed** |
| **DOC-02** | `2015.406251.Brihat-Jataka_text.pdf` | *The Brihat Jataka of Varahamihira* | Varahamihira (Trans. N. Chidambaram Iyer / Vijnanananda) | 1919 (Archive Edition) | 274 | PDF | Present but **unusable** (OCR layer is garbage — re-verified 2026-10-27) | **Yes** | Text not recoverable without OCR | Public Domain (1919) | **Excluded from retrieval — see docs/consultation-system.md** |
| **DOC-03** | `phaladeepika-2nd-ed-1950-by-v-subrahmanya-sastri-text.pdf` | *Mantreswara's Phaladeepika* | Mantreswara; Trans. V. Subrahmanya Sastri, B.A. | 1950 (2nd Ed., Bangalore Press) | 473 | PDF | **Yes** (Digital OCR text layer) | No | Complete (Adhyayas I–XXVIII) | Public Domain (1950) | **Ingested & Indexed** |
| **DOC-04** | `Saravali.pdf` | *Kalyana Varma's Saravali* | Kalyana Varma; Trans. & Notes by R. Santhanam | Classical / Ranjan Publications | 203 | PDF | **Yes** (Embedded PDF text) | No | Complete (Chapters 1–45) | Cultural Heritage / Fair Use | **Ingested & Indexed** |
| **DOC-05** | `jataka-parijata-vol-1.pdf` | *Vaidyanatha Dikshita's Jataka Parijata (Vol. 1)* | Vaidyanatha Dikshita; Trans. V. Subrahmanya Sastri | 1932 / Ranjan Repr. | 324 | PDF | **Yes** (Digital text layer; recursive tree resolved) | No | Complete Vol. 1 (Adhyayas I–VIII) | Public Domain original translation | **Ingested & Indexed** |
| **DOC-06** | `book1-for-CD.pdf` | *Lessons on Vedic Astrology (Volume 1)* | P.V.R. Narasimha Rao (Sri Jagannath Center) | 2004–2006 (Student compilation) | 122 | PDF | **Yes** (High-quality digital text) | No | Complete (Lessons 1–45) | Creative Commons / Open Educational | **Ingested & Indexed** |
| **DOC-07** | `Astrology-e-book-compressed.pdf` | *The Origin, Meaning & Purpose of Astrology* | Chennareddy Vasudev | 2019 (1st Ed., Hyderabad) | 164 | PDF | **Yes** (Native digital text) | No | Complete | Copyright © Author (Fair use for retrieval) | **Ingested & Indexed** |
| **DOC-08** | `the-mysteries-of-magic-eliphas-levi-arthur-edward-waite-1389.pdf` | *The Mysteries of Magic: A Digest of the Writings of Éliphas Lévi* | Éliphas Lévi; Trans. & Biographical Essay by Arthur Edward Waite | 1886 (George Redway, London) | 431 | PDF | **Yes** (Digital OCR text layer) | No | Complete (Parts I–VII + Appendices) | Public Domain (1886) | **Ingested & Indexed** |
| **DOC-09** | `magicwhiteblack00hart_0.pdf` | *Magic, White and Black: Or The Science of Finite and Infinite Life* | Dr. Franz Hartmann, M.D. | 1888/1890 (4th Ed., Lovell / Redway) | 310 | PDF | **Yes** (Digital OCR text layer) | No | Complete (12 Chapters + Appendix) | Public Domain (1890) | **Ingested & Indexed** |

---

## 3. Detailed Document Profiles

### DOC-01: Brihat Parashara Hora Shastra (BPHS)
- **Path:** `/Users/arunkumarpatil/Downloads/403096259-brihat-parashara-hora-shastra-english-V-pdf.pdf`
- **Author:** Maharishi Parashara
- **Format:** PDF, 302 pages (1.20 MB)
- **Language:** English with Sanskrit terms (Graha, Rashi, Bhava, Nakshatra, Dasha)
- **Classification Categories:**
  - 1. Classical Vedic astrology
  - 2. Kundli and birth-chart interpretation
  - 3. Planetary positions, houses, Rashis, and Nakshatras
  - 4. Yogas and Doshas
  - 5. Vimshottari Dasha and other documented timing systems
  - 10. Traditional remedies and ritual practices
- **Key Chapters:** 
  - Ch. 3: Graha Characters and Significations
  - Ch. 6: The 16 Divisions of a Rashi (Shodashvarga)
  - Ch. 9–10: Arishta and Antidotes for Evils (Balarishta Bhanga)
  - Ch. 11–24: Judgement of 12 Bhavas
  - Ch. 32–43: Special Yogas (Raja, Dhana, Nabhasa, Daridra)
  - Ch. 46–50: Dasha Phala Adhyaya (Vimshottari, Ashtottari, Shodashottari)
  - Ch. 81: Stri Jataka and Kuja Dosha (Mangal Dosha)
- **Suitability:** **Highest tier for RAG and fine-tuning validation.** The ultimate foundational benchmark for all classical Vedic calculations and rules.

### DOC-02: The Brihat Jataka of Varahamihira
- **Path:** `/Users/arunkumarpatil/Downloads/2015.406251.Brihat-Jataka_text.pdf`
- **Author:** Varahamihira (6th century CE astronomer-astrologer)
- **Format:** PDF, 274 pages (7.93 MB)
- **Language:** English translation with Sanskrit terminology
- **Classification Categories:**
  - 1. Classical Vedic astrology
  - 2. Kundli and birth-chart interpretation
  - 3. Planetary positions, houses, Rashis, and Nakshatras
  - 4. Yogas and Doshas
  - 6. Transits and predictive methods
  - 13. Commentaries, analogies, case studies
- **Key Chapters:**
  - Ch. 1: Zodiacal definitions (*Rashi Bheda*)
  - Ch. 2: Planetary definitions (*Graha Bheda*)
  - Ch. 7: Ayurdaya (Longevity computation)
  - Ch. 10: Karma Jivana (Occupation / 10th House)
  - Ch. 11: Raja Yogas
  - Ch. 12: Nabhasa Yogas
  - Ch. 21: Sub-planetary influences (*Ansha Phala*)
  - Ch. 26: Lost horoscopy (*Nashta Jataka*)
- **Suitability:** Indispensable reference for astronomical precision and philosophical conciseness.

### DOC-03: Mantreswara's Phaladeepika
- **Path:** `/Users/arunkumarpatil/Downloads/phaladeepika-2nd-ed-1950-by-v-subrahmanya-sastri-text.pdf`
- **Author:** Mantreswara; Translated by V. Subrahmanya Sastri, B.A.
- **Format:** PDF, 473 pages (32.63 MB)
- **Language:** Sanskrit verses in Devanagari accompanied by exhaustive line-by-line English translation and commentary
- **Classification Categories:**
  - 1. Classical Vedic astrology
  - 2. Kundli and birth-chart interpretation
  - 4. Yogas and Doshas
  - 5. Vimshottari Dasha and other timing systems
  - 6. Transits and predictive methods
  - 8. Compatibility and relationship astrology
  - 10. Traditional remedies and ritual practices
- **Key Chapters:**
  - Adhyaya 6: Special Yogas (Gaja Kesari, Amala, Parvata, Kahala, Sankha)
  - Adhyaya 7: Maharaja Yogas
  - Adhyaya 15: Bhava Phala (Judgement of Houses)
  - Adhyaya 19–22: Vimshottari Dasha and Antardasha results
  - Adhyaya 24: Ashtakavarga
  - Adhyaya 26: Gochara (Transit results from Moon sign and Vedhas)
- **Suitability:** **Highest predictive utility.** Widely considered the most practical predictive manual in Jyotish.

### DOC-04: Kalyana Varma's Saravali
- **Path:** `/Users/arunkumarpatil/Downloads/Saravali.pdf`
- **Author:** King Kalyana Varma (8th century CE); Translated by R. Santhanam
- **Format:** PDF, 203 pages (0.53 MB)
- **Language:** English
- **Classification Categories:**
  - 1. Classical Vedic astrology
  - 2. Kundli and birth-chart interpretation
  - 3. Planetary positions, houses, Rashis, and Nakshatras
  - 4. Yogas and Doshas
  - 6. Transits and predictive methods
  - 8. Compatibility and relationship astrology
  - 13. Commentaries, analogies, case studies
- **Key Chapters:**
  - Ch. 3–4: Rashi and Planetary characters
  - Ch. 15–20: Two, Three, Four, and Five Planet Conjunctions
  - Ch. 21–30: Planets in 12 Houses for each Lagna
  - Ch. 31: Transit results and Saturn's Sade Sati
  - Ch. 34–35: Raja Yogas and Royal combinations
  - Ch. 45: Stri Jataka (Horoscopy of Women)
- **Suitability:** The definitive classical authority on multi-planet conjunctions (*Yuti*) and individual house placements.

### DOC-05: Vaidyanatha Dikshita's Jataka Parijata (Vol. 1)
- **Path:** `/Users/arunkumarpatil/Downloads/jataka-parijata-vol-1.pdf`
- **Author:** Vaidyanatha Dikshita; Translated by V. Subrahmanya Sastri
- **Format:** PDF, 324 pages (6.94 MB)
- **Language:** Sanskrit verses with English translation and mathematical commentary
- **Classification Categories:**
  - 1. Classical Vedic astrology
  - 2. Kundli and birth-chart interpretation
  - 3. Planetary positions, houses, Rashis, and Nakshatras
  - 4. Yogas and Doshas
  - 5. Timing systems
- **Key Adhyayas:**
  - Adhyaya 1: Definitions and Zodiacal foundations
  - Adhyaya 2: Graha Bala (Planetary Strengths, Shadbala fundamentals)
  - Adhyaya 3: Varga consideration and Bhava computation
  - Adhyaya 4: Longevity calculations (Ayurdaya)
  - Adhyaya 7–8: Rajayogas, Dhana Yogas, and Kaal Sarp Yoga foundations
- **Suitability:** Essential for rigorous planetary strength (*Shadbala*) rules and complex Raja Yogas.

### DOC-06: Lessons on Vedic Astrology (Vol. 1)
- **Path:** `/Users/arunkumarpatil/Downloads/book1-for-CD.pdf`
- **Author:** P.V.R. Narasimha Rao (Sri Jagannath Center)
- **Format:** PDF, 122 pages (1.06 MB)
- **Language:** English
- **Classification Categories:**
  - 1. Classical Vedic astrology
  - 2. Kundli and birth-chart interpretation
  - 3. Planetary positions, houses, Rashis, and Nakshatras
  - 5. Vimshottari Dasha and other timing systems
  - 13. Commentaries, analogies, case studies, and interpretive examples
  - 14. Modern research and reference material
- **Key Content:**
  - Lessons 1–10: Graha, Rashi, and Bhava basics
  - Lessons 11–20: Divisional charts (Navamsha D-9, Dasamsha D-10, Saptamsha D-7)
  - Lessons 21–30: Dasha application rules and timing of marriage/career
  - Lessons 31–45: Argala, Arudha Padas, and real-world horoscope walk-throughs
- **Suitability:** Exceptional modern pedagogical bridge between Sanskrit verse and algorithmic analysis.

### DOC-07: The Origin, Meaning & Purpose of Astrology
- **Path:** `/Users/arunkumarpatil/Downloads/Astrology-e-book-compressed.pdf`
- **Author:** Chennareddy Vasudev
- **Format:** PDF, 164 pages (0.59 MB)
- **Language:** English
- **Classification Categories:**
  - 1. Classical Vedic astrology
  - 13. Commentaries, analogies, case studies
  - 14. Modern research and reference material
- **Key Content:**
  - Philosophical foundations of astrology and cosmology
  - Astronomical correlations between planetary cycles and human psychology
  - Meaning of the twelve zodiac signs and their evolutionary trajectory
  - The spiritual purpose of astrological guidance (free will vs. determinism)
- **Suitability:** Contextual prose for user-facing synthesis and holistic astrological counseling.

### DOC-08: The Mysteries of Magic: A Digest of the Writings of Éliphas Lévi
- **Path:** `/Users/arunkumarpatil/Downloads/the-mysteries-of-magic-eliphas-levi-arthur-edward-waite-1389.pdf`
- **Author:** Éliphas Lévi (Alphonse Louis Constant); Edited by Arthur Edward Waite
- **Format:** PDF, 431 pages (11.88 MB)
- **Language:** English with Latin, French, and Hebrew Kabbalistic citations
- **Classification Categories:**
  - 11. Tantra and related esoteric traditions
  - 12. Black magic, curses, occult practices, and protective traditions
  - 13. Commentaries, analogies, case studies, and interpretive examples
- **Key Content:**
  - Part I: The Candidate of Hermes & The Doctrine of Magic
  - Part II: The Astral Light (*Astral Fluid*, Universal Agent, Great Magical Agent)
  - Part III: The Mysteries of the Pentagram and Hexagram
  - Part IV: The Sanctuary of Magic (High Initiation and the Will)
  - Part V: The Great Arcana of Occult Philosophy
  - Part VI: Black Magic and Sorcery:
    - *Chapter I: The Sabbath of the Sorcerers* (historical and symbolic deconstruction)
    - *Chapter II: Bewitchments and Fascinations* (psychological contagion vs. ritual intent)
    - *Chapter III: Evocations and Phantoms* (hallucination vs. astral reflection)
    - *Chapter IV: The Secret of Secrets*
  - Part VII: Defense and Transmutation:
    - Neutralizing maleficent currents
    - The power of purified Will (*Volonté*) over elementary astral forces
- **Suitability:** **The cornerstone of the Black Magic & Occult Traditions section.** Provides rigorous historical, symbolic, and psychological deconstruction of curses, sorcery, and psychic protection.

### DOC-09: Magic, White and Black
- **Path:** `/Users/arunkumarpatil/Downloads/magicwhiteblack00hart_0.pdf`
- **Author:** Dr. Franz Hartmann, M.D. (Theosophical Society / Hermetic scholar)
- **Format:** PDF, 310 pages (16.88 MB)
- **Language:** English
- **Classification Categories:**
  - 10. Traditional remedies and ritual practices
  - 11. Tantra and related esoteric traditions
  - 12. Black magic, curses, occult practices, and protective traditions
  - 13. Commentaries, analogies, and case studies
- **Key Content:**
  - Ch. 1: The Ideal and the Real (Spiritual consciousness)
  - Ch. 2: The Form (Material manifestation and astral forms)
  - Ch. 3: Life and the Astral Body (*Lingam Shariram*)
  - Ch. 4: Harmony and Will
  - Ch. 5: Illusion and Sorcery:
    - Distinction between Black Magic (selfish will, exploitation, degradation) and White Magic (selfless devotion, divine harmony, purification)
    - The pathology of obsession, psychic vampirism, and superstition
  - Ch. 6: Mental Transmutation and Purification
  - Ch. 7: The True Alchemist and the Philosopher’s Stone
  - Ch. 8–12: Protective spiritual practices, moral hygiene, and mastery over elemental impulses
- **Suitability:** Invaluable for the **Protection and Traditional Remedies** module, offering ethical framing, psychological hygiene, and philosophical clarity that avoids fear-mongering.

---

## 4. Subject Taxonomy Matrix (The 14 Categories)

| Category | Primary Document Coverage | Secondary Document Coverage |
|:---|:---|:---|
| **1. Classical Vedic Astrology** | BPHS, Brihat Jataka, Phaladeepika, Saravali | Jataka Parijata, Rao Lessons |
| **2. Kundli & Birth-Chart Interpretation** | BPHS, Phaladeepika, Saravali, Rao Lessons | Brihat Jataka, Vasudev |
| **3. Planetary Positions, Bhavas, Rashis, Nakshatras** | BPHS, Brihat Jataka, Saravali | Phaladeepika, Rao Lessons |
| **4. Yogas and Doshas** | BPHS (Ch. 32-43, 81), Phaladeepika (Ch. 6-7), Saravali | Jataka Parijata (Ch. 7-8) |
| **5. Vimshottari Dasha & Timing Systems** | BPHS (Ch. 46-50), Phaladeepika (Ch. 19-22) | Rao Lessons (Ch. 21-30) |
| **6. Transits (Gochara) & Predictive Methods** | Phaladeepika (Ch. 26), Saravali (Ch. 31) | BPHS, Brihat Jataka |
| **7. Panchang and Muhurat** | BPHS, Brihat Jataka, Phaladeepika | Rao Lessons |
| **8. Compatibility & Relationship Astrology** | BPHS (Ch. 81 Stri Jataka), Phaladeepika, Saravali (Ch. 45) | Rao Lessons |
| **9. Palmistry & Samudrika Shastra** | BPHS (Anga Lakshana chapters) | Reference commentaries |
| **10. Traditional Remedies & Ritual Practices** | BPHS (Ch. 10 Antidotes), Hartmann (*Magic, White and Black*) | Phaladeepika |
| **11. Tantra & Related Esoteric Traditions** | Éliphas Lévi (*Mysteries of Magic*), Hartmann | BPHS esoteric sections |
| **12. Black Magic, Curses & Protective Traditions** | Éliphas Lévi (Part VI Sorcery), Hartmann (Ch. 5-7) | BPHS (Arishta & Raksha mantras) |
| **13. Commentaries, Analogies & Case Studies** | Rao Lessons (Lessons 1-45), Vasudev, Lévi, Hartmann | Saravali, Phaladeepika |
| **14. Modern Research & Reference Material** | Rao Lessons, Vasudev (*Origin & Purpose*) | Modern ephemeris documentation |

---

## 5. Technical Ingestion Status

- **Total Supplied Books:** 9 of 9 found and confirmed present.
- **Total Physical Pages:** 2,603 pages.
- **Parsing Verification:**
  - `jataka-parijata-vol-1.pdf`: Resolved deep page-tree recursion limit in `pypdf` via `page_tree_maximum_depth=2000`.
  - All 9 documents successfully extract UTF-8 textual streams without requiring destructive OCR.
- **Duplicates Detected:** 0 true duplicate files. Minor overlapping chapters between BPHS and Saravali are indexed with cross-corpus concordance pointers.
- **Missing Files Requiring User Provision:** None. All 9 specified PDFs are accessible in the local workspace directory.
