/**
 * Tests for the answer-first reading pipeline: deterministic question assessment, the response
 * contract, the chart-consistency validator, prompt assembly, caching and repeatability.
 * Run: npm test
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateNatalChart } from '../src/lib/astrology/calculations/chartEngine.ts';
import { analyzeVedicChart } from '../src/lib/astrology/rules/vedicAnalysis.ts';
import { assessDomain } from '../src/lib/astrology/rules/domainAssessment.ts';
import { buildReading, validateReading, removeViolations, plainSummary, summaryJargon, hasReadingOutput, type ContractContext } from '../src/server/consultation/responseContract.ts';
import { prepareConsultation, finalizeAnswer, readingFromOutput } from '../src/server/consultation/buildConsultation.ts';
import { cacheKey } from '../src/server/consultation/answerCache.ts';
import type { StructuredReading } from '../src/types/visualAnswer.ts';

const NOW = new Date('2026-10-28T12:00:00Z');
// The relationship reading that motivated this change: Taurus Lagna, 7th lord Mars debilitated in Cancer (3rd house)
const REL = { birthDate: '1995-02-15', birthTime: '12:30', birthTimePrecision: 'exact' as const, latitude: 12.9716, longitude: 77.5946, timezone: 'Asia/Kolkata' };
const relChart = () => calculateNatalChart({ name: 'x', ...REL, now: NOW });
const relContext = (): ContractContext => {
  const c = relChart();
  const analysis = analyzeVedicChart(c, { now: NOW });
  return { assessment: assessDomain(c, analysis, 'marriage', NOW), analysis, allowPrediction: true, now: NOW };
};
const reading = (over: Partial<StructuredReading> = {}): StructuredReading => ({
  directAnswer: { heading: 'h', text: 'Your chart suggests relationships grow through patience.' },
  confidence: 'tentative', confidenceLabel: 'Tentative reading', confidenceReasons: [], keyFindings: [], prediction: null,
  supportingFactors: [], challengingFactors: [], mitigatingFactors: [], technicalEvidence: '', calculationNotes: [], uncertainties: [], missingInformation: [],
  ...over,
});

// ═══ Stage B/C: deterministic assessment ═══

test('Relationship case: multi-factor assessment with challenge, mitigation and support', () => {
  const { assessment: a } = relContext();
  const role = (id: string) => a!.factors.find((f) => f.id === id)?.role;
  assert.equal(a!.houseSigns[1], 'Taurus');
  assert.equal(a!.houseSigns[7], 'Scorpio');
  assert.equal(a!.houseSigns[3], 'Cancer');
  assert.equal(role('f-dignity-Mars'), 'challenging', '7th lord Mars debilitated');
  assert.equal(role('f-cancel-Mars'), 'mitigating', 'Neechabhanga only partially mitigates (one Kendra clause from each reference)');
  assert.equal(role('f-occupant-7-Jupiter'), 'supporting');
  assert.equal(role('f-aspect-7-Saturn'), 'supporting', 'Yogakaraka Saturn aspects the 7th');
  assert.equal(role('f-dusthana-Venus'), 'challenging', 'Venus in the 8th');
  assert.equal(a!.balance, 'mixed');
  assert.equal(a!.confidence, 'tentative');
  assert.ok(a!.timing.assessable);
  assert.ok(a!.factors.every((f) => !/\b(7th lord|bhava|neecha)\b/i.test(f.plain)), 'plain statements carry no jargon');
});

test('Neechabhanga wording no longer reads as "exalted Jupiter" (root cause of a fabricated claim)', () => {
  const nb = relContext().analysis!.rules.find((r) => r.ruleId === 'vedic.yoga.neechabhanga_rajayoga' && r.planets[0] === 'Mars')!;
  assert.ok(nb.reasons.some((r) => /not itself exalted/.test(r)));
  assert.ok(!nb.reasons.some((r) => /Jupiter \(exalted in Cancer\)/.test(r)));
});

test('Repeatability: identical inputs give an identical assessment', () => {
  assert.deepEqual(relContext().assessment, relContext().assessment);
  const p1 = prepareConsultation({ question: 'What does my chart say about marriage?', birthDetails: REL, now: NOW.toISOString() });
  const p2 = prepareConsultation({ question: 'What does my chart say about marriage?', birthDetails: REL, now: NOW.toISOString() });
  const section = (s: string) => s.slice(s.indexOf('## ESTABLISHED ANALYSIS'), s.indexOf('## Retrieved classical passages'));
  assert.equal(section(p1.systemPrompt), section(p2.systemPrompt));
});

test('Changed inputs trigger re-analysis (corrected birth time changes the Lagna-based assessment)', () => {
  const a1 = relContext().assessment!;
  const c2 = calculateNatalChart({ name: 'x', ...REL, birthTime: '14:30', now: NOW });
  const a2 = assessDomain(c2, analyzeVedicChart(c2, { now: NOW }), 'marriage', NOW);
  assert.notEqual(a2.houseSigns[1], a1.houseSigns[1]);
  assert.notDeepEqual(a2.factors.map((f) => f.id), a1.factors.map((f) => f.id));
});

test('Incomplete chart: unknown time → Moon reference, tentative, no timing, missing info stated', () => {
  const c = calculateNatalChart({ name: 'x', ...REL, birthTime: '', birthTimePrecision: 'unknown', now: NOW });
  const a = assessDomain(c, analyzeVedicChart(c, { now: NOW }), 'marriage', NOW);
  assert.equal(a.reference, 'moon');
  assert.notEqual(a.confidence, 'well_supported');
  assert.equal(a.timing.assessable, false);
  assert.equal(a.timing.windows.length, 0);
  assert.ok(a.missingInformation.some((m) => /birth time/i.test(m)));
});

// ═══ Validator (calculation-consistency checks) ═══

test('Regression: the old report\'s conflicting Cancer house assignment is caught', () => {
  const ctx = relContext();
  const v = validateReading(reading({ technicalEvidence: 'The 7th lord Mars sits in Cancer, your 6th house, while Mars in Cancer (3rd house) is debilitated.' }), ctx);
  const houseErrors = v.filter((x) => x.kind === 'house_sign_mismatch');
  assert.equal(houseErrors.length, 1, JSON.stringify(v));
  assert.match(houseErrors[0].detail, /Cancer is the 3rd house/);
});

test('Validator catches fabricated dignity, absent yogas, certainty and invented probabilities', () => {
  const ctx = relContext();
  const kinds = (text: string) => validateReading(reading({ directAnswer: { heading: 'h', text } }), ctx).map((x) => x.kind);
  assert.ok(kinds('The dispositor and an exalted Jupiter occupy key angles.').includes('dignity_mismatch'), 'before-example fabrication');
  assert.ok(kinds('Mars is exalted here.').includes('dignity_mismatch'));
  assert.ok(kinds('A strong Gajakesari Yoga protects your marriage.').includes('unsupported_yoga'));
  assert.ok(kinds('You will definitely marry a wonderful partner.').includes('certainty'));
  assert.ok(kinds('There is a 70% chance of marriage soon.').includes('probability'));
  assert.ok(kinds('Your marriage is doomed.').includes('fear'));
});

test('Validator accepts correct, qualified statements', () => {
  const ctx = relContext();
  const v = validateReading(reading({
    keyFindings: [{ title: 't', role: 'mixed', evidence: [], explanation: 'Mars in Cancer (3rd house) is debilitated, but Neechabhanga partly offsets it. Scorpio, your 7th house, holds Jupiter. Astrology cannot guarantee outcomes.' }],
    technicalEvidence: 'Venus in Sagittarius, your 8th house. Jupiter is not exalted. In the Navamsha, Venus is in Virgo.',
  }), ctx);
  assert.deepEqual(v, []);
});

test('Timing: prediction years must fall inside the evaluated windows', () => {
  const ctx = relContext();
  const w = ctx.assessment!.timing.windows[0];
  const r = buildReading({ direct_answer: { heading: 'h', text: 't' }, key_findings: [], prediction: { what: 'Relationship themes are emphasised in 2041.', window_ids: [w.id] } }, ctx)!;
  assert.ok(validateReading(r, ctx).some((x) => x.kind === 'timing'));
  const fixed = removeViolations(r, validateReading(r, ctx));
  assert.ok(!fixed.prediction!.what.includes('2041'));
});

// ═══ Response contract ═══

test('Contract: roles come from the assessment, not from the model', () => {
  const ctx = relContext();
  const r = buildReading({
    direct_answer: { heading: 'Relationships need care', text: 'Mixed picture.' },
    key_findings: [
      { factor_ids: ['f-dignity-Mars'], title: 'Mars', explanation: 'A great strength!' },
      { factor_ids: ['f-dignity-Mars', 'f-cancel-Mars'], title: 'Mars softened', explanation: 'x' },
      { factor_ids: ['made-up-id'], title: 'Invented', explanation: 'y' },
    ],
  }, ctx)!;
  assert.equal(r.keyFindings[0].role, 'challenging');
  assert.equal(r.keyFindings[1].role, 'mixed');
  assert.equal(r.keyFindings[2].role, 'information');
  assert.deepEqual(r.keyFindings[2].evidence, []);
  assert.equal(r.confidence, ctx.assessment!.confidence);
  assert.equal(r.supportingFactors.length, ctx.assessment!.factors.filter((f) => f.role === 'supporting').length);
});

test('Contract: unsupported predictions are dropped; invented windows ignored', () => {
  const ctx = relContext();
  const pred = { what: 'A relationship milestone may develop.', window_ids: ['w-invented-2030', ctx.assessment!.timing.windows[0].id] };
  const r = buildReading({ direct_answer: { heading: 'h', text: 't' }, key_findings: [], prediction: pred }, ctx)!;
  assert.equal(r.prediction!.timing.length, 1);
  assert.equal(buildReading({ direct_answer: { heading: 'h', text: 't' }, prediction: pred }, { ...ctx, allowPrediction: false })!.prediction, null, 'high-risk questions get no outlook');
  assert.equal(buildReading({ direct_answer: { heading: 'h', text: 't' }, prediction: pred }, { ...ctx, assessment: null })!.prediction, null, 'no chart, no prediction');
  const unknown = calculateNatalChart({ name: 'x', ...REL, birthTime: '', birthTimePrecision: 'unknown', now: NOW });
  const ua = analyzeVedicChart(unknown, { now: NOW });
  const ur = buildReading({ direct_answer: { heading: 'h', text: 't' }, prediction: pred }, { assessment: assessDomain(unknown, ua, 'marriage', NOW), analysis: ua, allowPrediction: true, now: NOW })!;
  assert.deepEqual(ur.prediction!.timing, [], 'missing timing data never yields dates');
});

test('Contract: malformed model output is handled safely', () => {
  const ctx = relContext();
  assert.equal(buildReading(null, ctx), null);
  assert.equal(buildReading('not json', ctx), null);
  assert.equal(buildReading({ direct_answer: { heading: 'only heading' } }, ctx), null);
  const r = buildReading({ direct_answer: { text: 'Answer.' }, key_findings: 'oops', prediction: 'later', uncertainties: [1, null, 'real'] }, ctx)!;
  assert.equal(r.directAnswer.heading, 'Relationships & marriage');
  assert.deepEqual(r.keyFindings, []);
  assert.equal(r.prediction, null);
  assert.ok(r.uncertainties.includes('real'));
});

test('finalizeAnswer: structured reading, legacy-compatible blocks, citations only from retrieval, no internals', () => {
  const prepared = prepareConsultation({ question: 'What does my chart say about marriage?', birthDetails: REL, now: NOW.toISOString() });
  const parsed = {
    summary: 'Your chart suggests a two-sided picture, as an AI model sees in the JSON.',
    direct_answer: { heading: 'Partnership grows with patience' },
    key_findings: [{ factor_ids: ['f-dignity-Mars'], title: 't', explanation: 'e' }],
    cited_passage_ids: [prepared.passages[0]?.id, 'fabricated'],
  };
  const out = finalizeAnswer(parsed, prepared);
  assert.ok(out.reading);
  assert.equal(out.category, 'relationship');
  assert.ok(!/AI model|JSON/.test(out.reading!.directAnswer.text));
  assert.ok(out.blocks.filter((b) => b.type === 'source').length <= 1);
  assert.match((out.blocks[0] as { content: string }).content, /\[analysis: marriage\|mixed\|tentative/);
  assert.equal(readingFromOutput({ nonsense: true }, prepared), null);
});

// ═══ Prompt and consistency ═══

test('Prompt: answer-first rules and fixed analysis are present', () => {
  const p = prepareConsultation({ question: 'What does my chart say about marriage?', birthDetails: REL, now: NOW.toISOString() });
  assert.match(p.systemPrompt, /Every answer begins with the SUMMARY/);
  assert.match(p.systemPrompt, /"summary"/);
  assert.match(p.systemPrompt, /"in_daily_life"/);
  assert.match(p.systemPrompt, /ESTABLISHED ANALYSIS for this question/);
  assert.match(p.systemPrompt, /"overallBalance":"mixed"/);
  assert.match(p.systemPrompt, /"direct_answer"/);
  assert.ok(!/Be specific to this chart: name the placements/.test(p.systemPrompt), 'jargon-first instruction removed');
});

test('Consistency: an earlier answer with a different analysis triggers a correction note; same analysis does not', () => {
  const base = prepareConsultation({ question: 'What does my chart say about marriage?', birthDetails: REL, now: NOW.toISOString() });
  const sig = (base.assessment && `marriage|${base.assessment.balance}|${base.assessment.confidence}|${base.assessment.timing.windows.map((w) => w.id).join(',') || 'no-windows'}|${base.assessment.factors.map((f) => `${f.id}:${f.role}`).join(',')}`)!;
  const ask = (earlierSig: string) => prepareConsultation({
    question: 'Tell me again about my marriage prospects',
    birthDetails: REL,
    now: NOW.toISOString(),
    conversationHistory: [{ role: 'user', content: 'Marriage?' }, { role: 'assistant', content: `Earlier answer.\n\n[analysis: ${earlierSig}]` }],
  }).systemPrompt;
  assert.ok(!/## Consistency note/.test(ask(sig)));
  assert.match(ask('marriage|mostly_challenging|well_supported|x|y'), /## Consistency note/);
});

test('High-risk questions never get an outlook', () => {
  const p = prepareConsultation({ question: 'Will my marriage partner die early according to my chart?', birthDetails: REL, now: NOW.toISOString() });
  assert.equal(p.allowPrediction, false);
});

// ═══ Cache invalidation ═══

test('Answer cache key: stable for identical requests, invalidated by any relevant change', () => {
  const req = { question: 'What does my chart say about marriage?', birthDetails: REL };
  const k = cacheKey(req, 'v1', false, NOW);
  assert.equal(cacheKey({ ...req, question: '  what does my chart say about MARRIAGE ' }, 'v1', false, NOW), k);
  assert.notEqual(cacheKey({ ...req, birthDetails: { ...REL, birthTime: '12:31' } }, 'v1', false, NOW), k);
  assert.notEqual(cacheKey(req, 'v2', false, NOW), k, 'methodology change invalidates');
  assert.notEqual(cacheKey(req, 'v1', false, new Date('2026-10-29T12:00:00Z')), k, 'running periods are date-dependent');
  const hist = { ...req, conversationHistory: [{ role: 'user', content: 'career?' }] };
  assert.equal(cacheKey(hist, 'v1', false, NOW), k, 'history only matters for follow-ups');
  assert.notEqual(cacheKey(hist, 'v1', true, NOW), k);
});

test('Technical evidence is generated from the assessment when the model omits it', () => {
  const ctx = relContext();
  const r = buildReading({ direct_answer: { heading: 'h', text: 't' }, key_findings: [] }, ctx)!;
  assert.match(r.technicalEvidence, /factors evaluated/);
  assert.match(r.technicalEvidence, /Mars in Cancer \(3rd house\)/);
});

test('Medical and longevity questions get no chart judgement at all', () => {
  const p = prepareConsultation({ question: 'My grandfather is in the ICU in his Saturn Mahadasha — will he survive this week?', birthDetails: REL, now: NOW.toISOString() });
  assert.equal(p.assessment, null);
  assert.equal(p.allowPrediction, false);
});

// ═══ Plain-language Summary ═══

test('Summary filter: astrological terms are flagged, everyday words are not', () => {
  assert.deepEqual(summaryJargon('Your Venus in the 8th house is weak during this Dasha.'), ['venus', 'house', 'dasha']);
  assert.deepEqual(summaryJargon('Signs point to progress in several aspects of your life; this works in conjunction with your own effort in the 21st century.'), []);
  assert.deepEqual(summaryJargon('Saturn may make you more serious about your plans.', 'What does Saturn mean for me?'), [], 'terms the user used are allowed');
});

test('Summary validation: jargon, length and stance drift are violations', () => {
  const ctx = relContext();
  const kinds = (text: string) => validateReading(reading({ directAnswer: { heading: 'Relationships need patience', text } }), ctx).map((x) => x.kind);
  assert.ok(kinds('Your seventh lord is debilitated, so partnerships may need care.').includes('jargon'));
  assert.ok(kinds('You may find that relationships need patience. '.repeat(7)).includes('summary_length'));
  assert.ok(kinds('Your love life looks excellent and you may meet someone soon.').includes('stance'), 'more optimistic than a mixed analysis');
  assert.ok(kinds('Your relationships grow through patience and honest talks.').includes('stance'), 'a tentative analysis needs a plain uncertainty phrase');
  assert.deepEqual(kinds('Your relationships may need patience and honest conversations. For example, you might need to talk through different expectations. This is a possibility, not a certainty.'), []);
  assert.ok(validateReading(reading({ directAnswer: { heading: 'Your Venus explained', text: 'You may value calm, kind relationships.' } }), ctx).some((x) => x.kind === 'jargon'), 'the heading is part of the Summary');
});

test('Deterministic fallback Summary: plain, faithful to the analysis, repeatable', () => {
  const ctx = relContext();
  const s = plainSummary(ctx.assessment);
  assert.equal(s, plainSummary(relContext().assessment));
  assert.match(s, /two-sided picture for marriage and partnership/);
  assert.match(s, /possible theme rather than a firm conclusion/);
  assert.match(s, /does not identify a specific event or date/);
  assert.deepEqual(validateReading(reading({ directAnswer: { heading: 'Relationships grow with patience', text: s } }), ctx), []);
  for (const domain of ['personality', 'career', 'wealth', 'education', 'transitions'] as const) {
    const a = assessDomain(relChart(), ctx.analysis!, domain, NOW);
    assert.deepEqual(summaryJargon(plainSummary(a)), [], domain);
  }
  assert.equal(plainSummary(null), '');
});

test('Unrepairable Summary is replaced by the fallback; missing Summary is filled in', () => {
  const ctx = relContext();
  const bad = reading({ directAnswer: { heading: 'Great news', text: 'Your love life looks excellent. Everything will fall into place.' } });
  const fixed = removeViolations(bad, validateReading(bad, ctx), plainSummary(ctx.assessment));
  assert.equal(fixed.directAnswer.text, plainSummary(ctx.assessment));
  const prepared = prepareConsultation({ question: 'What does my chart say about marriage?', birthDetails: REL, now: NOW.toISOString() });
  assert.ok(hasReadingOutput({ direct_answer: { heading: 'h', text: 'Older answer shape.' } }), 'older output shape still accepted');
  assert.equal(readingFromOutput({ direct_answer: { heading: 'h', text: 'Mars is weak.' }, key_findings: [] }, prepared)!.directAnswer.text, plainSummary(prepared.assessment));
  const ok = readingFromOutput({ summary: 'You may need patience in relationships.', direct_answer: { heading: 'h' }, key_findings: [{ title: 't', explanation: 'e', in_daily_life: 'Talking calmly through a disagreement.' }] }, prepared)!;
  assert.equal(ok.directAnswer.text, 'You may need patience in relationships.');
  assert.equal(ok.keyFindings[0].inDailyLife, 'Talking calmly through a disagreement.');
});
