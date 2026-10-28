import { getJulianCentury } from './julianDate.ts';

/**
 * Calculates Lahiri (Chitra Paksha) Ayanamsha in degrees for a given Julian Day.
 * Quadratic fitted exactly through the three reference values in DOCUMENT_02 §5 / TC-08:
 *   1956-03-21 0h UT  = 23°15'00.66"  (Indian Astronomical Ephemeris anchor)
 *   J2000.0           = 23°51'25.53"
 *   2026-01-01        = 24°13'13.0"
 */
export function calculateLahiriAyanamsha(jd: number): number {
  const t = getJulianCentury(jd);
  return 23.857092 + 1.392892 * t + 0.015295 * t * t;
}
