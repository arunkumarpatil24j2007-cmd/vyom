import type { DashaPeriod } from '../../../types/index.ts';
import { getNakshatraFromLongitude } from './nakshatras.ts';

export const DASHA_ORDER = [
  { planet: 'Ketu', years: 7 },
  { planet: 'Venus', years: 20 },
  { planet: 'Sun', years: 6 },
  { planet: 'Moon', years: 10 },
  { planet: 'Mars', years: 7 },
  { planet: 'Rahu', years: 18 },
  { planet: 'Jupiter', years: 16 },
  { planet: 'Saturn', years: 19 },
  { planet: 'Mercury', years: 17 },
];

// DOCUMENT_03 §8.1: Vyom defaults to the 365.2425-day Gregorian year for Dasha arithmetic.
export const DASHA_YEAR_DAYS = 365.2425;
const MS_PER_DASHA_YEAR = DASHA_YEAR_DAYS * 86400000;

function isoDate(ms: number): string {
  return new Date(ms).toISOString().split('T')[0];
}

export interface DashaBalance {
  nakshatra: string;
  startLord: string;
  balanceYears: number;
}

export function getDashaBalance(moonLongitude: number): DashaBalance {
  const nak = getNakshatraFromLongitude(moonLongitude);
  const lord = DASHA_ORDER.find((d) => d.planet === nak.lord) || DASHA_ORDER[0];
  return {
    nakshatra: nak.name,
    startLord: lord.planet,
    balanceYears: lord.years * (1.0 - nak.totalFraction),
  };
}

/**
 * Calculates the complete 120-year Vimshottari Mahadasha & Antardasha timeline from the Moon's
 * sidereal longitude (BPHS Ch. 46; DOCUMENT_03 §8.1). `birth` is the exact birth instant
 * (Date or epoch ms) — or, for backward compatibility, a YYYY-MM-DD date string (00:00 UTC).
 * Antardashas of the first (partial) Mahadasha are clipped to the portion remaining at birth.
 */
export function calculateVimshottariDasha(
  moonLongitude: number,
  birth: string | number | Date,
  now: Date = new Date()
): DashaPeriod[] {
  const birthMs = typeof birth === 'number' ? birth : new Date(birth).getTime();
  const { startLord, balanceYears } = getDashaBalance(moonLongitude);
  const startIndex = DASHA_ORDER.findIndex((d) => d.planet === startLord);
  const nowMs = now.getTime();
  const periods: DashaPeriod[] = [];

  // The first Mahadasha began before birth: its notional start is birth − elapsed portion.
  const firstLordYears = DASHA_ORDER[startIndex].years;
  let mdStartMs = birthMs - (firstLordYears - balanceYears) * MS_PER_DASHA_YEAR;

  for (let i = 0; i < DASHA_ORDER.length; i++) {
    const cycleIndex = (startIndex + i) % DASHA_ORDER.length;
    const md = DASHA_ORDER[cycleIndex];
    const mdEndMs = mdStartMs + md.years * MS_PER_DASHA_YEAR;

    const subPeriods = [];
    let adStartMs = mdStartMs;
    for (let j = 0; j < DASHA_ORDER.length; j++) {
      const ad = DASHA_ORDER[(cycleIndex + j) % DASHA_ORDER.length];
      const adEndMs = adStartMs + ((md.years * ad.years) / 120) * MS_PER_DASHA_YEAR;
      if (adEndMs > birthMs) {
        const shownStart = Math.max(adStartMs, birthMs);
        subPeriods.push({
          planet: ad.planet as any,
          startDate: isoDate(shownStart),
          endDate: isoDate(adEndMs),
          isActive: nowMs >= shownStart && nowMs < adEndMs,
          startMs: shownStart,
          endMs: adEndMs,
        });
      }
      adStartMs = adEndMs;
    }

    const shownMdStart = Math.max(mdStartMs, birthMs);
    periods.push({
      planet: md.planet as any,
      startDate: isoDate(shownMdStart),
      endDate: isoDate(mdEndMs),
      isActive: nowMs >= shownMdStart && nowMs < mdEndMs,
      subPeriods,
      startMs: shownMdStart,
      endMs: mdEndMs,
    });

    mdStartMs = mdEndMs;
  }

  return periods;
}

/** Returns the Mahadasha/Antardasha running at `at`, plus the next Antardasha transition. */
export function findActiveDasha(periods: DashaPeriod[], at: Date = new Date()) {
  const t = at.getTime();
  const md = periods.find((p) => (p.startMs ?? Date.parse(p.startDate)) <= t && t < (p.endMs ?? Date.parse(p.endDate)));
  if (!md) return null;
  const subs = md.subPeriods || [];
  const adIndex = subs.findIndex((s) => (s.startMs ?? Date.parse(s.startDate)) <= t && t < (s.endMs ?? Date.parse(s.endDate)));
  const ad = adIndex >= 0 ? subs[adIndex] : undefined;
  const nextAd = adIndex >= 0 ? subs[adIndex + 1] : undefined;
  return { mahadasha: md, antardasha: ad, nextAntardasha: nextAd };
}
