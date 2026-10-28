# Vyom Consultation System — Methodology Map, Sources and Verification

How the 10 Vyom process documents and the book library govern the astrologer consultation.
The 10 process documents are preserved verbatim in `data/sources/process/` (originals are in `~/Downloads`).

## 1. How a consultation runs

`POST /api/ai/chat` → `runConsultation()` in `src/server/aiPlugin.ts`:

1. **Chart (Tier 1, deterministic)**: the server recalculates the chart from the saved birth details:
   `src/lib/astrology/calculations/chartEngine.ts`. The user's name is never sent to the language layer.
2. **Birth-time workflow**: A exact / B approximate (±30 min sweep) / C unknown / E midnight / F DST fold-gap.
   Features that depend on an uncertain time are listed in `suppressedFeatures`.
3. **Rule evaluation (Tier 2, deterministic)**: `src/lib/astrology/rules/vedicAnalysis.ts` produces fired-rule records with status
   (active / weakened / mitigated / cancelled / suppressed), reasons and classical locators.
4. **Question routing**: `src/server/consultation/questionRouter.ts` maps each question to a DOC 07 Q-category,
   a DOC 05 life domain and any DOC 10 risk flags.
5. **Knowledge retrieval**: `src/server/consultation/knowledgeBase.ts` runs BM25 over every readable chunk of every book,
   filtered by source kind, plus section-level retrieval over the 10 process documents.
6. **Working principles**: `src/server/consultation/methodology.ts`, with per-domain procedures and per-question directives added.
7. **Generation and validation**: `finalizeAnswer()` builds source blocks only from passages that were actually retrieved,
   scrubs any implementation details and returns an honest error instead of an invented reading when generation fails.

## 1b. Answer-first readings and consistency (methodology v2)

| Stage | Responsibility | Where |
| --- | --- | --- |
| A. Chart calculation | Positions, houses, Dashas, D9/D10, transits | `lib/astrology/calculations/*` |
| B. Rule evaluation | Yogas, Doshas and their cancellations, dignities, functional roles | `lib/astrology/rules/vedicAnalysis.ts` |
| B/C. Question assessment | For the question's life area, the system picks the relevant factors (house, its ruler, the significator, D9/D10, relevant rules). It assigns each one a role (supporting / challenging / mitigating) and a weight, then derives the overall balance, the confidence level (well-supported / tentative / not assessable), the Dasha timing windows and the missing information. This step is deterministic. | `lib/astrology/rules/domainAssessment.ts` |
| D. Writing | The model receives the assessment as an ESTABLISHED ANALYSIS. It writes the **Summary** (3–5 everyday sentences with no astrological terms, a real-life example and the uncertainty in plain words), key findings with an "in everyday life" illustration (citing factor IDs), an optional outlook (citing window IDs) and technical evidence. | `server/consultation/methodology.ts`, `buildConsultation.ts` |
| Validation | Roles, confidence, missing information and timing are taken from the assessment, never from the model. Every sentence is checked against the chart: house/sign pairs, dignity claims, named yogas, certainty language, invented probabilities, fear language, and years outside the windows. The Summary and its heading also go through a plain-language filter (`summaryJargon`: planets, signs, houses, aspects, yogas, doshas, periods, transits, divisional charts, dignities and Sanskrit terms, unless the user used the term), a length check (≤ 6 sentences / 130 words) and a stance check (no more optimistic or pessimistic than the balance; a plain uncertainty phrase when confidence is not well-supported). A Summary that is missing or still fails after the repair is replaced by `plainSummary()`, built deterministically from the assessment. On a violation the server makes one corrective regeneration, then removes any sentences that still violate. | `server/consultation/responseContract.ts`, `aiPlugin.ts` (`runConsultation`) |
| Consistency | Each answer carries an `[analysis: …]` signature in the conversation history. If an earlier answer had a different analysis for unchanged inputs, the model is told to correct it explicitly. Validated answers are cached under a key covering the pipeline version, knowledge version, birth details, question, date and (for follow-ups) the conversation. Generation uses temperature 0.2 and a fixed seed. | `buildConsultation.ts`, `answerCache.ts` |
| E. UI | Same cards and styling; sections appear in this order: **Summary** → What this means for you → What could happen (with timeline) → What to keep in mind (supports / complicates / softens) → collapsible "Explore the details" panel (technical evidence, factors, sources, calculation notes). Sections with no content are not shown. | `components/vyom/StructuredReading.tsx` via `VisualAnswer.tsx` |

**Fine-tuning:** none was performed. The providers in use (the Gemini API and OpenRouter) offer no supported fine-tuning path for this project (see `docs/fine-tuning-plan.md`). All behaviour changes come from deterministic code, prompts, the output schema, validation and the UI. The interpretation quality still depends on the inference model.

## 2. Where each process document is applied

| Document | Operational use |
| --- | --- |
| 01 Master handbook | Three-tier epistemology (principles §1); 13-stage pipeline; Workflows A–F (`chartEngine.ts`) |
| 02 Astronomy spec | Meeus JD/GMST/obliquity/nutation, ΔT, Lahiri anchors, atan2 Ascendant, mean node, retrograde from speed (`calculations/*`) |
| 03 Vedic knowledge base | Dignities, Moolatrikona, five-fold relationships, combustion orbs, Graha Drishti, functional-nature matrix per Lagna, D9/D10/D2/D3/D30, Vimshottari (365.2425-day year), Gochara with Vedha, Sade Sati/Dhaiya |
| 04 Western & comparative | Tradition-separation rules; conceptual cross-tradition answers (no non-Vedic chart is calculated) |
| 05 Prediction & domains | 10 domain playbooks; natal promise ∧ Dasha ∧ transit; specificity Levels 1–5; Dosha audit; remedy policy |
| 06 Rulebook | Mahapurusha, Dharma-Karmadhipati, Gajakesari, Kemadruma + Bhanga, Neechabhanga, Vipareeta, Parivartana, Manglik + 8 Pariharas, Kala Sarpa audit, Vargottama, Dasha synthesis, Sade Sati; 5-stage conflict calculus (principles §3) |
| 07 Architecture | "Zero LLM arithmetic"; Q01–Q14 router; PII minimisation |
| 08 Worked examples | Golden vectors and cases in `tests/astrology.test.ts` |
| 09 Source catalog | Locators attached to fired rules; source hierarchy |
| 10 Evidence & safety | Tier 3 honesty; 12 operational rules; Q14 risk directives; contrastive scenarios in the eval suite |

## 3. Source inventory (re-ingested with `npm run ingest`)

| Book | Kind | Readable chunks | Text layer |
| --- | --- | --- | --- |
| Brihat Parashara Hora Shastra | classical | 389 | good |
| Brihat Jataka (Varahamihira) | classical | **0 of 330** | **unusable: needs OCR** (English scan misread as Devanagari) |
| Phaladeepika | classical | 370 of 380 | partial (Sanskrit pages) |
| Saravali | classical | 315 | good |
| Jataka Parijata Vol. 1 | classical | 246 | good (OCR-noisy chapter titles) |
| Lessons on Vedic Astrology (P.V.R. Narasimha Rao) | modern pedagogy | 263 | good |
| Origin, Meaning & Purpose of Astrology | commentary | 104 | good |
| Practitioner's Compendium (numerology/palmistry) | divination | 12 | good (6-page source) |
| Mysteries of Magic (Lévi) | Western esoteric | 540 | good (OCR noise) |
| Magic, White and Black (Hartmann) | Western esoteric | 381 | good |
| Black Magic (Bowen) | **novel** | 281 | good; never retrieved as authority |

Source-kind policy: Vedic questions draw on classical texts and modern pedagogy only. Esoteric texts are used only for occult
questions, the compendium only for numerology and palmistry, and fiction only when the user names it.

**To recover Brihat Jataka**: install an OCR tool (e.g. `brew install ocrmypdf`), run
`ocrmypdf --force-ocr ~/Downloads/2015.406251.Brihat-Jataka_text.pdf data/sources/brihat-jataka-ocr.pdf`,
point the `doc-brihat-jataka` entry in `scripts/ingest_library.py` at the new file, and re-run `npm run ingest`.
Until then, the Brihat Jataka doctrines used by the rule engine (Vargottama 1.14, Kemadruma 13.3) come from DOC 03/06/09.

## 4. Verification

- `npm test`: 61 deterministic and rendering tests (calculations, rules, assessment, validator, contract, prompt, cache, UI rendering) — previously 35 (golden vectors, worked cases, rules, workflows, router, prompt assembly, output validation, knowledge coverage).
- `npm run eval:repeat`: repeatability evaluation (the same questions asked several times; agreement metrics and thresholds) → `data/evaluation/repeatability_latest.json`.
- `npm run eval`: 23 live consultation scenarios across categories A–K; writes `data/evaluation/consultation_eval_latest.{json,md}`.
- `python3 scripts/test_system.py`: legacy ingestion and retrieval checks.

### Known deviations and open issues
- DOC 08 TC-07: the Moon is 0.0074° from the documented value (the Meeus Ex. 47.a check passes to 0.0001°), which moves Dasha dates by about 4 days.
- DOC 08 TC-09: the documented worked value uses mean sidereal time; Vyom uses apparent sidereal time as DOC 02 §2.3 specifies (Δ ≈ 0.005°).
- DOC 08 Case 03 and Case 04 lunar positions are inconsistent with Meeus Ch. 47 (14 July 1992 was a full Moon, and 9 Oct 1999 a new Moon).
  Tests check the behaviour of these cases, not those numbers.
- Not calculated: Shadbala, Ashtakavarga, Pratyantardasha, D7/D12/D24 and other vargas, Arudha/Upapada, Jaimini, KP, and Western/Hellenistic/BaZi charts.
  The consultation says so instead of inventing them.
- The planetary ephemeris uses JPL Keplerian elements (valid 1800–2050, accuracy at the arc-minute level), not DE440.
- Static pages (Library, Predictions, Remedies) still carry hand-written chapter references that have not been verified against the texts.
