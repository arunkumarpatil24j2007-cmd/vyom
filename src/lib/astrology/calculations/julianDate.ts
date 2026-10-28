/**
 * Converts calendar date and UTC time to Julian Day (JD)
 * Meeus, Astronomical Algorithms (1998) Ch. 7. Gregorian calendar from 1582-10-15.
 */
export function calculateJulianDay(
  year: number,
  month: number,
  day: number,
  hours: number = 0,
  minutes: number = 0,
  seconds: number = 0
): number {
  let y = year;
  let m = month;

  if (m <= 2) {
    y -= 1;
    m += 12;
  }

  const d = day + (hours + minutes / 60 + seconds / 3600) / 24;

  const isGregorian = year > 1582 || (year === 1582 && (month > 10 || (month === 10 && day >= 15)));
  const a = Math.floor(y / 100);
  const b = isGregorian ? 2 - a + Math.floor(a / 4) : 0;

  const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + b - 1524.5;
  return jd;
}

/**
 * Julian Century T relative to standard epoch J2000.0 (JD 2451545.0)
 */
export function getJulianCentury(jd: number): number {
  return (jd - 2451545.0) / 36525.0;
}

/** Julian Day (UT) for a JavaScript epoch-milliseconds instant. */
export function jdFromEpochMs(ms: number): number {
  return ms / 86400000 + 2440587.5;
}

/** Epoch milliseconds for a Julian Day (UT). */
export function epochMsFromJd(jd: number): number {
  return (jd - 2440587.5) * 86400000;
}

/**
 * ΔT = TT − UT1 in seconds (Espenak & Meeus polynomial approximations, NASA eclipse site).
 * Accurate to ~1 s for 1900–2050, which is far below the precision any chart rule needs.
 */
export function deltaTSeconds(jdUt: number): number {
  const y = 2000 + (jdUt - 2451544.5) / 365.2425;
  if (y >= 2005 && y < 2050) {
    const t = y - 2000;
    return 62.92 + 0.32217 * t + 0.005589 * t * t;
  }
  if (y >= 1986 && y < 2005) {
    const t = y - 2000;
    return 63.86 + 0.3345 * t - 0.060374 * t ** 2 + 0.0017275 * t ** 3 + 0.000651814 * t ** 4 + 0.00002373599 * t ** 5;
  }
  if (y >= 1961 && y < 1986) {
    const t = y - 1975;
    return 45.45 + 1.067 * t - (t * t) / 260 - (t * t * t) / 718;
  }
  if (y >= 1941 && y < 1961) {
    const t = y - 1950;
    return 29.07 + 0.407 * t - (t * t) / 233 + (t * t * t) / 2547;
  }
  if (y >= 1920 && y < 1941) {
    const t = y - 1920;
    return 21.2 + 0.84493 * t - 0.0761 * t * t + 0.0020936 * t * t * t;
  }
  if (y >= 1900 && y < 1920) {
    const t = y - 1900;
    return -2.79 + 1.494119 * t - 0.0598939 * t ** 2 + 0.0061966 * t ** 3 - 0.000197 * t ** 4;
  }
  // Long-term parabola outside the tabulated range
  const u = (y - 1820) / 100;
  return -20 + 32 * u * u;
}
