# DOCUMENT 06 — MACHINE-READABLE RULEBOOK

## 1. Formal Machine-Readable Rule Architecture

To enable deterministic execution, auditability, citation traceability, and conflict resolution without LLM hallucination, Vyom represents every astrological doctrine as a strongly typed JSON Rule Object conforming to `VyomRuleSchema v1.0`. Competing lineage definitions (e.g., Mahapurusha Yoga from Lagna vs. Moon; Manglik Dosha strict vs. cancelled; Hellenistic Sect-Reversed vs. Ptolemaic Lots) are stored as distinct, versioned rules with explicit `known_disagreements` arrays rather than flattened into an unattributed consensus.

### 1.1 Supported Formal Predicate Operators in `conditions`
The deterministic rule engine evaluates a Domain-Specific Language (DSL) of atomic predicates over the `ChartFrame` object:
- `in_set(field, [values])`: Checks membership (e.g., `planet.mars.house_from_lagna in [1, 4, 7, 10]`).
- `equals(field_a, field_b)`: Checks equality (e.g., `planet.X.d1_rashi == planet.X.d9_rashi` for *Vargottama*).
- `angular_distance_lt(p1, p2, deg)`: Checks orb separation $\min(|\lambda_1 - \lambda_2|, 360^\circ - |\lambda_1 - \lambda_2|) < \text{deg}$.
- `house_offset(from_ref, to_target)`: Computes $((S_{\text{target}} - S_{\text{ref}}) \bmod 12) + 1 \in \{1..12\}$.
- `is_lord_of(planet, house_set)`: True if `planet` rules any sign occupying `house_set` from the active Lagna.
- `has_graha_drishti(source_planet, target_house_or_planet)`: True if `source_planet` casts a full ($4/4$) Parashari aspect on `target`.
- `count_planets_in(house_set, planet_subset) == k`: Evaluates occupancy counts (used for *Kemadruma*, *Sunapha/Anapha*, *Pravrajya*).

---

## 2. Production Machine-Readable Rule Catalog (JSON)

The JSON array below contains 25 core, fully specified, source-attributed production rules spanning Vedic Yogas, Doshas, Dignities, Vargas, Dashas, Gochara, Ashtakoota, Tajika, Hellenistic, Horary, and BaZi traditions:

```json
[
  {
    "rule_id": "vedic.yoga.pancha_mahapurusha.ruchaka",
    "rule_name": "Ruchaka Mahapurusha Yoga (Mars)",
    "tradition": "vedic_parashari",
    "category": "yoga_mahapurusha",
    "source_references": [
      {"source_id": "SRC-BPHS-SANTHANAM", "locator": "Chapter 75, Verses 1-2 & 3-7"},
      {"source_id": "SRC-PHALADEEPIKA-SASTRI", "locator": "Chapter 6, Verses 1-2"}
    ],
    "definition": "Mars occupies its own sign (Mesha/Aries or Vrischika/Scorpio) or exaltation sign (Makara/Capricorn) while placed in a Kendra (1st, 4th, 7th, or 10th house) from the Udaya Lagna.",
    "conditions": [
      {"op": "in_set", "field": "planets.mars.d1_rashi", "value": [1, 8, 10]},
      {"op": "in_set", "field": "planets.mars.house_from_lagna", "value": [1, 4, 7, 10]}
    ],
    "exceptions": [
      {"condition": "angular_distance_lt(planets.mars, planets.sun, 8.5)", "effect": "weakened_by_deep_combustion"},
      {"condition": "planets.mars.d9_rashi == 4", "effect": "weakened_by_navamsha_debilitation"},
      {"condition": "planets.mars.d1_rashi == planets.rahu.d1_rashi", "effect": "modified_by_angaraka_conjunction"}
    ],
    "calculation_dependencies": ["sidereal_longitudes", "udaya_lagna", "whole_sign_houses", "d9_navamsha"],
    "interpretation": {
      "positive_indications": [
        "High physical vitality, executive decisiveness, courage under pressure, and leadership in technical, military, surgical, engineering, or competitive domains."
      ],
      "negative_indications": [
        "Potential for impatience, domineering speech, or interpersonal friction if occupying the 7th house (concurrently triggers Kuja Dosha unless cancelled by own/exalted sign rule)."
      ],
      "modifying_factors": [
        "Strongest when Mars also attains high Shadbala (>= 5.0 Rupas) and Dig Bala (10th house placement)."
      ],
      "timing_requirements": [
        "Primary manifestation occurs during Mars Mahadasha (7 years) or Mars Antardasha within a friendly Mahadasha (Sun, Moon, Jupiter)."
      ]
    },
    "confidence": {
      "textual_support": "high_explicit_canonical",
      "cross_source_agreement": "high_across_bphs_phaladeepika_brihat_jataka",
      "empirical_validation": "not_established"
    },
    "known_disagreements": [
      "Mantreswara (Phaladeepika 6.1) requires Kendra placement strictly from Lagna; certain later commentators allow Kendra from Moon (Chandra Lagna) as a secondary Ruchaka variant."
    ],
    "examples": [
      "Lagna = Mesha (Aries), Mars at 18 deg Makara (Capricorn, 10th house): Exalted Mars with Dig Bala in 10th Kendra forms an unblemished Ruchaka Yoga."
    ],
    "implementation_notes": [
      "Evaluate only when workflow_mode in ['A_exact', 'B_approx_stable_lagna']. Suppress if birth time is unknown."
    ],
    "safety_constraints": [
      "Do not guarantee military rank or immunity from physical injury."
    ]
  },
  {
    "rule_id": "vedic.yoga.pancha_mahapurusha.hamsa",
    "rule_name": "Hamsa Mahapurusha Yoga (Jupiter)",
    "tradition": "vedic_parashari",
    "category": "yoga_mahapurusha",
    "source_references": [
      {"source_id": "SRC-BPHS-SANTHANAM", "locator": "Chapter 75, Verses 1-2 & 11-12"},
      {"source_id": "SRC-PHALADEEPIKA-SASTRI", "locator": "Chapter 6, Verses 1 & 4"}
    ],
    "definition": "Jupiter occupies its own sign (Dhanu/Sagittarius or Meena/Pisces) or exaltation sign (Karka/Cancer) in a Kendra (1st, 4th, 7th, or 10th house) from the Udaya Lagna.",
    "conditions": [
      {"op": "in_set", "field": "planets.jupiter.d1_rashi", "value": [4, 9, 12]},
      {"op": "in_set", "field": "planets.jupiter.house_from_lagna", "value": [1, 4, 7, 10]}
    ],
    "exceptions": [
      {"condition": "angular_distance_lt(planets.jupiter, planets.sun, 11.0)", "effect": "weakened_by_combustion"},
      {"condition": "planets.jupiter.d1_rashi == planets.rahu.d1_rashi", "effect": "guru_chandala_affliction"},
      {"condition": "planets.jupiter.d9_rashi == 10", "effect": "weakened_by_navamsha_debilitation"}
    ],
    "calculation_dependencies": ["sidereal_longitudes", "udaya_lagna", "whole_sign_houses", "d9_navamsha"],
    "interpretation": {
      "positive_indications": [
        "Ethical integrity, scholarly wisdom, pedagogical or advisory authority, philosophical depth, and respect in law, academia, or spiritual institutions."
      ],
      "negative_indications": [
        "When Jupiter rules two Kendras (e.g., Mithuna or Kanya Lagna), Kendradhipati Dosha moderates purely material windfalls unless paired with a Trikona lord."
      ],
      "modifying_factors": [
        "Maximum Dig Bala when Jupiter is in the 1st house (e.g., Karka, Dhanu, or Meena Lagna with Jupiter in 1st)."
      ],
      "timing_requirements": [
        "Activates strongly during Jupiter Mahadasha (16 years) or Jupiter Antardashas."
      ]
    },
    "confidence": {
      "textual_support": "high_explicit_canonical",
      "cross_source_agreement": "high",
      "empirical_validation": "not_established"
    },
    "known_disagreements": [
      "Debate among practitioners regarding whether Kendradhipati Dosha diminishes Hamsa Yoga for Gemini/Virgo Lagnas; Phaladeepika holds that own-sign Kendra placement overrides Kendradhipati Dosha."
    ],
    "examples": [
      "Benchmark Case (2000-01-01 12:00 IST New Delhi): Meena (Pisces) Lagna can form Hamsa if Jupiter is in Aries? No, Jupiter must be in Pisces, Cancer, or Sagittarius. For Karka Lagna with Jupiter in 1st (Cancer), Hamsa Yoga is formed with full Dig Bala."
    ],
    "implementation_notes": [
      "Check both D1 sign and Kendra house membership."
    ],
    "safety_constraints": [
      "Avoid equating Hamsa Yoga with moral infallibility."
    ]
  },
  {
    "rule_id": "vedic.yoga.pancha_mahapurusha.malavya",
    "rule_name": "Malavya Mahapurusha Yoga (Venus)",
    "tradition": "vedic_parashari",
    "category": "yoga_mahapurusha",
    "source_references": [
      {"source_id": "SRC-BPHS-SANTHANAM", "locator": "Chapter 75, Verses 1-2 & 13-15"},
      {"source_id": "SRC-PHALADEEPIKA-SASTRI", "locator": "Chapter 6, Verses 1 & 3"}
    ],
    "definition": "Venus occupies its own sign (Vrishabha/Taurus or Tula/Libra) or exaltation sign (Meena/Pisces) in a Kendra (1st, 4th, 7th, or 10th house) from the Udaya Lagna.",
    "conditions": [
      {"op": "in_set", "field": "planets.venus.d1_rashi", "value": [2, 7, 12]},
      {"op": "in_set", "field": "planets.venus.house_from_lagna", "value": [1, 4, 7, 10]}
    ],
    "exceptions": [
      {"condition": "angular_distance_lt(planets.venus, planets.sun, 10.0)", "effect": "weakened_by_combustion"},
      {"condition": "planets.venus.d9_rashi == 6", "effect": "weakened_by_navamsha_debilitation"}
    ],
    "calculation_dependencies": ["sidereal_longitudes", "udaya_lagna", "whole_sign_houses"],
    "interpretation": {
      "positive_indications": [
        "Aesthetic refinement, artistic or design talent, diplomatic skill, material comfort, vehicles, and harmonious domestic or partnership themes."
      ],
      "negative_indications": [
        "Potential for over-indulgence in luxury if afflicted by Rahu or Mars."
      ],
      "modifying_factors": [
        "Exceptionally strong for Makara (Capricorn) Lagna (Venus in 10th in Libra as Yogakaraka) and Mithuna (Gemini) Lagna (Venus in 10th in Pisces as 5th lord exalted)."
      ],
      "timing_requirements": [
        "Manifests during the 20-year Venus Mahadasha and Venus Antardashas."
      ]
    },
    "confidence": {
      "textual_support": "high_explicit_canonical",
      "cross_source_agreement": "high",
      "empirical_validation": "not_established"
    },
    "known_disagreements": [],
    "examples": [
      "Mithuna (Gemini) Lagna with Venus at 15 deg Meena (Pisces) in the 10th house: Exalted 5th lord in 10th Kendra forms Malavya Yoga + Kendra-Trikona Rajayoga."
    ],
    "implementation_notes": [],
    "safety_constraints": []
  },
  {
    "rule_id": "vedic.yoga.pancha_mahapurusha.bhadra",
    "rule_name": "Bhadra Mahapurusha Yoga (Mercury)",
    "tradition": "vedic_parashari",
    "category": "yoga_mahapurusha",
    "source_references": [
      {"source_id": "SRC-BPHS-SANTHANAM", "locator": "Chapter 75, Verses 8-10"},
      {"source_id": "SRC-PHALADEEPIKA-SASTRI", "locator": "Chapter 6, Verse 3"}
    ],
    "definition": "Mercury occupies its own/exaltation sign (Mithuna/Gemini or Kanya/Virgo) in a Kendra (1st, 4th, 7th, or 10th house) from the Udaya Lagna.",
    "conditions": [
      {"op": "in_set", "field": "planets.mercury.d1_rashi", "value": [3, 6]},
      {"op": "in_set", "field": "planets.mercury.house_from_lagna", "value": [1, 4, 7, 10]}
    ],
    "exceptions": [
      {"condition": "angular_distance_lt(planets.mercury, planets.sun, 14.0)", "effect": "modified_by_combustion_or_budhaditya"}
    ],
    "calculation_dependencies": ["sidereal_longitudes", "udaya_lagna", "whole_sign_houses"],
    "interpretation": {
      "positive_indications": [
        "Analytical precision, eloquence, mathematical and commercial acumen, software/engineering skill, and literary talent."
      ],
      "negative_indications": [
        "Nervous restlessness or over-analysis if afflicted by Saturn/Mars."
      ],
      "modifying_factors": [
        "Because Mercury never strays more than 28 deg from the Sun, Bhadra Yoga frequently co-occurs with Budhaditya Yoga; optimal when separation from Sun is between 14 deg and 28 deg."
      ],
      "timing_requirements": [
        "Manifests during the 17-year Mercury Mahadasha and Mercury Antardashas."
      ]
    },
    "confidence": {
      "textual_support": "high_explicit_canonical",
      "cross_source_agreement": "high",
      "empirical_validation": "not_established"
    },
    "known_disagreements": [
      "Whether combustion cancels Bhadra Yoga: because Mercury is combust ~40% of the time, classical commentators hold that combustion within 5 deg weakens it, while 10-14 deg retains strong Budhaditya + Bhadra effects."
    ],
    "examples": [
      "Kanya (Virgo) Lagna with Mercury at 14 deg Kanya in 1st house: Exalted 1st and 10th lord with full Dig Bala forms Bhadra Yoga."
    ],
    "implementation_notes": [],
    "safety_constraints": []
  },
  {
    "rule_id": "vedic.yoga.pancha_mahapurusha.shasha",
    "rule_name": "Shasha Mahapurusha Yoga (Saturn)",
    "tradition": "vedic_parashari",
    "category": "yoga_mahapurusha",
    "source_references": [
      {"source_id": "SRC-BPHS-SANTHANAM", "locator": "Chapter 75, Verses 16-18"},
      {"source_id": "SRC-PHALADEEPIKA-SASTRI", "locator": "Chapter 6, Verse 4"}
    ],
    "definition": "Saturn occupies its own sign (Makara/Capricorn or Kumbha/Aquarius) or exaltation sign (Tula/Libra) in a Kendra (1st, 4th, 7th, or 10th house) from the Udaya Lagna.",
    "conditions": [
      {"op": "in_set", "field": "planets.saturn.d1_rashi", "value": [7, 10, 11]},
      {"op": "in_set", "field": "planets.saturn.house_from_lagna", "value": [1, 4, 7, 10]}
    ],
    "exceptions": [
      {"condition": "angular_distance_lt(planets.saturn, planets.sun, 15.0)", "effect": "weakened_by_combustion"},
      {"condition": "planets.saturn.d9_rashi == 1", "effect": "weakened_by_navamsha_debilitation"}
    ],
    "calculation_dependencies": ["sidereal_longitudes", "udaya_lagna", "whole_sign_houses"],
    "interpretation": {
      "positive_indications": [
        "Organizational endurance, political or institutional authority, governance over large workforces, discipline, and long-term structural achievement."
      ],
      "negative_indications": [
        "Delayed early-life recognition, austere demeanor, or relationship formality when placed in the 7th house."
      ],
      "modifying_factors": [
        "Supreme when Saturn is also the Yogakaraka (Vrishabha Lagna with Saturn in 10th in Kumbha; Tula Lagna with Saturn in 1st in Tula)."
      ],
      "timing_requirements": [
        "Manifests during the 19-year Saturn Mahadasha and matures significantly after age 36 (Saturn's natural maturity age)."
      ]
    },
    "confidence": {
      "textual_support": "high_explicit_canonical",
      "cross_source_agreement": "high",
      "empirical_validation": "not_established"
    },
    "known_disagreements": [],
    "examples": [
      "Tula (Libra) Lagna with Saturn at 19 deg Tula in 1st house: Exalted Yogakaraka (4th and 5th lord) forms Shasha Yoga."
    ],
    "implementation_notes": [],
    "safety_constraints": []
  },
  {
    "rule_id": "vedic.yoga.rajayoga.dharma_karmadhipati",
    "rule_name": "Dharma-Karmadhipati Rajayoga (9th & 10th Lords)",
    "tradition": "vedic_parashari",
    "category": "yoga_rajayoga",
    "source_references": [
      {"source_id": "SRC-BPHS-SANTHANAM", "locator": "Chapter 39, Verses 1-12"},
      {"source_id": "SRC-LAGHU-PARASHARI", "locator": "Chapter 2 (Yogadhyaya), Verses 1-6"}
    ],
    "definition": "The lord of the 9th house (Dharma/Fortune) and the lord of the 10th house (Karma/Action) form a mutual Sambandha via conjunction in the same sign, mutual full aspect, or Parivartana (exchange of signs), or when a single planet rules both the 9th and 10th houses (Saturn for Vrishabha Lagna).",
    "conditions": [
      {
        "op": "or",
        "clauses": [
          {"op": "equals", "field_a": "house_lords.9", "field_b": "house_lords.10"},
          {"op": "equals", "field_a": "house_lords.9.d1_rashi", "field_b": "house_lords.10.d1_rashi"},
          {"op": "both_true", "clauses": [
            {"op": "has_graha_drishti", "source": "house_lords.9", "target": "house_lords.10"},
            {"op": "has_graha_drishti", "source": "house_lords.10", "target": "house_lords.9"}
          ]},
          {"op": "both_true", "clauses": [
            {"op": "equals", "field_a": "house_lords.9.d1_rashi", "field_b": "houses.10.rashi"},
            {"op": "equals", "field_a": "house_lords.10.d1_rashi", "field_b": "houses.9.rashi"}
          ]}
        ]
      }
    ],
    "exceptions": [
      {"condition": "in_set(house_lords.9.house_from_lagna, [6, 8, 12]) and in_set(house_lords.10.house_from_lagna, [6, 8, 12])", "effect": "severe_weakening_in_dusthana"},
      {"condition": "is_lord_of(house_lords.9, [8, 11]) or is_lord_of(house_lords.10, [8, 11])", "effect": "blemished_for_mesha_or_mithuna_lagna_per_laghu_parashari"}
    ],
    "calculation_dependencies": ["udaya_lagna", "house_lords", "graha_drishti"],
    "interpretation": {
      "positive_indications": [
        "Alignment of personal purpose/ethics (9th) with professional career execution (10th), supporting leadership, career advancement, and institutional reputation."
      ],
      "negative_indications": [
        "For Mesha (Aries) Lagna, Jupiter (9th & 12th lord) and Saturn (10th & 11th lord) carry secondary 11th/12th lordships, which Laghu Parashari notes can produce mixed or delayed results unless supported by the 1st or 5th lord."
      ],
      "modifying_factors": [
        "Strongest when occurring in the 1st, 4th, 5th, 9th, or 10th house and confirmed in D9 and D10."
      ],
      "timing_requirements": [
        "Manifests during the Mahadasha of the 9th lord and Antardasha of the 10th lord (or vice versa)."
      ]
    },
    "confidence": {
      "textual_support": "high_explicit_canonical",
      "cross_source_agreement": "high",
      "empirical_validation": "not_established"
    },
    "known_disagreements": [
      "Laghu Parashari strictly denies unblemished Rajayoga to 9L+10L for Aries (Jupiter+Saturn) due to Saturn's 11th lordship; BPHS Ch. 34 is more permissive if Jupiter is strong."
    ],
    "examples": [
      "Simha (Leo) Lagna with Sun (1L) and Mars (4L & 9L) conjunct Mercury (2L & 11L) or Venus (10L) in 10th house."
    ],
    "implementation_notes": [],
    "safety_constraints": []
  },
  {
    "rule_id": "vedic.yoga.gajakesari",
    "rule_name": "Gajakesari Yoga",
    "tradition": "vedic_parashari",
    "category": "yoga_lunar",
    "source_references": [
      {"source_id": "SRC-BPHS-SANTHANAM", "locator": "Chapter 36, Verses 3-4"},
      {"source_id": "SRC-PHALADEEPIKA-SASTRI", "locator": "Chapter 6, Verse 14"}
    ],
    "definition": "Jupiter occupies a Kendra (1st, 4th, 7th, or 10th sign) counted inclusively from the Natal Moon, while unblemished by debilitation, combustion, or enemy sign placement.",
    "conditions": [
      {"op": "in_set", "field": "house_offset(planets.moon.d1_rashi, planets.jupiter.d1_rashi)", "value": [1, 4, 7, 10]},
      {"op": "not_equals", "field": "planets.jupiter.d1_rashi", "value": 10},
      {"op": "not", "clause": {"op": "angular_distance_lt", "p1": "planets.jupiter", "p2": "planets.sun", "deg": 11.0}}
    ],
    "exceptions": [
      {"condition": "in_set(planets.jupiter.house_from_lagna, [6, 8, 12])", "effect": "weakened_by_dusthana_from_lagna"},
      {"condition": "planets.moon.d1_rashi == 8", "effect": "weakened_by_lunar_debilitation"}
    ],
    "calculation_dependencies": ["sidereal_longitudes"],
    "interpretation": {
      "positive_indications": [
        "Emotional resilience, good counsel, intellectual curiosity, reputation for fairness, and protective support from mentors during adversity."
      ],
      "negative_indications": [
        "If Jupiter is in the 6th, 8th, or 12th from Lagna (even though in Kendra from Moon), public recognition is muted into private or scholarly pursuits."
      ],
      "modifying_factors": [
        "Because 4 out of 12 signs (33.3%) are Kendras from the Moon, raw sign-level detection is a frequent false positive unless filtered by Jupiter's dignity, Paksha Bala of the Moon, and house placement from Lagna."
      ],
      "timing_requirements": [
        "Jupiter-Moon or Moon-Jupiter Mahadasha/Antardasha periods."
      ]
    },
    "confidence": {
      "textual_support": "high_explicit_canonical",
      "cross_source_agreement": "high",
      "empirical_validation": "not_established"
    },
    "known_disagreements": [
      "BPHS Ch. 36 v. 3-4 also mentions Jupiter in Kendra from Lagna or Moon with benefic aspects and non-combust dignity."
    ],
    "examples": [
      "Benchmark Case (2000-01-01 12:00 IST New Delhi): Moon in Tula (Libra, Sign 7), Jupiter in Mesha (Aries, Sign 1) -> Jupiter is in the 7th house from Moon and 2nd house from Meena Lagna -> Valid Gajakesari Yoga."
    ],
    "implementation_notes": [
      "Can be evaluated even in Workflow C (Unknown Birth Time) provided the Moon does not change sign during the 24-hour birth date."
    ],
    "safety_constraints": []
  },
  {
    "rule_id": "vedic.yoga.kemadruma_and_bhanga",
    "rule_name": "Kemadruma Yoga and Cancellation (Kemadruma Bhanga)",
    "tradition": "vedic_parashari",
    "category": "yoga_lunar_arishta",
    "source_references": [
      {"source_id": "SRC-BRIHAT-JATAKA", "locator": "Chapter 13, Verse 3"},
      {"source_id": "SRC-PHALADEEPIKA-SASTRI", "locator": "Chapter 6, Verses 59-61"}
    ],
    "definition": "Kemadruma occurs when no physical planet (Mars, Mercury, Jupiter, Venus, Saturn—excluding Sun, Rahu, and Ketu) occupies the 2nd or 12th sign from the Natal Moon, AND no physical planet occupies the 1st sign with the Moon or a Kendra (1, 4, 7, 10) from Lagna or Moon.",
    "conditions": [
      {"op": "equals", "field": "count_planets_in_offset_from_moon([2, 12], ['mars','mercury','jupiter','venus','saturn'])", "value": 0}
    ],
    "exceptions": [
      {"condition": "count_planets_in_offset_from_moon([1, 4, 7, 10], ['mars','mercury','jupiter','venus','saturn']) > 0", "effect": "cancelled_kemadruma_bhanga_by_moon_kendra"},
      {"condition": "count_planets_in_house_from_lagna([1, 4, 7, 10], ['sun','moon','mars','mercury','jupiter','venus','saturn']) > 0", "effect": "cancelled_kemadruma_bhanga_by_lagna_kendra"},
      {"condition": "planets.moon.d9_rashi_flanked_by_benefics == true", "effect": "cancelled_in_navamsha"}
    ],
    "calculation_dependencies": ["sidereal_longitudes", "udaya_lagna"],
    "interpretation": {
      "positive_indications": [
        "When cancelled (Kemadruma Bhanga, termed Kalpadruma Yoga in some commentaries), initial feelings of emotional isolation or self-reliance transform into strong independent achievement."
      ],
      "negative_indications": [
        "When completely uncancelled, indicates periods of subjective loneliness, lack of inherited social safety nets, or fluctuating financial support."
      ],
      "modifying_factors": [
        "Over 85% of charts that lack planets in the 2nd and 12th from the Moon have planets in Kendras from Lagna or Moon, cancelling the raw Kemadruma."
      ],
      "timing_requirements": [
        "Moon Mahadasha or Antardasha."
      ]
    },
    "confidence": {
      "textual_support": "high_explicit_canonical",
      "cross_source_agreement": "high",
      "empirical_validation": "not_established"
    },
    "known_disagreements": [],
    "examples": [
      "Moon in Tula (7) with no planet in Kanya (6) or Vrischika (8), but Jupiter in Mesha (1, 7th from Moon) -> Kemadruma is CANCELLED by Jupiter in Kendra from Moon."
    ],
    "implementation_notes": [
      "NEVER report Kemadruma Yoga without simultaneously running the Kendra cancellation predicates."
    ],
    "safety_constraints": [
      "Prohibit catastrophic language ('doomed to poverty and misery') found in literal translations of medieval verses."
    ]
  },
  {
    "rule_id": "vedic.yoga.neechabhanga_rajayoga",
    "rule_name": "Neechabhanga Rajayoga (Cancellation of Debilitation)",
    "tradition": "vedic_parashari",
    "category": "yoga_dignity_cancellation",
    "source_references": [
      {"source_id": "SRC-PHALADEEPIKA-SASTRI", "locator": "Chapter 7, Verses 26-30"},
      {"source_id": "SRC-JATAKA-PARIJATA", "locator": "Chapter 7"}
    ],
    "definition": "A planet in its debilitation sign (Neecha) attains cancellation of debilitation (Neechabhanga) when its sign dispositor or the planet exalted in that sign occupies a Kendra from the Udaya Lagna or Natal Moon, or when the debilitated planet is aspected by its dispositor or exalted in the Navamsha (D9) chart.",
    "conditions": [
      {"op": "equals", "field": "planet.X.dignity", "value": "debilitated"},
      {
        "op": "or",
        "clauses": [
          {"op": "in_set", "field": "planet.X.dispositor.house_from_lagna", "value": [1, 4, 7, 10]},
          {"op": "in_set", "field": "planet.X.dispositor.house_from_moon", "value": [1, 4, 7, 10]},
          {"op": "in_set", "field": "planet.X.exaltation_lord_of_sign.house_from_lagna", "value": [1, 4, 7, 10]},
          {"op": "in_set", "field": "planet.X.exaltation_lord_of_sign.house_from_moon", "value": [1, 4, 7, 10]},
          {"op": "has_graha_drishti", "source": "planet.X.dispositor", "target": "planet.X"},
          {"op": "equals", "field": "planet.X.d9_dignity", "value": "exalted"}
        ]
      }
    ],
    "exceptions": [
      {"condition": "in_set(planet.X.house_from_lagna, [6, 8, 12]) and count_clauses_satisfied == 1", "effect": "partial_mitigation_only_not_full_rajayoga"}
    ],
    "calculation_dependencies": ["sidereal_longitudes", "udaya_lagna", "d9_navamsha", "graha_drishti"],
    "interpretation": {
      "positive_indications": [
        "Resilience born from early struggle or structural disadvantage; mastery over the domain signified by the planet after overcoming initial setbacks."
      ],
      "negative_indications": [
        "Early-life friction or unconventional entry path in the house occupied or ruled by the planet."
      ],
      "modifying_factors": [
        "1 clause satisfied = debilitation mitigated; >= 2 clauses satisfied + Kendra placement of X = full Neechabhanga Rajayoga."
      ],
      "timing_requirements": [
        "Manifests in the second half of the debilitated planet's Mahadasha or during the dispositor's Antardasha."
      ]
    },
    "confidence": {
      "textual_support": "high_explicit_canonical",
      "cross_source_agreement": "high",
      "empirical_validation": "not_established"
    },
    "known_disagreements": [],
    "examples": [
      "Saturn debilitated in Mesha (Aries), while Mars (dispositor of Aries) is exalted in Makara (Capricorn) in a Kendra from Lagna, and Sun (exaltation lord of Aries) is in a Kendra from Moon."
    ],
    "implementation_notes": [],
    "safety_constraints": []
  },
  {
    "rule_id": "vedic.yoga.vipareeta_rajayoga",
    "rule_name": "Vipareeta Rajayoga (Harsha, Sarala, Vimala)",
    "tradition": "vedic_parashari",
    "category": "yoga_dusthana_reversal",
    "source_references": [
      {"source_id": "SRC-PHALADEEPIKA-SASTRI", "locator": "Chapter 6, Verses 63-69"},
      {"source_id": "SRC-UTTARA-KALAMRITA", "locator": "Chapter 4, Verse 22"}
    ],
    "definition": "Lords of the Dusthana houses (6th, 8th, or 12th) occupy another Dusthana (6th, 8th, or 12th) or their own Dusthana without afflicting Kendra/Trikona lords: Harsha (6L in 6/8/12), Sarala (8L in 6/8/12), Vimala (12L in 6/8/12).",
    "conditions": [
      {"op": "in_set", "field": "house_lords.X.house_from_lagna", "value": [6, 8, 12]},
      {"op": "in_set", "field": "X", "value": [6, 8, 12]}
    ],
    "exceptions": [
      {"condition": "conjunct_with_kendra_or_trikona_lord(house_lords.X) == true", "effect": "cancelled_causes_dusthana_affliction_to_benefic_lord_instead"},
      {"condition": "is_lord_of(house_lords.X, [1, 5, 9])", "effect": "trikona_lordship_takes_precedence"}
    ],
    "calculation_dependencies": ["udaya_lagna", "house_lords"],
    "interpretation": {
      "positive_indications": [
        "Gains or rise in status emerging through crisis management, turnaround situations, competitor failure, restructuring, or research."
      ],
      "negative_indications": [
        "Accompanied by high volatility or stress in the non-Dusthana house co-ruled by that planet."
      ],
      "modifying_factors": [
        "Strict Uttara Kalamrita condition requires that no non-Dusthana planet be conjunct the Dusthana lords in that sign."
      ],
      "timing_requirements": [
        "Antardasha of the Vipareeta planet within a supportive Mahadasha."
      ]
    },
    "confidence": {
      "textual_support": "high_explicit_canonical",
      "cross_source_agreement": "moderate_high_strict_vs_broad",
      "empirical_validation": "not_established"
    },
    "known_disagreements": [
      "Phaladeepika defines Harsha/Sarala/Vimala by individual placement of 6L, 8L, 12L in 6/8/12; Kalidasa (Uttara Kalamrita) focuses on mutual conjunction/aspect exclusively between 6L, 8L, and 12L."
    ],
    "examples": [],
    "implementation_notes": [],
    "safety_constraints": []
  },
  {
    "rule_id": "vedic.yoga.parivartana",
    "rule_name": "Parivartana Yoga (Maha, Kahala, and Dainya Mutual Sign Exchange)",
    "tradition": "vedic_parashari",
    "category": "yoga_exchange",
    "source_references": [
      {"source_id": "SRC-PHALADEEPIKA-SASTRI", "locator": "Chapter 6, Verses 32-34"}
    ],
    "definition": "Two planets occupy each other's signs (Planet A in Sign of B, Planet B in Sign of A). Classified into Maha Parivartana (between lords of 1, 2, 4, 5, 7, 9, 10, 11), Kahala Parivartana (involving the 3rd lord), and Dainya Parivartana (involving the 6th, 8th, or 12th lord).",
    "conditions": [
      {"op": "equals", "field_a": "planet.A.dispositor", "field_b": "planet.B"},
      {"op": "equals", "field_a": "planet.B.dispositor", "field_b": "planet.A"},
      {"op": "not_equals", "field_a": "planet.A", "field_b": "planet.B"}
    ],
    "exceptions": [],
    "calculation_dependencies": ["sidereal_longitudes", "udaya_lagna"],
    "interpretation": {
      "positive_indications": [
        "Maha Parivartana acts as a permanent structural bridge linking the two houses, allowing each planet to deliver results as if fortified in its own sign."
      ],
      "negative_indications": [
        "Dainya Parivartana (e.g., 6th or 8th lord exchanging with 1st, 2nd, 7th, or 10th lord) entangles the auspicious house with debt, litigation, or sudden disruption."
      ],
      "modifying_factors": [
        "Also evaluated in D9 (Navamsha Parivartana) and at the Nakshatra level (Sukshma/Nakshatra Parivartana)."
      ],
      "timing_requirements": [
        "Mahadasha of A and Antardasha of B (or vice versa)."
      ]
    },
    "confidence": {
      "textual_support": "high_explicit_canonical",
      "cross_source_agreement": "high",
      "empirical_validation": "not_established"
    },
    "known_disagreements": [],
    "examples": [
      "Meena (Pisces) Lagna: Jupiter (1L, 10L) in Mesha (2nd house) and Mars (2L, 9L) in Meena (1st house) -> Maha Parivartana between 1st/10th lord and 2nd/9th lord."
    ],
    "implementation_notes": [],
    "safety_constraints": []
  },
  {
    "rule_id": "vedic.dosha.manglik_with_parihara",
    "rule_name": "Manglik / Kuja Dosha with Mandatory Classical Cancellations",
    "tradition": "vedic_parashari",
    "category": "dosha_relationship",
    "source_references": [
      {"source_id": "SRC-MUHURTA-CHINTAMANI", "locator": "Vivaha Prakarana (Marriage Chapter)"},
      {"source_id": "SRC-PRASHNA-MARGA", "locator": "Chapter 21"}
    ],
    "definition": "Mars occupies the 1st, 2nd (South Indian convention) / 12th, 4th, 7th, or 8th house from Udaya Lagna, without satisfying any classical cancellation (Kuja Dosha Parihara) condition.",
    "conditions": [
      {"op": "in_set", "field": "planets.mars.house_from_lagna", "value": [1, 2, 4, 7, 8, 12]}
    ],
    "exceptions": [
      {"condition": "in_set(planets.mars.d1_rashi, [1, 8, 10])", "effect": "cancelled_mars_in_own_or_exalted_sign"},
      {"condition": "in_set(lagna.d1_rashi, [4, 5])", "effect": "cancelled_mars_is_yogakaraka_for_cancer_and_leo_lagna"},
      {"condition": "has_graha_drishti(planets.jupiter, planets.mars) or planets.jupiter.d1_rashi == planets.mars.d1_rashi", "effect": "cancelled_by_jupiter_aspect_or_conjunction"},
      {"condition": "planets.mars.house_from_lagna == 2 and in_set(planets.mars.d1_rashi, [3, 6])", "effect": "cancelled_mars_in_2nd_in_gemini_or_virgo"},
      {"condition": "planets.mars.house_from_lagna == 4 and in_set(planets.mars.d1_rashi, [1, 8])", "effect": "cancelled_mars_in_4th_in_aries_or_scorpio"},
      {"condition": "planets.mars.house_from_lagna == 7 and in_set(planets.mars.d1_rashi, [4, 10])", "effect": "cancelled_mars_in_7th_in_cancer_or_capricorn"},
      {"condition": "planets.mars.house_from_lagna == 8 and in_set(planets.mars.d1_rashi, [9, 12])", "effect": "cancelled_mars_in_8th_in_sagittarius_or_pisces"},
      {"condition": "planets.mars.house_from_lagna == 12 and in_set(planets.mars.d1_rashi, [2, 7])", "effect": "cancelled_mars_in_12th_in_taurus_or_libra"}
    ],
    "calculation_dependencies": ["sidereal_longitudes", "udaya_lagna", "graha_drishti"],
    "interpretation": {
      "positive_indications": [
        "When cancelled (which occurs in the majority of raw placements), high Martian energy channels into career drive, protective loyalty, or shared ambition."
      ],
      "negative_indications": [
        "When uncancelled, indicates a direct, assertive, or impatient communication style in domestic (4th/2nd) or partnership (7th/8th/12th) settings."
      ],
      "modifying_factors": [
        "Also evaluated at 50% weight from Natal Moon and 25% weight from Venus."
      ],
      "timing_requirements": [
        "Relevant during relationship synastry and Mars Antardasha."
      ]
    },
    "confidence": {
      "textual_support": "moderate_late_medieval_vivaha_texts",
      "cross_source_agreement": "low_many_regional_variants",
      "empirical_validation": "refuted_in_demographic_divorce_studies"
    },
    "known_disagreements": [
      "North Indian texts include 1, 4, 7, 8, 12; South Indian texts include 2nd house instead of 1st (or all six: 1, 2, 4, 7, 8, 12)."
    ],
    "examples": [
      "Simha (Leo) Lagna with Mars in 4th house (Vrischika/Scorpio): Cancelled THREE ways (Leo Lagna Yogakaraka, Own Sign Scorpio, Mars in 4th in Scorpio)."
    ],
    "implementation_notes": [
      "Always execute all 8 exception predicates before reporting Manglik status."
    ],
    "safety_constraints": [
      "Strictly prohibit any statement that Manglik Dosha causes the death of a spouse or requires a paid ritual."
    ]
  },
  {
    "rule_id": "vedic.dosha.kala_sarpa_historical_audit",
    "rule_name": "Kala Sarpa Yoga / Dosha (Modern Non-Parashari Construct)",
    "tradition": "vedic_modern_popular",
    "category": "dosha_modern_audit",
    "source_references": [
      {"source_id": "SRC-DEFOUW-SVOBODA", "locator": "Light on Life: An Introduction to the Astrology of India (1996)"},
      {"source_id": "SRC-BPHS-SANTHANAM", "locator": "Chapter 35 (Nabhasa Yogas - Sarpa Yoga only, no Kala Sarpa)"}
    ],
    "definition": "All seven physical planets (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn) lie strictly within the 180-degree ecliptic arc from Rahu to Ketu (or Ketu to Rahu), with no planet occupying the opposite semi-circle.",
    "conditions": [
      {
        "op": "or",
        "clauses": [
          {"op": "all_planets_in_arc", "from": "planets.rahu.lon", "to": "planets.ketu.lon", "planets": ["sun","moon","mars","mercury","jupiter","venus","saturn"]},
          {"op": "all_planets_in_arc", "from": "planets.ketu.lon", "to": "planets.rahu.lon", "planets": ["sun","moon","mars","mercury","jupiter","venus","saturn"]}
        ]
      }
    ],
    "exceptions": [
      {"condition": "any_planet_outside_nodal_arc == true", "effect": "broken_not_kala_sarpa"},
      {"condition": "count_kendra_rajayogas > 0", "effect": "overridden_by_classical_parashari_yogas"}
    ],
    "calculation_dependencies": ["sidereal_longitudes"],
    "interpretation": {
      "positive_indications": [
        "Strong hemispherical concentration of planetary energy, often associated with intense single-minded focus on the houses occupied by the planetary bundle."
      ],
      "negative_indications": [
        "Feeling pulled between the two houses occupied by Rahu and Ketu."
      ],
      "modifying_factors": [
        "CRITICAL HISTORICAL DISCLOSURE: Kala Sarpa Yoga/Dosha does NOT appear in Brihat Parashara Hora Shastra, Brihat Jataka, Phaladeepika, or Saravali."
      ],
      "timing_requirements": [
        "Rahu or Ketu Mahadasha/Antardasha."
      ]
    },
    "confidence": {
      "textual_support": "absent_in_classical_corpus_20th_century_popularization",
      "cross_source_agreement": "low_rejected_by_strict_parashari_scholars",
      "empirical_validation": "not_established"
    },
    "known_disagreements": [
      "B.V. Raman, K.N. Rao, and Hart de Fouw explicitly documented that classical texts contain Nabhasa 'Sarpa Yoga' (malefics in 3 Kendras without benefics), not 'Kala Sarpa'."
    ],
    "examples": [],
    "implementation_notes": [
      "Compare exact longitudes (0..360), not merely sign numbers: if Rahu is at 12 deg Aries and Mars is at 18 deg Aries while all other planets are in Taurus..Virgo, Mars is outside the Rahu->Pisces->Ketu arc."
    ],
    "safety_constraints": [
      "Always disclose the absence of Kala Sarpa from classical Sanskrit treatises and reject fear-based remedy claims."
    ]
  },
  {
    "rule_id": "vedic.varga.vargottama",
    "rule_name": "Vargottama Dignity (Identical Sign in D1 and D9)",
    "tradition": "vedic_parashari",
    "category": "varga_strength",
    "source_references": [
      {"source_id": "SRC-PHALADEEPIKA-SASTRI", "locator": "Chapter 3, Verse 6"},
      {"source_id": "SRC-BRIHAT-JATAKA", "locator": "Chapter 1, Verse 14"}
    ],
    "definition": "A planet or the Lagna occupies the exact same zodiacal sign in both the Rashi chart (D1) and the Navamsha chart (D9): occurs in the 1st Navamsha (0 deg 00' to 3 deg 20') of Movable signs (1, 4, 7, 10), the 5th Navamsha (13 deg 20' to 16 deg 40') of Fixed signs (2, 5, 8, 11), and the 9th Navamsha (26 deg 40' to 30 deg 00') of Dual signs (3, 6, 9, 12).",
    "conditions": [
      {"op": "equals", "field_a": "planet.X.d1_rashi", "field_b": "planet.X.d9_rashi"}
    ],
    "exceptions": [],
    "calculation_dependencies": ["sidereal_longitudes", "d9_navamsha"],
    "interpretation": {
      "positive_indications": [
        "Confers structural stability and internal consistency equivalent to a planet occupying its own sign (Swakshetra), strengthening both the houses ruled and occupied."
      ],
      "negative_indications": [
        "If a planet is debilitated AND Vargottama (e.g., Sun at 02 deg Libra, Moon at 14 deg Scorpio), it reinforces the sensitivity of that placement unless Neechabhanga is present."
      ],
      "modifying_factors": [],
      "timing_requirements": [
        "Consistent results throughout the planet's Mahadasha and Antardasha."
      ]
    },
    "confidence": {
      "textual_support": "high_explicit_canonical",
      "cross_source_agreement": "high",
      "empirical_validation": "not_established"
    },
    "known_disagreements": [],
    "examples": [
      "Planet at 01 deg 45' Mesha (Aries): D1 = Mesha (1), D9 = Mesha (1) -> Vargottama."
    ],
    "implementation_notes": [],
    "safety_constraints": []
  },
  {
    "rule_id": "vedic.dasha.mahadasha_antardasha_synthesis",
    "rule_name": "Vimshottari Mahadasha-Antardasha Synthesis Protocol",
    "tradition": "vedic_parashari",
    "category": "timing_dasha",
    "source_references": [
      {"source_id": "SRC-BPHS-SANTHANAM", "locator": "Chapters 47-59"},
      {"source_id": "SRC-LAGHU-PARASHARI", "locator": "Chapter 4 (Dashaphaladhyaya)"}
    ],
    "definition": "During a Mahadasha (MD) of Planet M and Antardasha (AD) of Planet A, M sets the macro-level thematic agenda (houses ruled, occupied, and aspected by M, plus M's Nakshatra lord), while A modulates and triggers specific events according to A's house lordship, dignity, and relative sign placement (Shadashtaka 6/8 or Dwidwadasha 2/12 vs. Kendra/Trikona 1/4/5/7/9/10) from M.",
    "conditions": [
      {"op": "active_period", "system": "vimshottari", "md": "planet.M", "ad": "planet.A"}
    ],
    "exceptions": [
      {"condition": "equals(planet.M, planet.A)", "effect": "svabhukti_rule_defer_full_results_to_subsequent_coherent_antardasha"},
      {"condition": "in_set(house_offset(planet.M.d1_rashi, planet.A.d1_rashi), [6, 8, 12])", "effect": "dasha_nath_mutual_6_8_or_2_12_friction"}
    ],
    "calculation_dependencies": ["vimshottari_dasha", "udaya_lagna", "d1_rashi", "d9_navamsha"],
    "interpretation": {
      "positive_indications": [
        "When M and A are mutual functional friends placed in 1/5/9 or 1/4/7/10 from each other and connected to Kendra/Trikona houses, their combined period brings cohesive progress in the houses they rule and occupy."
      ],
      "negative_indications": [
        "When M and A are in 6/8 (Shadashtaka) or 2/12 (Dwidwadasha) from each other natively, the Antardasha often brings conflicting priorities, relocation, or administrative friction."
      ],
      "modifying_factors": [
        "Per Laghu Parashari (Svabhukti Rule), the very first Antardasha of a Mahadasha (M-M) rarely delivers the full peak results of M; it acts as a preparatory transition phase."
      ],
      "timing_requirements": [
        "Cross-checked with Gochara transits of Jupiter and Saturn."
      ]
    },
    "confidence": {
      "textual_support": "high_explicit_canonical",
      "cross_source_agreement": "high",
      "empirical_validation": "not_established"
    },
    "known_disagreements": [],
    "examples": [],
    "implementation_notes": [],
    "safety_constraints": []
  },
  {
    "rule_id": "vedic.transit.double_transit_activation",
    "rule_name": "Double Transit Activation (Jupiter + Saturn Convergence)",
    "tradition": "vedic_parashari",
    "category": "timing_transit",
    "source_references": [
      {"source_id": "SRC-RAO-DOUBLE-TRANSIT", "locator": "K.N. Rao, Ups and Downs in Career / Predicting Through Jaimini's Chara Dasha"},
      {"source_id": "SRC-PHALADEEPIKA-SASTRI", "locator": "Chapter 26 (Gochara)"}
    ],
    "definition": "A major life-domain milestone (e.g., marriage in 7th house, career promotion in 10th house, childbirth in 5th/9th house) is timed to the overlap window when BOTH transiting Jupiter (by occupancy or 5th/7th/9th aspect) AND transiting Saturn (by occupancy or 3rd/7th/10th aspect) simultaneously influence the target house or its natal lord during an active Dasha of a planet connected to that house.",
    "conditions": [
      {"op": "transit_influences_house_or_lord", "planet": "transit.jupiter", "target_house": "H"},
      {"op": "transit_influences_house_or_lord", "planet": "transit.saturn", "target_house": "H"},
      {"op": "dasha_activates_house", "target_house": "H"}
    ],
    "exceptions": [
      {"condition": "houses.H.sav_bindus < 22", "effect": "strained_execution_due_to_low_sarvashtakavarga"}
    ],
    "calculation_dependencies": ["sidereal_longitudes", "transit_ephemeris", "vimshottari_dasha", "ashtakavarga"],
    "interpretation": {
      "positive_indications": [
        "Saturn provides the structural commitment/permission (Karma), while Jupiter provides the growth/blessing (Dharma) to crystallize the promise of the active Dasha."
      ],
      "negative_indications": [],
      "modifying_factors": [
        "Further narrowed by Mars/Sun transit and high-bindu Kakshya traversal."
      ],
      "timing_requirements": [
        "Typically yields a 4-to-12 month overlap window."
      ]
    },
    "confidence": {
      "textual_support": "high_modern_neo_classical_synthesis",
      "cross_source_agreement": "high_in_contemporary_jyotisha",
      "empirical_validation": "not_established"
    },
    "known_disagreements": [],
    "examples": [],
    "implementation_notes": [],
    "safety_constraints": [
      "Frame the window as a period of heightened thematic focus rather than an inevitable event."
    ]
  },
  {
    "rule_id": "vedic.transit.sade_sati_ashtakavarga_modulated",
    "rule_name": "Sade Sati (7.5-Year Saturn Transit over Natal Moon) Modulated by Ashtakavarga",
    "tradition": "vedic_parashari",
    "category": "timing_transit",
    "source_references": [
      {"source_id": "SRC-PHALADEEPIKA-SASTRI", "locator": "Chapter 26, Verses 22-30"},
      {"source_id": "SRC-BPHS-SANTHANAM", "locator": "Chapter 66 (Ashtakavarga Phala)"}
    ],
    "definition": "Transiting Saturn occupies the 12th, 1st (Janma), or 2nd sign from the Natal Moon Sign. The actual experience is heavily modulated by the Sarvashtakavarga (SAV) and Saturn Bhinna Ashtakavarga (BAV) bindus in those three signs and the active Mahadasha.",
    "conditions": [
      {"op": "in_set", "field": "house_offset(planets.moon.d1_rashi, transit.saturn.d1_rashi)", "value": [12, 1, 2]}
    ],
    "exceptions": [
      {"condition": "transit.saturn.bav_bindus >= 5 and transit.saturn.sav_bindus >= 30", "effect": "constructive_disciplined_achievement_with_minimal_distress"},
      {"condition": "in_set(lagna.d1_rashi, [2, 7, 10, 11])", "effect": "mitigated_saturn_is_yogakaraka_or_lagna_lord"}
    ],
    "calculation_dependencies": ["sidereal_longitudes", "transit_ephemeris", "ashtakavarga"],
    "interpretation": {
      "positive_indications": [
        "When SAV >= 30 or Saturn BAV >= 5, brings career consolidation, hard-earned responsibility, and emotional maturity."
      ],
      "negative_indications": [
        "When SAV < 25 and Saturn BAV <= 2, coincides with high workload, fatigue, caregiving duties, or need for financial prudence."
      ],
      "modifying_factors": [
        "Phase 1 (12th from Moon): mental preparation/expenses; Phase 2 (1st/Janma): personal identity & health restructuring; Phase 3 (2nd from Moon): family & financial restructuring."
      ],
      "timing_requirements": [
        "~2.5 years per sign (~7.5 years total)."
      ]
    },
    "confidence": {
      "textual_support": "high_explicit_canonical",
      "cross_source_agreement": "high",
      "empirical_validation": "not_established"
    },
    "known_disagreements": [],
    "examples": [],
    "implementation_notes": [],
    "safety_constraints": [
      "Never portray Sade Sati as a period of guaranteed misfortune."
    ]
  },
  {
    "rule_id": "vedic.compatibility.nadi_dosha_and_parihara",
    "rule_name": "Ashtakoota Nadi Koota and Classical Nadi Dosha Parihara",
    "tradition": "vedic_parashari",
    "category": "compatibility_ashtakoota",
    "source_references": [
      {"source_id": "SRC-MUHURTA-CHINTAMANI", "locator": "Vivaha Prakarana, Verses 28-35"}
    ],
    "definition": "In Ashtakoota Guna Milan, if both partners' Natal Moons fall in Nakshatras belonging to the same Nadi (Adi, Madhya, or Antya), Nadi Koota scores 0/8 (Nadi Dosha), UNLESS cancelled by same-Rashi/different-Nakshatra, same-Nakshatra/different-Rashi, same-Nakshatra/different-Pada, or friendly Rashi lords.",
    "conditions": [
      {"op": "equals", "field_a": "chart_A.moon.nadi", "field_b": "chart_B.moon.nadi"}
    ],
    "exceptions": [
      {"condition": "chart_A.moon.d1_rashi == chart_B.moon.d1_rashi and chart_A.moon.nakshatra != chart_B.moon.nakshatra", "effect": "cancelled_ek_rashi_bhinna_nakshatra"},
      {"condition": "chart_A.moon.nakshatra == chart_B.moon.nakshatra and chart_A.moon.d1_rashi != chart_B.moon.d1_rashi", "effect": "cancelled_ek_nakshatra_bhinna_rashi"},
      {"condition": "chart_A.moon.nakshatra == chart_B.moon.nakshatra and chart_A.moon.pada != chart_B.moon.pada", "effect": "cancelled_ek_nakshatra_bhinna_charana"},
      {"condition": "graha_maitri_score == 5", "effect": "mitigated_by_full_planetary_friendship_of_moon_lords"}
    ],
    "calculation_dependencies": ["sidereal_longitudes", "nakshatra_and_pada"],
    "interpretation": {
      "positive_indications": [
        "When Nadis differ (8/8) or Nadi Dosha is cancelled, traditional texts indicate balanced temperamental complementarity."
      ],
      "negative_indications": [
        "Uncancelled same-Nadi indicates similar constitutional stressors (e.g., both high Vata/Adi or both high Pitta/Madhya)."
      ],
      "modifying_factors": [],
      "timing_requirements": []
    },
    "confidence": {
      "textual_support": "high_explicit_canonical",
      "cross_source_agreement": "high",
      "empirical_validation": "not_established"
    },
    "known_disagreements": [],
    "examples": [
      "Partner A in Rohini (Vrishabha, Antya Nadi) and Partner B in Krittika Pada 2 (Vrishabha, Antya Nadi): Same Rashi (Vrishabha) but different Nakshatras -> Nadi Dosha is CANCELLED."
    ],
    "implementation_notes": [],
    "safety_constraints": [
      "Never claim that Nadi Dosha causes genetic defects, infertility, or death; medical genetics requires biological testing, not lunar longitude comparison."
    ]
  },
  {
    "rule_id": "vedic.tajika.ithasala_yoga",
    "rule_name": "Tajika Ithasala Yoga (Applying Longitudinal Aspect)",
    "tradition": "vedic_tajika",
    "category": "varshaphala_prashna",
    "source_references": [
      {"source_id": "SRC-TAJIKA-NILAKANTHI", "locator": "Samjna Tantra, Sixteen Yogas Section"}
    ],
    "definition": "In a Varshaphala (Annual Solar Return) or Prashna chart, a faster-moving planet (Lagnesha or Karyesha) has a smaller degree-in-sign than a slower-moving planet, both are in Tajika aspectual signs (1, 3, 4, 5, 7, 9, 10, 11), and the degree difference is less than their combined mean Diptamsha (orb of light).",
    "conditions": [
      {"op": "in_set", "field": "house_offset(planet.fast.d1_rashi, planet.slow.d1_rashi)", "value": [1, 3, 4, 5, 7, 9, 10, 11]},
      {"op": "less_than", "field_a": "planet.fast.deg_in_sign", "field_b": "planet.slow.deg_in_sign"},
      {"op": "less_than", "field_a": "planet.slow.deg_in_sign - planet.fast.deg_in_sign", "field_b": "(planet.fast.diptamsha + planet.slow.diptamsha) / 2.0"}
    ],
    "exceptions": [
      {"condition": "planet.fast.is_retrograde == true", "effect": "radda_yoga_reversal_or_delay"}
    ],
    "calculation_dependencies": ["sidereal_longitudes", "planetary_speeds", "tajika_aspects"],
    "interpretation": {
      "positive_indications": [
        "Transfer of light and momentum from the faster significator to the slower significator, indicating completion of the annual or Prashna objective."
      ],
      "negative_indications": [],
      "modifying_factors": [
        "Vartamana Ithasala (currently within orb), Bhavishyat Ithasala (at 29 deg applying into next sign), and Purna Ithasala (within 1 degree)."
      ],
      "timing_requirements": [
        "Within the 12-month Varshaphala solar year."
      ]
    },
    "confidence": {
      "textual_support": "high_explicit_canonical",
      "cross_source_agreement": "high",
      "empirical_validation": "not_established"
    },
    "known_disagreements": [],
    "examples": [],
    "implementation_notes": [],
    "safety_constraints": []
  },
  {
    "rule_id": "hellenistic.sect.benefic_malefic_modulation",
    "rule_name": "Hellenistic Sect (Hairesis) Modulation of Benefics and Malefics",
    "tradition": "hellenistic_wholesign",
    "category": "dignity_sect",
    "source_references": [
      {"source_id": "SRC-VALENS-ANTHOLOGY", "locator": "Book I, Chapter 1; Book II"},
      {"source_id": "SRC-PTOLEMY-TETRABIBLOS", "locator": "Book I, Chapter 7 (Of Diurnal and Nocturnal)"}
    ],
    "definition": "Classifies the chart as Diurnal (Sun above horizon) or Nocturnal (Sun below horizon). In a Diurnal chart, Jupiter is the most constructive benefic and Mars is the most disruptive malefic (contrary to sect), while Saturn is moderated by sect. In a Nocturnal chart, Venus is the primary benefic, Mars is moderated by sect, and Saturn is the primary malefic contrary to sect.",
    "conditions": [
      {"op": "boolean_branch", "field": "chart.is_diurnal"}
    ],
    "exceptions": [],
    "calculation_dependencies": ["solar_altitude_or_horizon_arc"],
    "interpretation": {
      "positive_indications": [
        "The benefic of the sect in a fertile angular/succedent Whole Sign house acts as the primary protective factor in the chart."
      ],
      "negative_indications": [
        "The malefic contrary to sect (Mars by day, Saturn by night) represents the primary locus of external friction or chronic challenge."
      ],
      "modifying_factors": [
        "Further modified by Planetary Hayz (diurnal planet above horizon in masculine sign by day; nocturnal planet below horizon in feminine sign by night)."
      ],
      "timing_requirements": [
        "Used continuously when evaluating Annual Profections and Zodiacal Releasing periods."
      ]
    },
    "confidence": {
      "textual_support": "high_explicit_canonical",
      "cross_source_agreement": "universal_in_hellenistic_and_arabic",
      "empirical_validation": "not_established"
    },
    "known_disagreements": [],
    "examples": [],
    "implementation_notes": [],
    "safety_constraints": []
  },
  {
    "rule_id": "hellenistic.timing.annual_profections",
    "rule_name": "Annual Profections (1-Sign-Per-Year Time Lord)",
    "tradition": "hellenistic_wholesign",
    "category": "timing_profection",
    "source_references": [
      {"source_id": "SRC-VALENS-ANTHOLOGY", "locator": "Book IV, Chapters 11-25"}
    ],
    "definition": "For integer age A (completed solar years since birth), the active Profected Place is H_prof = (A mod 12) + 1 counted in Whole Signs from the natal Ascendant. The domicile lord of that sign becomes the Lord of the Year (Chronocrator), activating both the topics of H_prof and the natal houses ruled and occupied by the Lord of the Year.",
    "conditions": [
      {"op": "compute_modulo", "formula": "(completed_age_years % 12) + 1"}
    ],
    "exceptions": [],
    "calculation_dependencies": ["tropical_ascendant", "whole_sign_houses", "completed_age_years"],
    "interpretation": {
      "positive_indications": [
        "Ages 0, 12, 24, 36, 48, 60, 72, 84 activate the 1st House (self/vitality); Ages 9, 21, 33, 45, 57, 69 activate the 10th House (career/public action)."
      ],
      "negative_indications": [
        "Ages 5, 17, 29, 41, 53, 65 (6th House) and Ages 7, 19, 31, 43, 55, 67 (8th House) bring focus to health maintenance, shared finances, or restructuring."
      ],
      "modifying_factors": [
        "Transits to and from the Lord of the Year carry maximum weight during that solar year."
      ],
      "timing_requirements": [
        "Shifts annually on the exact solar birthday."
      ]
    },
    "confidence": {
      "textual_support": "high_explicit_canonical",
      "cross_source_agreement": "universal_in_hellenistic",
      "empirical_validation": "not_established"
    },
    "known_disagreements": [],
    "examples": [],
    "implementation_notes": [],
    "safety_constraints": []
  },
  {
    "rule_id": "western.horary.strictures_against_judgment",
    "rule_name": "Lilly's Horary Strictures and Perfection via Applying Aspect",
    "tradition": "western_traditional_horary",
    "category": "horary_validation_and_perfection",
    "source_references": [
      {"source_id": "SRC-LILLY-CHRISTIAN-ASTROLOGY", "locator": "Book I & Book II, pp. 121-126 & 298-302 (1647)"}
    ],
    "definition": "Evaluates a Regiomontanus Horary chart first for radicality/strictures (Ascendant < 3 deg or > 27 deg, Moon Void of Course, Saturn in 7th), then tests whether the significator of the Querent (Lord 1 or Moon) forms an unprohibited applying Ptolemaic aspect (0, 60, 90, 120, 180 deg) or Translation/Collection of Light with the significator of the Quesited (Lord X).",
    "conditions": [
      {"op": "between", "field": "ascendant.deg_in_sign", "min": 3.0, "max": 27.0},
      {"op": "applying_aspect_or_light_transfer", "p1": "significator.querent", "p2": "significator.quesited"}
    ],
    "exceptions": [
      {"condition": "intervening_aspect_before_perfection == true", "effect": "prohibition_cuts_off_perfection"},
      {"condition": "station_retrograde_before_exact_aspect == true", "effect": "refranation_aborts_perfection"}
    ],
    "calculation_dependencies": ["tropical_longitudes", "regiomontanus_cusps", "planetary_speeds", "essential_dignities"],
    "interpretation": {
      "positive_indications": [
        "Applying Trine (120 deg) or Sextile (60 deg) with mutual Reception indicates smooth realization of the queried matter."
      ],
      "negative_indications": [
        "Applying Opposition (180 deg) without Reception indicates bringing the matter together only to separate or conflict; Prohibition indicates a third party blocks completion."
      ],
      "modifying_factors": [],
      "timing_requirements": [
        "Symbolic degrees-to-exactness mapped to days/weeks/months based on Cardinal/Fixed/Mutable sign and Angular/Succedent/Cadent house."
      ]
    },
    "confidence": {
      "textual_support": "high_explicit_canonical",
      "cross_source_agreement": "high_across_arabic_and_renaissance_horary",
      "empirical_validation": "not_established"
    },
    "known_disagreements": [],
    "examples": [],
    "implementation_notes": [],
    "safety_constraints": []
  },
  {
    "rule_id": "chinese.bazi.day_master_seasonal_strength",
    "rule_name": "BaZi Day Master (Ri Yuan) Seasonal Strength & Useful God (Yong Shen)",
    "tradition": "chinese_bazi",
    "category": "bazi_equilibrium",
    "source_references": [
      {"source_id": "SRC-SAN-MING-TONG-HUI", "locator": "Wan Minying, Volumes 1-12"},
      {"source_id": "SRC-ZI-PING-ZHEN-QUAN", "locator": "Shen Xiaozhan, Chapters on Yong Shen"}
    ],
    "definition": "Evaluates the Five-Phase (Wuxing) strength of the Day Stem (Day Master / Ri Yuan) primarily against the Month Branch (Yue Ling / Seasonal Command, ~40-50% weight) and supporting Roots (Tong Gen) in the Day, Hour, and Year Branches plus Resource (Yin) and Companion (Bi Jie) stems. If the Day Master is overly strong (Wang), the Useful God (Yong Shen) is selected from Output (Shi Shang), Wealth (Cai), or Officer (Guan) to drain/control it; if weak (Ruo), Yong Shen is selected from Resource (Yin) or Companion (Bi Jie) to strengthen it.",
    "conditions": [
      {"op": "evaluate_wuxing_balance", "day_master": "pillars.day.stem", "month_branch": "pillars.month.branch"}
    ],
    "exceptions": [
      {"condition": "extreme_dominance_score > 0.85", "effect": "follow_structure_cong_ge_follow_the_dominant_element"}
    ],
    "calculation_dependencies": ["solar_term_jieqi", "local_solar_time", "four_pillars_ganzhi", "hidden_stems_canggan"],
    "interpretation": {
      "positive_indications": [
        "10-Year Luck Pillars (Da Yun) and Annual Pillars (Liu Nian) that bring the Useful God (Yong Shen) element correspond to periods of equilibrium and smooth accomplishment."
      ],
      "negative_indications": [
        "Luck Pillars that bring the Unfavorable Element (Ji Shen) or clash with the Month/Day Branch (e.g., Zi-Wu, Mao-You, Yin-Shen, Si-Hai, Chen-Xu, Chou-Wei clashes) signal structural reorganization."
      ],
      "modifying_factors": [
        "Climate adjustment (Tiao Hou) is also required for charts born in extreme winter (Hai/Zi/Chou months needing Fire) or extreme summer (Si/Wu/Wei months needing Water)."
      ],
      "timing_requirements": [
        "10-Year Da Yun and Annual Liu Nian."
      ]
    },
    "confidence": {
      "textual_support": "high_explicit_canonical",
      "cross_source_agreement": "high",
      "empirical_validation": "not_established"
    },
    "known_disagreements": [],
    "examples": [],
    "implementation_notes": [],
    "safety_constraints": []
  }
]
```

---

## 3. Deterministic Conflict-Reconciliation Calculus

When multiple rules fire with opposite valences on the same life domain (e.g., `vedic.yoga.rajayoga.dharma_karmadhipati` fires positively on the 10th house while `Saturn 10th aspect` and `combust 10th lord` fire negatively), Vyom does **not** discard one rule or output contradictory prose. Instead, the **Conflict-Reconciliation Engine** executes a 5-stage hierarchical resolution algorithm:

1. **Stage 1 — Cancellation Precedence (*Bhanga / Parihara* Override)**:
   If an explicit cancellation rule fires (e.g., *Kemadruma Bhanga*, *Neechabhanga*, *Kuja Dosha Parihara*, *Nadi Dosha Parihara*), the raw affliction rule's status is mutated from `ACTIVE_AFFLICTION` to `MITIGATED_BY_PARIHARA` and its negative weight is reduced by $70\%$–$90\%$, transforming the narrative into a "challenge-then-mastery" arc.
2. **Stage 2 — Three-Pillar Structural Weighting (*Bhava, Bhavesha, Karaka*)**:
   For any domain $D$, compute the vector $(w_{\text{Bhava}}, w_{\text{Bhavesha}}, w_{\text{Karaka}}) \in [-1, +1]^3$:
   - **3 of 3 Positive**: High ease and early realization.
   - **2 of 3 Positive, 1 Negative** (e.g., strong 7th house and strong 7th lord, but afflicted Venus): The structural milestone (marriage) occurs via the strong Bhava/Bhavesha, while the afflicted Karaka manifests as a qualitative nuance (need for conscious emotional maintenance).
   - **Bhava Occupied by Malefic vs. Bhavesha Exalted**: Classical rule (*Phaladeepika* Ch. 15): A strong Bhavesha protects the ultimate outcome of the house, while the occupying malefic introduces friction in the environment or timing.
3. **Stage 3 — Divisional Chart (*Varga*) Depth Audit**:
   A planet exalted in $D_1$ (*Rashi*) but debilitated in $D_9$ (*Navamsha*) represents strong external presentation that loses internal sustainability over time; conversely, a planet average in $D_1$ but exalted or *Vargottama* in $D_9$ and the domain Varga ($D_{10}$ for career, $D_7$ for progeny, $D_{24}$ for education) gains strength with maturity.
4. **Stage 4 — Temporal Segregation (Dasha Sequence Separation)**:
   Conflicting natal indicators rarely manifest simultaneously! If the 10th house is aspected by both exalted Jupiter and debilitated Mars, the expansive professional theme manifests during **Jupiter Antardashas**, whereas workplace conflict or abrupt pivots manifest during **Mars Antardashas**.
5. **Stage 5 — Reference Frame Triangulation (*Sudarshana*)**:
   Weight indicators by convergence across **Udaya Lagna** ($50\%$), **Chandra Lagna** ($30\%$), and **Surya Lagna / Navamsha Lagna** ($20\%$).
