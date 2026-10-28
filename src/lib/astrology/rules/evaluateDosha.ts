import type { ChartData } from '@/types';
import { analyzeVedicChart } from './vedicAnalysis';

export interface EvaluatedDosha {
  name: string;
  hasDosha: boolean;
  severity: 'none' | 'mild' | 'moderate' | 'high';
  factors: string[];
  remedySummary: string;
  recommendedUpayas: string[];
  traditionalCitations: string[];
}

/**
 * Manglik / Kuja Dosha with the eight documented Parihara (cancellation) predicates
 * (DOCUMENT_06 `vedic.dosha.manglik_with_parihara`; Muhurta Chintamani, Prashna Marga Ch. 21).
 */
export function evaluateMangalDosha(chart: ChartData): {
  hasDosha: boolean;
  isCancelled: boolean;
  cancellationReason: string;
  marsHouse: number;
  marsSign: string;
} {
  const mars = chart.planets.find((p) => p.planet === 'Mars');
  const rule = analyzeVedicChart(chart).rules.find((r) => r.ruleId === 'vedic.dosha.manglik_with_parihara');
  const evaluated = !!rule && rule.status !== 'suppressed';
  const isCancelled = evaluated && rule!.status === 'cancelled';
  return {
    hasDosha: evaluated,
    isCancelled,
    cancellationReason: isCancelled ? rule!.reasons.join(' ') : 'None applied',
    marsHouse: mars?.house || 1,
    marsSign: mars?.sign || 'Unknown',
  };
}

/**
 * Kala Sarpa configuration — evaluated on exact longitudes, and always reported with the
 * DOCUMENT_05/06 disclosure that it is absent from the classical treatises.
 */
export function evaluateKaalSarpDosha(chart: ChartData): {
  hasDosha: boolean;
  type: string;
  explanation: string;
} {
  const rule = analyzeVedicChart(chart).rules.find((r) => r.ruleId === 'vedic.dosha.kala_sarpa_historical_audit');
  const disclosure = 'Kala Sarpa is a 20th-century popular construct that does not appear in Brihat Parashara Hora Shastra, Brihat Jataka, Phaladeepika or Saravali; classical analysis reads the individual house placements instead.';
  if (!rule) {
    return { hasDosha: false, type: 'None', explanation: `Planets fall on both sides of the Rahu–Ketu axis. ${disclosure}` };
  }
  return { hasDosha: true, type: 'Hemispheric concentration (non-classical)', explanation: `All seven planets lie on one side of the Rahu–Ketu axis. ${disclosure}` };
}

/**
 * Sade Sati: CURRENT transiting Saturn in the 12th, 1st or 2nd sign from the natal Moon
 * (Phaladeepika Ch. 26; DOCUMENT_03 §9.1).
 */
export function evaluateSadeSati(chart: ChartData, now: Date = new Date()): {
  isActive: boolean;
  phase: 'Rising' | 'Peak' | 'Setting' | 'None';
  saturnSign: string;
  moonSign: string;
  description: string;
} {
  const analysis = analyzeVedicChart(chart, { now });
  const saturn = analysis.transits.positions.find((p) => p.planet === 'Saturn');
  const moonSign = analysis.chandraLagna.sign;
  const phase = analysis.transits.sadeSati.phase;
  const map = { 'Rising (12th from Moon)': 'Rising', 'Peak (over natal Moon)': 'Peak', 'Setting (2nd from Moon)': 'Setting' } as const;
  const descriptions = {
    Rising: 'Transiting Saturn is in the 12th sign from the natal Moon — the opening phase, traditionally linked with expenses and mental preparation.',
    Peak: 'Transiting Saturn is over the natal Moon sign — traditionally a phase of personal restructuring, responsibility and maturity.',
    Setting: 'Transiting Saturn is in the 2nd sign from the natal Moon — the closing phase, traditionally linked with family and financial consolidation.',
    None: 'Transiting Saturn is outside the 12th, 1st and 2nd signs from the natal Moon.',
  };
  const short = phase ? map[phase] : 'None';
  return {
    isActive: !!phase,
    phase: short,
    saturnSign: saturn?.sign || 'Unknown',
    moonSign,
    description: descriptions[short],
  };
}

export function evaluateDoshas(chart: ChartData): EvaluatedDosha[] {
  const m = evaluateMangalDosha(chart);
  const k = evaluateKaalSarpDosha(chart);
  const s = evaluateSadeSati(chart);

  // Remedies follow DOCUMENT_05 §5.2: behavioural first, then charity, then optional contemplative
  // practice for those who value it. No paid rituals or gemstones are presented as cures.
  return [
    {
      name: 'Mangal Dosha (Kuja Dosha)',
      hasDosha: m.hasDosha && !m.isCancelled,
      severity: m.hasDosha && !m.isCancelled ? 'mild' : 'none',
      factors: [
        `Mars in House ${m.marsHouse} (${m.marsSign}).`,
        m.isCancelled ? `Cancellation: ${m.cancellationReason}` : m.hasDosha ? 'No classical cancellation found.' : 'Mars is not in a Manglik house from Lagna.',
      ],
      remedySummary: 'Traditionally read as strong Martian assertiveness in close relationships; the documented approach is conscious communication and channelling energy into physical activity.',
      recommendedUpayas: ['Regular physical exercise or martial practice (Mars)', 'Deliberate, patient communication in close relationships', 'Optional: Hanuman Chalisa or other devotional practice if it is meaningful to you'],
      traditionalCitations: ['Muhurta Chintamani, Vivaha Prakarana', 'Prashna Marga, Ch. 21'],
    },
    {
      name: 'Kaal Sarp Yoga',
      hasDosha: k.hasDosha,
      severity: 'none',
      factors: [k.explanation],
      remedySummary: 'Not a classical Dosha; no remedy is required by the classical texts.',
      recommendedUpayas: ['Read the actual house placements of Rahu and Ketu instead'],
      traditionalCitations: ['Light on Life (de Fouw & Svoboda) — historical audit', 'Brihat Parashara Hora Shastra, Ch. 35 (Sarpa Yoga only)'],
    },
    {
      name: 'Shani Sade Sati',
      hasDosha: s.isActive,
      severity: s.isActive ? 'mild' : 'none',
      factors: [s.description],
      remedySummary: 'Framed classically as a 7.5-year cycle of maturation, responsibility and restructuring; its experience depends on the running Dasha.',
      recommendedUpayas: ['Disciplined routines and keeping commitments (Saturn)', 'Service to elders or those doing hard labour (Dana)'],
      traditionalCitations: ['Phaladeepika, Ch. 26 (Gochara)'],
    },
  ];
}
