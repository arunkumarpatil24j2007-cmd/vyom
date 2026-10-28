/**
 * The single response contract between the interpreter and the UI, plus the post-generation
 * validator. The model supplies plain-language writing; everything that constitutes a judgement
 * (factor roles, confidence, timing windows, missing information) is taken from the deterministic
 * DomainAssessment, so it cannot drift between repeated answers.
 */
import type { DomainAssessment } from '../../lib/astrology/rules/domainAssessment.ts';
import type { VedicAnalysis } from '../../lib/astrology/rules/vedicAnalysis.ts';
import type { ReadingFactorRole, ReadingFinding, ReadingPrediction, StructuredReading } from '../../types/visualAnswer.ts';

export const READING_RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    summary: { type: 'STRING' },
    direct_answer: {
      type: 'OBJECT',
      properties: { heading: { type: 'STRING' } },
      required: ['heading'],
    },
    main_takeaway: { type: 'STRING' },
    key_findings: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          factor_ids: { type: 'ARRAY', items: { type: 'STRING' } },
          title: { type: 'STRING' },
          explanation: { type: 'STRING' },
          in_daily_life: { type: 'STRING' },
          relevance: { type: 'STRING' },
          qualification: { type: 'STRING' },
        },
        required: ['title', 'explanation'],
      },
    },
    prediction: {
      type: 'OBJECT',
      nullable: true,
      properties: {
        what: { type: 'STRING' },
        window_ids: { type: 'ARRAY', items: { type: 'STRING' } },
        why: { type: 'STRING' },
        influences: { type: 'STRING' },
        meaning: { type: 'STRING' },
      },
    },
    technical_evidence: { type: 'STRING' },
    uncertainties: { type: 'ARRAY', items: { type: 'STRING' } },
    follow_up_questions: { type: 'ARRAY', items: { type: 'STRING' } },
    cited_passage_ids: { type: 'ARRAY', items: { type: 'STRING' } },
    category: {
      type: 'STRING',
      enum: ['career', 'relationship', 'finance', 'health', 'spiritual', 'timing', 'remedy', 'education', 'family', 'personality', 'general'],
    },
  },
  required: ['summary', 'direct_answer', 'key_findings', 'category'],
};

export interface ContractContext {
  assessment: DomainAssessment | null;
  analysis: VedicAnalysis | null;
  /** Predictions are suppressed for high-risk questions (DOCUMENT_10 §3.2). */
  allowPrediction: boolean;
  now: Date;
  /** The user's question: technical terms the user used themselves are allowed in the Summary. */
  question?: string;
}

/** True when model output follows the structured contract (a bare summary + blocks is the legacy shape). */
export function hasReadingOutput(parsed: any): boolean {
  return !!(parsed && typeof parsed === 'object' && (parsed.direct_answer || (parsed.summary && Array.isArray(parsed.key_findings))));
}

const CONFIDENCE_LABELS = { well_supported: 'Well-supported reading', tentative: 'Tentative reading', not_assessable: 'Not yet assessable' } as const;

const str = (v: unknown, max = 1200): string => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const strList = (v: unknown, maxItems: number, maxLen = 300): string[] =>
  (Array.isArray(v) ? v : []).map((x) => str(x, maxLen)).filter(Boolean).slice(0, maxItems);

export function analysisSignature(a: DomainAssessment | null): string | undefined {
  if (!a) return undefined;
  return `${a.domain}|${a.balance}|${a.confidence}|${a.timing.windows.map((w) => w.id).join(',') || 'no-windows'}|${a.factors.map((f) => `${f.id}:${f.role}`).join(',')}`;
}

/** Builds a StructuredReading from (possibly malformed) model output, enforcing the assessment. */
export function buildReading(parsed: unknown, ctx: ContractContext): StructuredReading | null {
  const o = (parsed && typeof parsed === 'object' ? parsed : {}) as Record<string, any>;
  const a = ctx.assessment;
  const da = o.direct_answer && typeof o.direct_answer === 'object' ? o.direct_answer : {};
  const text = str(o.summary, 900) || str(da.text, 900) || str(o.answer, 900);
  if (!text) return null;

  const factorById = new Map((a?.factors || []).map((f) => [f.id, f]));
  const findings: ReadingFinding[] = (Array.isArray(o.key_findings) ? o.key_findings : [])
    .filter((f: any) => f && typeof f === 'object' && str(f.title) && str(f.explanation))
    .slice(0, 5)
    .map((f: any) => {
      const refs = strList(f.factor_ids, 6, 80).map((id) => factorById.get(id)).filter(Boolean) as DomainAssessment['factors'];
      const roles = [...new Set(refs.map((r) => r.role))];
      const role: ReadingFactorRole = roles.length === 0 ? 'information' : roles.length === 1 ? roles[0] : 'mixed';
      return {
        title: str(f.title, 90),
        explanation: str(f.explanation, 700),
        inDailyLife: str(f.in_daily_life, 400) || undefined,
        relevance: str(f.relevance, 300) || undefined,
        qualification: str(f.qualification, 300) || undefined,
        role,
        evidence: refs.map((r) => r.technical),
      };
    });

  let prediction: ReadingPrediction | null = null;
  const p = o.prediction && typeof o.prediction === 'object' ? o.prediction : null;
  if (p && str(p.what) && a && ctx.allowPrediction && a.confidence !== 'not_assessable') {
    const windows = a.timing.assessable ? a.timing.windows : [];
    const chosen = new Set(strList(p.window_ids, 6, 80));
    const nowMs = ctx.now.getTime();
    prediction = {
      what: str(p.what, 700),
      why: str(p.why, 600) || undefined,
      influences: str(p.influences, 600) || undefined,
      meaning: str(p.meaning, 600) || undefined,
      timing: windows.filter((w) => chosen.has(w.id)).map((w) => ({
        start: w.start, end: w.end, period: w.period, theme: w.theme, strength: w.strength, why: w.why, limitations: w.limitations,
        isCurrent: Date.parse(w.start) <= nowMs && nowMs < Date.parse(w.end),
      })),
      timingNote: a.timing.reason,
    };
  }

  const pick = (role: 'supporting' | 'challenging' | 'mitigating') =>
    (a?.factors || []).filter((f) => f.role === role).map((f) => ({ plain: f.plain, technical: f.technical }));
  const an = ctx.analysis;

  return {
    directAnswer: { heading: str(da.heading, 110) || (a ? a.domainLabel : 'Your answer'), text },
    mainTakeaway: str(o.main_takeaway, 300) || undefined,
    confidence: a ? a.confidence : null,
    confidenceLabel: a ? CONFIDENCE_LABELS[a.confidence] : '',
    confidenceReasons: a ? a.confidenceReasons : [],
    domainLabel: a?.domainLabel,
    keyFindings: findings,
    prediction,
    supportingFactors: pick('supporting'),
    challengingFactors: pick('challenging'),
    mitigatingFactors: pick('mitigating'),
    technicalEvidence: str(o.technical_evidence, 6000) || deterministicEvidence(a),
    calculationNotes: an ? [
      `${an.settings.tradition} · ${an.settings.zodiac} · ${an.settings.ayanamsha} ayanamsha (${an.settings.ayanamshaDeg}°) · ${an.settings.houseSystem}`,
      ...(a?.reference === 'moon' ? ['Houses counted from the Moon sign (birth time unknown).'] : []),
      ...an.workflow.warnings,
    ] : [],
    uncertainties: [...new Set([...(a?.uncertainties || []), ...strList(o.uncertainties, 4)])],
    missingInformation: a?.missingInformation || [],
    analysisSignature: analysisSignature(a),
  };
}

/** Technical evidence built from the assessment when the model omits it, so depth is never lost. */
function deterministicEvidence(a: DomainAssessment | null): string {
  if (!a) return '';
  const lines = [`### ${a.domainLabel}: factors evaluated (houses counted from the ${a.reference === 'lagna' ? 'Lagna' : 'Moon sign'})`];
  for (const role of ['supporting', 'challenging', 'mitigating'] as const) {
    for (const f of a.factors.filter((x) => x.role === role)) lines.push(`- *${role}*: ${f.technical} (${f.sources.join('; ')})`);
  }
  lines.push('', `Overall balance: ${a.balance.replace('_', ' ')}. ${a.balanceExplanation}`);
  if (a.timing.windows.length) lines.push('', '### Planetary periods connected to this area', ...a.timing.windows.map((w) => `- ${w.start} → ${w.end}: ${w.period} (${w.why.join('; ')})`));
  else lines.push('', `Timing: ${a.timing.reason}`);
  return lines.join('\n');
}

// ─── Plain-language Summary ───

/**
 * Terms a reader with no astrology background would not understand. The Summary may not contain
 * them (unless the user used the term in the question); they belong in the detailed sections.
 */
const SUMMARY_JARGON: RegExp = new RegExp(`\\b(${[
  'sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn', 'rahu', 'ketu', 'nodes?', 'planet(?:s|ary)?', 'graha',
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces',
  'mesha', 'vrishabha', 'mithuna', 'karka', 'simha', 'kanya', 'tula', 'vrischika', 'dhanu', 'makara', 'kumbha', 'meena', 'rashi',
  'zodiac(?:al)?', 'star signs?', 'houses?', 'bhavas?', 'ascendant', 'rising sign', 'lagna', 'aspecting', 'aspected',
  'conjunct', 'yogas?', 'doshas?', 'manglik', 'mangal', 'kala ?sarpa', 'kaal ?sarp', 'sade ?sati', 'dashas?', 'mahadashas?',
  'antardashas?', 'bhukti', 'transits?', 'transiting', 'gochara', 'navamsh?a', 'navamsa', 'd9', 'd10', 'divisional', 'vargas?',
  'nakshatras?', 'benefics?', 'malefics?', 'exalted', 'exaltation', 'debilitat(?:ed|ion)', 'neecha ?bhanga', 'retrograde', 'combust(?:ion)?',
  'lords?', 'lordship', 'significator', 'karakas?', 'kendras?', 'trikonas?', 'dusthanas?', 'shadbala', 'ashtakavarga', 'dig ?bala',
].join('|')})\\b`, 'gi');

/** Technical terms in `text` that the user did not use in their own question. */
export function summaryJargon(text: string, question = ''): string[] {
  const asked = question.toLowerCase();
  const found = [...text.matchAll(SUMMARY_JARGON)].map((m) => m[0].toLowerCase());
  return [...new Set(found)].filter((t) => !new RegExp(`\\b${t.replace(/s$/, '')}`, 'i').test(asked));
}

const HEDGE = /\b(may|might|could|suggests?|tentative|possibl[ey]|perhaps|likely|tend|not (certain|fixed|guaranteed)|uncertain|preliminary|one possibility)\b/i;
const OVER_POSITIVE = /\b(excellent|extremely (favou?rable|lucky)|very (lucky|fortunate|favou?rable)|nothing to worry|smooth sailing|blessed with|perfect (match|marriage|partner))\b/i;
const OVER_NEGATIVE = /\b(very (difficult|bad|unlucky)|serious (trouble|problems?)|bleak|unfavou?rable overall|bad luck)\b/i;

/**
 * Deterministic plain-language Summary built only from the established analysis. Used when the
 * written Summary is missing or still fails the language/stance checks after the repair attempt,
 * so the answer never loses its plain explanation or drifts from the analysis.
 */
export function plainSummary(a: DomainAssessment | null): string {
  if (!a) return '';
  const hasSoftening = a.factors.some((f) => f.role === 'mitigating');
  const lead: Record<DomainAssessment['balance'], string> = {
    mostly_supportive: `Your chart's traditional reading looks mostly encouraging for ${a.area}. In everyday life, this may mean that things in this part of your life come together more readily when you put in steady effort.`,
    mixed: `Your chart gives a two-sided picture for ${a.area}: some parts of it point to support, and others point to effort. In everyday life, this may mean that this part of your life grows through patience and honest conversations rather than happening effortlessly.`,
    mostly_challenging: `Your chart's traditional reading suggests that ${a.area} may take more effort than usual. In everyday life, this could look like delays, misunderstandings or needing more time to find what suits you${hasSoftening ? ', although other parts of the chart soften this' : ''}.`,
    insufficient: `There is not enough information in your chart data to say much about ${a.area} yet.`,
  };
  const firmness: Record<DomainAssessment['confidence'], string> = {
    well_supported: 'Several separate parts of the chart point the same way, so this is one of its clearer themes.',
    tentative: 'Treat this as a possible theme rather than a firm conclusion.',
    not_assessable: 'More information is needed before this can be judged properly.',
  };
  const timing = a.timing.windows.length
    ? 'The chart points to some years when this theme may feel more noticeable, but it does not identify a specific event or date.'
    : 'The chart does not identify a specific event or date.';
  return [lead[a.balance], a.balance === 'insufficient' ? '' : firmness[a.confidence], timing].filter(Boolean).join(' ');
}

// ─── Validation ───

const SIGN_NAMES: Record<string, string> = {
  aries: 'Aries', mesha: 'Aries', taurus: 'Taurus', vrishabha: 'Taurus', gemini: 'Gemini', mithuna: 'Gemini',
  cancer: 'Cancer', karka: 'Cancer', karkata: 'Cancer', leo: 'Leo', simha: 'Leo', virgo: 'Virgo', kanya: 'Virgo',
  libra: 'Libra', tula: 'Libra', scorpio: 'Scorpio', vrischika: 'Scorpio', vrishchika: 'Scorpio',
  sagittarius: 'Sagittarius', dhanu: 'Sagittarius', capricorn: 'Capricorn', makara: 'Capricorn',
  aquarius: 'Aquarius', kumbha: 'Aquarius', pisces: 'Pisces', meena: 'Pisces',
};
const SIGN_RE = Object.keys(SIGN_NAMES).join('|');
const PLANET_RE = 'Sun|Moon|Mars|Mercury|Jupiter|Venus|Saturn|Rahu|Ketu';
const NEGATION = /\b(no|not|isn't|is not|absent|cancel+ed|without|doesn't|does not|never|neither|nor)\b/i;
const OTHER_FRAME = /\b(navamsha|navamsa|d9|d10|dashamsha|from (your|the) moon|chandra lagna|moon sign as|counted from the moon|western|tropical|if |would be|for example|e\.g\.|in general)\b/i;

const YOGA_CHECKS: Array<{ re: RegExp; ruleId: string; requireActive?: boolean; label: string }> = [
  { re: /gaja ?kesari/i, ruleId: 'vedic.yoga.gajakesari', label: 'Gajakesari Yoga' },
  { re: /neecha ?bhanga/i, ruleId: 'vedic.yoga.neechabhanga_rajayoga', label: 'Neechabhanga' },
  { re: /ruchaka/i, ruleId: 'vedic.yoga.pancha_mahapurusha.ruchaka', label: 'Ruchaka Yoga' },
  { re: /\bbhadra yoga/i, ruleId: 'vedic.yoga.pancha_mahapurusha.bhadra', label: 'Bhadra Yoga' },
  { re: /\bhamsa yoga/i, ruleId: 'vedic.yoga.pancha_mahapurusha.hamsa', label: 'Hamsa Yoga' },
  { re: /malavya/i, ruleId: 'vedic.yoga.pancha_mahapurusha.malavya', label: 'Malavya Yoga' },
  { re: /shasha yoga|sasa yoga/i, ruleId: 'vedic.yoga.pancha_mahapurusha.shasha', label: 'Shasha Yoga' },
  { re: /vipareeta|viparita|harsha yoga|sarala yoga|vimala yoga/i, ruleId: 'vedic.yoga.vipareeta_rajayoga', label: 'Vipareeta Rajayoga', requireActive: true },
  { re: /dharma[- ]karma/i, ruleId: 'vedic.yoga.rajayoga.dharma_karmadhipati', label: 'Dharma-Karmadhipati Yoga' },
  { re: /parivartana|sign exchange/i, ruleId: 'vedic.yoga.parivartana', label: 'Parivartana' },
  { re: /vargottama/i, ruleId: 'vedic.varga.vargottama', label: 'Vargottama' },
  { re: /sade ?sati/i, ruleId: 'vedic.transit.sade_sati_ashtakavarga_modulated', label: 'Sade Sati' },
];

export interface ReadingViolation {
  kind: 'house_sign_mismatch' | 'dignity_mismatch' | 'unsupported_yoga' | 'certainty' | 'probability' | 'timing' | 'fear' | 'jargon' | 'stance' | 'summary_length';
  sentence: string;
  detail: string;
}

/** All user-visible text of a reading, keyed by where it appears. */
function readingTexts(r: StructuredReading): string[] {
  return [
    r.directAnswer.heading, r.directAnswer.text, r.mainTakeaway || '',
    ...r.keyFindings.flatMap((f) => [f.title, f.explanation, f.inDailyLife || '', f.relevance || '', f.qualification || '']),
    ...(r.prediction ? [r.prediction.what, r.prediction.why || '', r.prediction.influences || '', r.prediction.meaning || ''] : []),
    r.technicalEvidence,
  ].filter(Boolean);
}

function sentences(text: string): string[] {
  return text.split(/(?<=[.!?])\s+|\n+/).map((s) => s.trim()).filter(Boolean);
}

export function validateReading(r: StructuredReading, ctx: ContractContext): ReadingViolation[] {
  const v: ReadingViolation[] = [];
  const a = ctx.assessment;
  const an = ctx.analysis;
  const ord = (n: number) => `${n}${n === 1 ? 'st' : n === 2 ? 'nd' : n === 3 ? 'rd' : 'th'}`;

  for (const s of readingTexts(r).flatMap(sentences)) {
    // 1. House ↔ sign consistency for the chart's own house system (Whole Sign from the reference point)
    if (a && !OTHER_FRAME.test(s)) {
      const claims: Array<[string, number]> = [];
      for (const m of s.matchAll(new RegExp(`\\b(${SIGN_RE})\\b\\s*(?:\\(|,\\s*|—\\s*|-\\s*|is\\s+|as\\s+|in\\s+)?(?:your\\s+|the\\s+)?(\\d{1,2})(?:st|nd|rd|th)\\s+(?:house|bhava)`, 'gi'))) claims.push([SIGN_NAMES[m[1].toLowerCase()], +m[2]]);
      for (const m of s.matchAll(new RegExp(`\\b(\\d{1,2})(?:st|nd|rd|th)\\s+(?:house|bhava)\\s*(?:\\(|is\\s+|of\\s+|:\\s*|—\\s*|=\\s*)(?:the sign of\\s+|in\\s+)?(${SIGN_RE})\\b`, 'gi'))) claims.push([SIGN_NAMES[m[2].toLowerCase()], +m[1]]);
      for (const [sign, house] of claims) {
        if (house >= 1 && house <= 12 && a.houseSigns[house] !== sign) {
          const actualHouse = +(Object.entries(a.houseSigns).find(([, x]) => x === sign)?.[0] ?? 0);
          v.push({ kind: 'house_sign_mismatch', sentence: s, detail: `${sign} is the ${ord(actualHouse)} house in this chart, not the ${ord(house)}.` });
        }
      }
    }
    // 2. Dignity claims about natal planets
    if (an && !OTHER_FRAME.test(s) && !/\btransit/i.test(s)) {
      const dignityClaims: Array<[string, string]> = [];
      for (const m of s.matchAll(new RegExp(`\\b(exalted|debilitated)\\s+(${PLANET_RE})\\b`, 'gi'))) dignityClaims.push([m[2], m[1].toLowerCase()]);
      for (const m of s.matchAll(new RegExp(`\\b(${PLANET_RE})\\b(?:,)?\\s+(?:is|is also|remains|being|sits)\\s+(?:\\w+\\s+)?(exalted|debilitated)\\b`, 'gi'))) dignityClaims.push([m[1], m[2].toLowerCase()]);
      for (const [planet, claim] of dignityClaims) {
        const pl = an.planets.find((x) => x.planet.toLowerCase() === planet.toLowerCase());
        if (!pl) continue;
        const actual = /Exalted/.test(pl.dignity) ? 'exalted' : /Debilitated/.test(pl.dignity) ? 'debilitated' : 'neither';
        if (actual !== claim && !NEGATION.test(s)) v.push({ kind: 'dignity_mismatch', sentence: s, detail: `${pl.planet} is in ${pl.sign} (${pl.dignity}), not ${claim}.` });
      }
    }
    // 3. Named yogas must exist in the evaluated rules
    if (an) {
      for (const y of YOGA_CHECKS) {
        if (!y.re.test(s) || NEGATION.test(s)) continue;
        const fired = an.rules.filter((rule) => rule.ruleId === y.ruleId && rule.status !== 'suppressed' && (!y.requireActive || rule.status === 'active'));
        const ok = y.ruleId === 'vedic.yoga.neechabhanga_rajayoga'
          ? fired.some((rule) => rule.status === 'mitigated' || /Rajayoga/.test(rule.name))
          : fired.some((rule) => rule.status !== 'cancelled');
        if (!ok) v.push({ kind: 'unsupported_yoga', sentence: s, detail: `${y.label} is not present (or is cancelled) in the evaluated chart.` });
      }
    }
    // 4. Certainty, probabilities and fear language
    const certainty = s.match(/\b(definitely|certainly|guaranteed?|without (any )?doubt|100 ?%|for sure|inevitabl[ey]|is destined|are destined|will surely|bound to happen)\b/i);
    if (certainty && !/\b(no|not|cannot|can't|never|nothing|isn't|aren't)\b/i.test(s.slice(Math.max(0, certainty.index! - 40), certainty.index))) v.push({ kind: 'certainty', sentence: s, detail: `Absolute language "${certainty[0]}".` });
    if (/\b\d{1,3}(\.\d+)? ?%\s*(chance|probability|likel|odds)|\bodds of\b/i.test(s) && !/40–50%|40-50%|33%|base rate|of (all )?(charts|births|people)/i.test(s)) v.push({ kind: 'probability', sentence: s, detail: 'Numerical probability for a life event.' });
    if (/\b(doomed|will (die|divorce|be ruined)|curse on you|ruin your (life|marriage)|catastroph)/i.test(s) && !NEGATION.test(s)) v.push({ kind: 'fear', sentence: s, detail: 'Fear-based or fatalistic language.' });
  }

  // 5. The Summary must be readable without any astrology knowledge, and must keep the analysis' stance
  for (const s of sentences(`${r.directAnswer.heading}. ${r.directAnswer.text}`)) {
    const terms = summaryJargon(s, ctx.question);
    if (terms.length) v.push({ kind: 'jargon', sentence: s, detail: `The Summary uses technical terms (${terms.join(', ')}); explain the meaning in everyday words instead.` });
  }
  const summarySentences = sentences(r.directAnswer.text);
  const words = r.directAnswer.text.split(/\s+/).length;
  if (summarySentences.length > 6 || words > 130) v.push({ kind: 'summary_length', sentence: r.directAnswer.text, detail: `The Summary has ${summarySentences.length} sentences / ${words} words; keep it to 3–5 short sentences.` });
  if (a && a.balance !== 'insufficient') {
    if (a.balance !== 'mostly_supportive' && OVER_POSITIVE.test(r.directAnswer.text)) v.push({ kind: 'stance', sentence: r.directAnswer.text, detail: `The Summary is more optimistic than the established analysis (${a.balance.replace('_', ' ')}).` });
    if (a.balance !== 'mostly_challenging' && OVER_NEGATIVE.test(r.directAnswer.text)) v.push({ kind: 'stance', sentence: r.directAnswer.text, detail: `The Summary is more pessimistic than the established analysis (${a.balance.replace('_', ' ')}).` });
    if (a.confidence !== 'well_supported' && !HEDGE.test(r.directAnswer.text)) v.push({ kind: 'stance', sentence: r.directAnswer.text, detail: `The established analysis is ${a.confidence.replace('_', ' ')}; the Summary must say in plain words that this is a possibility, not a certainty.` });
  }

  // 6. Timing: predictions may only use years covered by the evaluated windows
  if (r.prediction) {
    const allowedYears = new Set<number>();
    for (const w of r.prediction.timing) for (let y = +w.start.slice(0, 4); y <= +w.end.slice(0, 4); y++) allowedYears.add(y);
    const ptext = [r.prediction.what, r.prediction.why, r.prediction.influences, r.prediction.meaning].filter(Boolean).join(' ');
    for (const m of ptext.matchAll(/\b(20\d\d|19\d\d)\b/g)) {
      if (!allowedYears.has(+m[1]) && +m[1] !== ctx.now.getUTCFullYear()) v.push({ kind: 'timing', sentence: m[1], detail: `Year ${m[1]} is outside every evaluated timing window.` });
    }
  }
  return v;
}

/**
 * Last-resort repair: removes violating sentences from user-visible fields. A Summary that cannot
 * be repaired sentence by sentence (wrong stance, or too little left) is replaced by `fallbackSummary`.
 */
export function removeViolations(r: StructuredReading, violations: ReadingViolation[], fallbackSummary = ''): StructuredReading {
  const bad = new Set(violations.filter((x) => x.kind !== 'stance' && x.kind !== 'summary_length').map((x) => x.sentence));
  const clean = (t?: string) => (t ? sentences(t).filter((s) => !bad.has(s)).join(' ') : t);
  const yearsBad = new Set(violations.filter((x) => x.kind === 'timing').map((x) => x.sentence));
  const cleanPred = (t?: string) => (t ? sentences(clean(t) || '').filter((s) => ![...yearsBad].some((y) => s.includes(y))).join(' ') : t);
  let summary = sentences(clean(r.directAnswer.text) || '');
  if (violations.some((x) => x.kind === 'summary_length')) summary = summary.slice(0, 5);
  const summaryText = violations.some((x) => x.kind === 'stance') || summary.length < 2 ? fallbackSummary || summary.join(' ') || r.directAnswer.text : summary.join(' ');
  const headingBad = bad.has(r.directAnswer.heading) || bad.has(`${r.directAnswer.heading}.`);
  return {
    ...r,
    directAnswer: { heading: headingBad ? r.domainLabel || 'Your reading' : r.directAnswer.heading, text: summaryText },
    mainTakeaway: clean(r.mainTakeaway),
    keyFindings: r.keyFindings.map((f) => ({ ...f, explanation: clean(f.explanation) || '', inDailyLife: clean(f.inDailyLife), relevance: clean(f.relevance), qualification: clean(f.qualification) })).filter((f) => f.explanation),
    prediction: r.prediction ? { ...r.prediction, what: cleanPred(r.prediction.what) || '', why: cleanPred(r.prediction.why), influences: cleanPred(r.prediction.influences), meaning: cleanPred(r.prediction.meaning) } : null,
    technicalEvidence: r.technicalEvidence.split('\n').map((line) => clean(line) ?? '').join('\n'),
  };
}

/** Plain-text rendering used for copy, saved reports and conversation history. */
export function readingToMarkdown(r: StructuredReading): string {
  const parts = [`## ${r.directAnswer.heading}`, '**Summary**', r.directAnswer.text];
  if (r.mainTakeaway) parts.push(`**${r.mainTakeaway}**`);
  if (r.keyFindings.length) parts.push('### What this means for you', ...r.keyFindings.map((f) => `- **${f.title}** — ${f.explanation}${f.inDailyLife ? ` In everyday life: ${f.inDailyLife}` : ''}`));
  if (r.prediction) {
    parts.push('### What could happen', r.prediction.what);
    for (const t of r.prediction.timing) parts.push(`- ${t.start} → ${t.end}: ${t.period} — ${t.theme}`);
  }
  if (r.confidenceLabel) parts.push(`*${r.confidenceLabel}.*`);
  return parts.join('\n\n');
}
