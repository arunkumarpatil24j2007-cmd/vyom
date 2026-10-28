/**
 * Repeatability evaluation (§17.8–17.9). Asks the same questions several times with identical inputs
 * (answer cache disabled, so every run is a fresh generation) and measures whether the material
 * conclusions stay the same. Wording may differ; judgements may not.
 *
 * Metrics:
 *  - analysis agreement: established balance / confidence / factor roles / windows identical across runs
 *  - timing agreement: every timeline entry comes from the evaluated windows; outlook presence stable
 *  - finding overlap: mean pairwise Jaccard of the evidence cited by key findings (informational)
 *  - chart-fact contradictions: validator violations remaining in final answers
 *  - stance agreement: a model-judged check that the direct answers convey the same conclusion and
 *    match the established balance (labelled as model-judged, not ground truth)
 *  - changed-input handling and non-perpetuation of earlier errors
 *
 * Run: npm run eval:repeat   → data/evaluation/repeatability_latest.{json,md}
 */
import fs from 'node:fs';
import path from 'node:path';
import { runConsultation, getAiConfig } from '../src/server/aiPlugin.ts';
import { prepareConsultation, readingViolations, type ConsultationRequest } from '../src/server/consultation/buildConsultation.ts';
import type { VisualAnswerResponse } from '../src/types/visualAnswer.ts';

const RUNS = Number(process.env.REPEAT_RUNS || 3);
const REL = { birthDate: '1995-02-15', birthTime: '12:30', birthTimePrecision: 'exact' as const, latitude: 12.9716, longitude: 77.5946, timezone: 'Asia/Kolkata' };
const BENCH = { birthDate: '2000-01-01', birthTime: '12:00', birthTimePrecision: 'exact' as const, latitude: 28.6139, longitude: 77.209, timezone: 'Asia/Kolkata' };
const UNKNOWN = { ...REL, birthTime: '', birthTimePrecision: 'unknown' as const };

const REPEAT_CASES: Array<{ id: string; label: string; request: ConsultationRequest }> = [
  { id: 'R1', label: 'Same relationship question', request: { question: 'What does my chart say about my relationships and marriage?', birthDetails: REL } },
  { id: 'R2', label: 'Same marriage-timing question', request: { question: 'When is marriage most likely to happen for me?', birthDetails: REL } },
  { id: 'R3', label: 'Conflicting indicators (career)', request: { question: 'Is my chart good for career success?', birthDetails: BENCH } },
  { id: 'R4', label: 'Incomplete chart (unknown birth time)', request: { question: 'What does my chart say about marriage?', birthDetails: UNKNOWN } },
  { id: 'R5', label: 'Uncertain-timing prediction', request: { question: 'What do the next few years hold for my career?', birthDetails: BENCH } },
];

const words = (s: string) => new Set(s.toLowerCase().split(/\W+/).filter(Boolean));
const jaccard = (a: Set<string>, b: Set<string>) => (a.size + b.size === 0 ? 1 : [...a].filter((x) => b.has(x)).length / new Set([...a, ...b]).size);
const pairs = <T,>(xs: T[]) => xs.flatMap((x, i) => xs.slice(i + 1).map((y) => [x, y] as [T, T]));

async function judgeStance(question: string, balance: string, answers: string[]): Promise<{ consistent: boolean; matchesBalance: boolean[]; note: string } | null> {
  const config = getAiConfig();
  if (!config.geminiApiKey) return null;
  const prompt = `You are checking an astrology product for consistency. The question was: "${question}". The fixed analytical judgement is "${balance}" (mostly_supportive | mixed | mostly_challenging | insufficient).
Here are ${answers.length} answers generated independently for identical inputs:
${answers.map((a, i) => `Answer ${i + 1}: ${a}`).join('\n')}
Wording differences, extra detail and different examples are acceptable. A material contradiction is a change in the main conclusion, in how favourable/challenging the picture is, in timing, or in certainty.
Return JSON: {"consistent": true|false, "matchesBalance": [true|false per answer], "note": "one sentence"}`;
  for (const model of [config.geminiModel, 'gemini-2.5-flash', 'gemini-3.5-flash-lite']) {
    try {
      const res = await fetch(`${config.geminiBaseUrl}/models/${model}:generateContent?key=${config.geminiApiKey}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { responseMimeType: 'application/json', temperature: 0 } }),
      });
      if (!res.ok) continue;
      const data = await res.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
      return JSON.parse(data.candidates?.[0]?.content?.parts?.[0]?.text || 'null');
    } catch { /* try next model */ }
  }
  return null;
}

async function main() {
  const report: Record<string, unknown>[] = [];
  const totals = { analysisAgree: 0, analysisTotal: 0, timingOk: 0, timingTotal: 0, outlookStable: 0, violations: 0, stanceConsistent: 0, stanceJudged: 0, balanceMatches: 0, balanceJudged: 0, overlap: [] as number[], failures: 0 };

  for (const c of REPEAT_CASES) {
    const answers: VisualAnswerResponse[] = [];
    for (let i = 0; i < RUNS; i++) {
      const a = await runConsultation(c.request, undefined, { useCache: false });
      if (a?.reading) answers.push(a); else totals.failures++;
      await new Promise((r) => setTimeout(r, 1500));
    }
    const prepared = prepareConsultation(c.request);
    const expectedSig = prepared.assessment ? answers[0]?.reading?.analysisSignature : undefined;
    const sigs = answers.map((a) => a.reading!.analysisSignature);
    const analysisAgree = sigs.every((s) => s === sigs[0]) && (!expectedSig || sigs[0] === expectedSig);
    totals.analysisTotal++; if (analysisAgree) totals.analysisAgree++;

    const windowIds = new Set(prepared.assessment?.timing.windows.map((w) => `${w.start}|${w.end}`) || []);
    const timingOk = answers.every((a) => (a.reading!.prediction?.timing || []).every((t) => windowIds.has(`${t.start}|${t.end}`)));
    totals.timingTotal++; if (timingOk) totals.timingOk++;
    const outlookStable = new Set(answers.map((a) => !!a.reading!.prediction)).size === 1;
    if (outlookStable) totals.outlookStable++;

    const violations = answers.flatMap((a) => readingViolations(a.reading!, prepared).map((v) => `${v.kind}: ${v.detail}`));
    totals.violations += violations.length;

    const evidenceSets = answers.map((a) => new Set(a.reading!.keyFindings.flatMap((f) => f.evidence)));
    const overlap = pairs(evidenceSets).map(([x, y]) => jaccard(x, y));
    const meanOverlap = overlap.length ? overlap.reduce((s, x) => s + x, 0) / overlap.length : 1;
    totals.overlap.push(meanOverlap);
    const wording = pairs(answers.map((a) => words(a.reading!.directAnswer.text))).map(([x, y]) => jaccard(x, y));

    const judge = answers.length >= 2 ? await judgeStance(c.request.question, prepared.assessment?.balance || 'insufficient', answers.map((a) => a.reading!.directAnswer.text)) : null;
    if (judge) {
      totals.stanceJudged++; if (judge.consistent) totals.stanceConsistent++;
      for (const m of judge.matchesBalance || []) { totals.balanceJudged++; if (m) totals.balanceMatches++; }
    }
    const line = `${c.id} ${c.label}: runs=${answers.length}/${RUNS} analysis=${analysisAgree ? 'identical' : 'DIFFERENT'} timing=${timingOk ? 'within windows' : 'OUT OF WINDOWS'} outlook=${outlookStable ? 'stable' : 'UNSTABLE'} violations=${violations.length} evidenceOverlap=${meanOverlap.toFixed(2)} wordingOverlap=${(wording.reduce((s, x) => s + x, 0) / Math.max(1, wording.length)).toFixed(2)} stance=${judge ? (judge.consistent ? 'consistent' : 'CONTRADICTORY') : 'not judged'}`;
    console.log(line);
    report.push({ ...c, line, signatures: sigs, violations, judge, answers: answers.map((a) => ({ heading: a.reading!.directAnswer.heading, text: a.reading!.directAnswer.text, confidence: a.reading!.confidenceLabel, outlookWindows: a.reading!.prediction?.timing.map((t) => `${t.start}→${t.end}`) })) });
  }

  // ─── Changed inputs must trigger re-analysis (§17.5) ───
  const before = await runConsultation({ question: 'What does my chart say about marriage?', birthDetails: REL }, undefined, { useCache: false });
  const corrected = await runConsultation({
    question: 'What does my chart say about marriage?', birthDetails: { ...REL, birthTime: '14:30' },
    birthDetailsChanged: { previous: '1995-02-15, 12:30, Bengaluru', current: '1995-02-15, 14:30, Bengaluru', previousBirthDetails: REL },
    conversationHistory: before ? [{ role: 'user', content: 'What does my chart say about marriage?' }, { role: 'assistant', content: before.blocks[0].type === 'markdown' ? before.blocks[0].content : before.summary }] : [],
  }, undefined, { useCache: false });
  const changedOk = !!before?.reading && !!corrected?.reading && before.reading.analysisSignature !== corrected.reading.analysisSignature;
  console.log(`C1 Corrected birth time re-analysed: ${changedOk ? 'yes' : 'NO'}`);
  report.push({ id: 'C1', label: 'Corrected birth data triggers re-analysis', passed: changedOk, before: before?.reading?.directAnswer, after: corrected?.reading?.directAnswer });

  // ─── Earlier errors must not be perpetuated (§17.6) ───
  const erroneous = 'Your 7th house is ruled by Mars, which sits in Cancer, your 6th house, and an exalted Jupiter guarantees a happy marriage through a powerful Gajakesari Yoga.';
  const followUp = await runConsultation({
    question: 'Can you explain that marriage reading again more simply?', birthDetails: REL,
    conversationHistory: [{ role: 'user', content: 'What does my chart say about marriage?' }, { role: 'assistant', content: erroneous }],
  }, undefined, { useCache: false });
  const p2 = prepareConsultation({ question: 'Can you explain that marriage reading again more simply?', birthDetails: REL });
  const perpetuated = followUp?.reading ? readingViolations(followUp.reading, p2) : [];
  const fuText = followUp?.reading ? JSON.stringify(followUp.reading) : '';
  const repeatsError = /6th house|exalted Jupiter|Gajakesari|guarantee/i.test(fuText.replace(/not (be )?(a )?guarantee|cannot guarantee|no guarantee/gi, ''));
  const errorOk = !!followUp?.reading && perpetuated.length === 0 && !repeatsError;
  console.log(`E1 Earlier erroneous answer not perpetuated: ${errorOk ? 'yes' : 'NO'}${repeatsError ? ' (repeats an earlier error)' : ''}`);
  report.push({ id: 'E1', label: 'Earlier errors are corrected, not repeated', passed: errorOk, answer: followUp?.reading?.directAnswer, violations: perpetuated });

  const pct = (a: number, b: number) => (b ? `${Math.round((100 * a) / b)}%` : 'n/a');
  const summary = {
    runsPerCase: RUNS,
    analysisAgreement: pct(totals.analysisAgree, totals.analysisTotal),
    timingWithinWindows: pct(totals.timingOk, totals.timingTotal),
    outlookPresenceStable: pct(totals.outlookStable, REPEAT_CASES.length),
    finalChartContradictions: totals.violations,
    stanceConsistency_modelJudged: pct(totals.stanceConsistent, totals.stanceJudged),
    matchesEstablishedBalance_modelJudged: pct(totals.balanceMatches, totals.balanceJudged),
    meanEvidenceOverlap: (totals.overlap.reduce((s, x) => s + x, 0) / Math.max(1, totals.overlap.length)).toFixed(2),
    changedInputReanalysed: changedOk,
    earlierErrorsNotPerpetuated: errorOk,
    generationFailures: totals.failures,
  };
  // Acceptance thresholds
  const thresholds = {
    analysisAgreement: totals.analysisAgree === totals.analysisTotal,
    timingWithinWindows: totals.timingOk === totals.timingTotal,
    noChartContradictions: totals.violations === 0,
    stanceConsistency: totals.stanceJudged === 0 || totals.stanceConsistent / totals.stanceJudged >= 0.8,
    changedInputs: changedOk,
    noErrorPerpetuation: errorOk,
  };
  console.log('\nSummary', summary, '\nThresholds met', thresholds);
  const outDir = path.resolve(process.cwd(), 'data/evaluation');
  fs.writeFileSync(path.join(outDir, 'repeatability_latest.json'), JSON.stringify({ runAt: new Date().toISOString(), summary, thresholds, report }, null, 2));
  process.exitCode = Object.values(thresholds).every(Boolean) ? 0 : 1;
}

main();
