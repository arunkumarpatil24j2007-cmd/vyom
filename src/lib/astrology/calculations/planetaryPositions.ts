import { deltaTSeconds, getJulianCentury } from './julianDate.ts';
import { calculateLahiriAyanamsha } from './lahiriAyanamsha.ts';
import { getNakshatraFromLongitude } from './nakshatras.ts';

export interface CalculatedPlanet {
  planet: string;
  sign: string;
  signIndex: number; // 1 to 12
  house?: number; // 1 to 12 (assigned after Lagna calculation)
  degree: number; // 0 to 30 within sign
  totalLongitude: number; // 0 to 360 sidereal (full precision)
  tropicalLongitude: number; // 0 to 360 tropical (apparent, ecliptic of date)
  speed: number; // degrees per day (negative = retrograde)
  nakshatra: string;
  pada: number;
  isRetrograde: boolean;
  isExalted?: boolean;
  isDebilitated?: boolean;
  lordOf: number[];
}

export const SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

export const SIGN_LORDS: Record<string, string> = {
  Aries: 'Mars',
  Taurus: 'Venus',
  Gemini: 'Mercury',
  Cancer: 'Moon',
  Leo: 'Sun',
  Virgo: 'Mercury',
  Libra: 'Venus',
  Scorpio: 'Mars',
  Sagittarius: 'Jupiter',
  Capricorn: 'Saturn',
  Aquarius: 'Saturn',
  Pisces: 'Jupiter',
};

// Exaltation (Ucha) & Debilitation (Neecha) — BPHS Ch. 3 (DOCUMENT_03 §1.1).
// Rahu/Ketu use the Taurus/Scorpio scheme (School A); DOCUMENT_03 §1.2 records the Gemini/Sagittarius variant.
export const EXALTATION: Record<string, { sign: string; deg: number }> = {
  Sun: { sign: 'Aries', deg: 10 },
  Moon: { sign: 'Taurus', deg: 3 },
  Mars: { sign: 'Capricorn', deg: 28 },
  Mercury: { sign: 'Virgo', deg: 15 },
  Jupiter: { sign: 'Cancer', deg: 5 },
  Venus: { sign: 'Pisces', deg: 27 },
  Saturn: { sign: 'Libra', deg: 20 },
  Rahu: { sign: 'Taurus', deg: 20 },
  Ketu: { sign: 'Scorpio', deg: 20 },
};

export const DEBILITATION: Record<string, { sign: string; deg: number }> = {
  Sun: { sign: 'Libra', deg: 10 },
  Moon: { sign: 'Scorpio', deg: 3 },
  Mars: { sign: 'Cancer', deg: 28 },
  Mercury: { sign: 'Pisces', deg: 15 },
  Jupiter: { sign: 'Capricorn', deg: 5 },
  Venus: { sign: 'Virgo', deg: 27 },
  Saturn: { sign: 'Aries', deg: 20 },
  Rahu: { sign: 'Scorpio', deg: 20 },
  Ketu: { sign: 'Taurus', deg: 20 },
};

function normalizeDeg(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

function degToRad(deg: number): number {
  return (deg * Math.PI) / 180.0;
}

function sinD(deg: number): number {
  return Math.sin(degToRad(deg));
}

function cosD(deg: number): number {
  return Math.cos(degToRad(deg));
}

/** Nutation in longitude Δψ and obliquity Δε (degrees), Meeus Ch. 22 low-precision series. */
export function nutation(t: number): { dPsi: number; dEps: number } {
  const omega = 125.04452 - 1934.136261 * t;
  const lSun = 280.4665 + 36000.7698 * t;
  const lMoon = 218.3165 + 481267.8813 * t;
  const dPsi = (-17.2 * sinD(omega) - 1.32 * sinD(2 * lSun) - 0.23 * sinD(2 * lMoon) + 0.21 * sinD(2 * omega)) / 3600;
  const dEps = (9.2 * cosD(omega) + 0.57 * cosD(2 * lSun) + 0.1 * cosD(2 * lMoon) - 0.09 * cosD(2 * omega)) / 3600;
  return { dPsi, dEps };
}

/** Mean obliquity of the ecliptic ε0 (degrees), Meeus Eq. 22.2. */
export function meanObliquity(t: number): number {
  return 23 + 26 / 60 + (21.448 - 46.815 * t - 0.00059 * t * t + 0.001813 * t * t * t) / 3600;
}

// ─── Sun: Meeus Ch. 25 (apparent geocentric longitude, ~0.01° accuracy) ───
function sunApparentLongitude(t: number): number {
  const l0 = 280.46646 + 36000.76983 * t + 0.0003032 * t * t;
  const m = 357.52911 + 35999.05029 * t - 0.0001537 * t * t;
  const c = (1.914602 - 0.004817 * t - 0.000014 * t * t) * sinD(m) +
            (0.019993 - 0.000101 * t) * sinD(2 * m) +
            0.000289 * sinD(3 * m);
  const omega = 125.04 - 1934.136 * t;
  return normalizeDeg(l0 + c - 0.00569 - 0.00478 * sinD(omega));
}

// ─── Moon: Meeus Ch. 47 periodic terms for longitude (D, M, M', F, coefficient ×1e-6°) ───
const MOON_LONGITUDE_TERMS: Array<[number, number, number, number, number]> = [
  [0, 0, 1, 0, 6288774], [2, 0, -1, 0, 1274027], [2, 0, 0, 0, 658314], [0, 0, 2, 0, 213618],
  [0, 1, 0, 0, -185116], [0, 0, 0, 2, -114332], [2, 0, -2, 0, 58793], [2, -1, -1, 0, 57066],
  [2, 0, 1, 0, 53322], [2, -1, 0, 0, 45758], [0, 1, -1, 0, -40923], [1, 0, 0, 0, -34720],
  [0, 1, 1, 0, -30383], [2, 0, 0, -2, 15327], [0, 0, 1, 2, -12528], [0, 0, 1, -2, 10980],
  [4, 0, -1, 0, 10675], [0, 0, 3, 0, 10034], [4, 0, -2, 0, 8548], [2, 1, -1, 0, -7888],
  [2, 1, 0, 0, -6766], [1, 0, -1, 0, -5163], [1, 1, 0, 0, 4987], [2, -1, 1, 0, 4036],
  [2, 0, 2, 0, 3994], [4, 0, 0, 0, 3861], [2, 0, -3, 0, 3665], [0, 1, -2, 0, -2689],
  [2, 0, -1, 2, -2602], [2, -1, -2, 0, 2390], [1, 0, 1, 0, -2348], [2, -2, 0, 0, 2236],
  [0, 1, 2, 0, -2120], [0, 2, 0, 0, -2069], [2, -2, -1, 0, 2048], [2, 0, 1, -2, -1773],
  [2, 0, 0, 2, -1595], [4, -1, -1, 0, 1215], [0, 0, 2, 2, -1110], [3, 0, -1, 0, -892],
  [2, 1, 1, 0, -810], [4, -1, -2, 0, 759], [0, 2, -1, 0, -713], [2, 2, -1, 0, -700],
  [2, 1, -2, 0, 691], [2, -1, 0, -2, 596], [4, 0, 1, 0, 549], [0, 0, 4, 0, 537],
  [4, -1, 0, 0, 520], [1, 0, -2, 0, -487], [2, 1, 0, -2, -399], [0, 0, 2, -2, -381],
  [1, 1, 1, 0, 351], [3, 0, -2, 0, -340], [4, 0, -3, 0, 330], [2, -1, 2, 0, 327],
  [0, 2, 1, 0, -323], [1, 1, -1, 0, 299], [2, 0, 3, 0, 294],
];

/** Geometric (mean-equinox-of-date) lunar longitude, Meeus Ch. 47. */
function moonGeometricLongitude(t: number): number {
  const lp = 218.3164477 + 481267.88123421 * t - 0.0015786 * t * t + t ** 3 / 538841 - t ** 4 / 65194000;
  const d = 297.8501921 + 445267.1114034 * t - 0.0018819 * t * t + t ** 3 / 545868 - t ** 4 / 113065000;
  const m = 357.5291092 + 35999.0502909 * t - 0.0001536 * t * t + t ** 3 / 24490000;
  const mp = 134.9633964 + 477198.8675055 * t + 0.0087414 * t * t + t ** 3 / 69699 - t ** 4 / 14712000;
  const f = 93.272095 + 483202.0175233 * t - 0.0036539 * t * t - t ** 3 / 3526000 + t ** 4 / 863310000;
  const a1 = 119.75 + 131.849 * t;
  const a2 = 53.09 + 479264.29 * t;
  const e = 1 - 0.002516 * t - 0.0000074 * t * t;

  let sumL = 0;
  for (const [cd, cm, cmp, cf, coeff] of MOON_LONGITUDE_TERMS) {
    const eFactor = Math.abs(cm) === 1 ? e : Math.abs(cm) === 2 ? e * e : 1;
    sumL += coeff * eFactor * sinD(cd * d + cm * m + cmp * mp + cf * f);
  }
  sumL += 3958 * sinD(a1) + 1962 * sinD(lp - f) + 318 * sinD(a2);
  return normalizeDeg(lp + sumL / 1e6);
}

/** Mean lunar ascending node (Rahu), Meeus Ch. 47 — DOCUMENT_02 §6.1 mean node. */
function meanNodeLongitude(t: number): number {
  return normalizeDeg(125.0445479 - 1934.1362891 * t + 0.0020754 * t * t + t ** 3 / 467441 - t ** 4 / 60616000);
}

// ─── Planets: JPL Keplerian elements (Standish, valid 1800–2050), J2000 ecliptic ───
// [a, e, I, L, longPeri, longNode] and their rates per Julian century.
const KEPLER_ELEMENTS: Record<string, { base: number[]; rate: number[] }> = {
  Mercury: { base: [0.38709927, 0.20563593, 7.00497902, 252.2503235, 77.45779628, 48.33076593], rate: [0.00000037, 0.00001906, -0.00594749, 149472.67411175, 0.16047689, -0.12534081] },
  Venus: { base: [0.72333566, 0.00677672, 3.39467605, 181.9790995, 131.60246718, 76.67984255], rate: [0.0000039, -0.00004107, -0.0007889, 58517.81538729, 0.00268329, -0.27769418] },
  Earth: { base: [1.00000261, 0.01671123, -0.00001531, 100.46457166, 102.93768193, 0.0], rate: [0.00000562, -0.00004392, -0.01294668, 35999.37244981, 0.32327364, 0.0] },
  Mars: { base: [1.52371034, 0.0933941, 1.84969142, -4.55343205, -23.94362959, 49.55953891], rate: [0.00001847, 0.00007882, -0.00813131, 19140.30268499, 0.44441088, -0.29257343] },
  Jupiter: { base: [5.202887, 0.04838624, 1.30439695, 34.39644051, 14.72847983, 100.47390909], rate: [-0.00011607, -0.00013253, -0.00183714, 3034.74612775, 0.21252668, 0.20469106] },
  Saturn: { base: [9.53667594, 0.05386179, 2.48599187, 49.95424423, 92.59887831, 113.66242448], rate: [-0.0012506, -0.00050991, 0.00193609, 1222.49362201, -0.41897216, -0.28867794] },
};

function heliocentricJ2000(body: string, t: number): [number, number, number] {
  const el = KEPLER_ELEMENTS[body];
  const [a, e, inc, l, peri, node] = el.base.map((v, i) => v + el.rate[i] * t);
  const omega = peri - node;
  const meanAnomaly = normalizeDeg(l - peri);
  // Solve Kepler's equation E − e·sin E = M (radians)
  const mRad = degToRad(meanAnomaly > 180 ? meanAnomaly - 360 : meanAnomaly);
  let eAnom = mRad + e * Math.sin(mRad);
  for (let i = 0; i < 12; i++) {
    const delta = (eAnom - e * Math.sin(eAnom) - mRad) / (1 - e * Math.cos(eAnom));
    eAnom -= delta;
    if (Math.abs(delta) < 1e-12) break;
  }
  const xp = a * (Math.cos(eAnom) - e);
  const yp = a * Math.sqrt(1 - e * e) * Math.sin(eAnom);
  const cw = cosD(omega), sw = sinD(omega), cn = cosD(node), sn = sinD(node), ci = cosD(inc), si = sinD(inc);
  return [
    (cw * cn - sw * sn * ci) * xp + (-sw * cn - cw * sn * ci) * yp,
    (cw * sn + sw * cn * ci) * xp + (-sw * sn + cw * cn * ci) * yp,
    sw * si * xp + cw * si * yp,
  ];
}

/** Geocentric ecliptic-of-date longitude of a planet (light-time corrected, before nutation). */
function planetGeocentricLongitude(body: string, t: number): number {
  const earth = heliocentricJ2000('Earth', t);
  let p = heliocentricJ2000(body, t);
  for (let i = 0; i < 2; i++) {
    const dist = Math.hypot(p[0] - earth[0], p[1] - earth[1], p[2] - earth[2]);
    const lightTimeCenturies = (0.0057755183 * dist) / 36525;
    p = heliocentricJ2000(body, t - lightTimeCenturies);
  }
  const lonJ2000 = Math.atan2(p[1] - earth[1], p[0] - earth[0]) * (180 / Math.PI);
  // General precession in longitude from J2000 to the ecliptic of date
  return normalizeDeg(lonJ2000 + 1.396971 * t + 0.0003086 * t * t);
}

const BODY_ORDER = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

/**
 * Apparent tropical longitudes (ecliptic and equinox of date) for the nine grahas at a UT Julian Day.
 * Rahu/Ketu use the mean node (DOCUMENT_02 §6.1; DOCUMENT_08 Case 01 benchmark).
 */
export function calculateTropicalLongitudes(jdUt: number): Record<string, number> {
  const jdTt = jdUt + deltaTSeconds(jdUt) / 86400;
  const t = getJulianCentury(jdTt);
  const { dPsi } = nutation(t);
  const rahu = meanNodeLongitude(t);
  return {
    Sun: sunApparentLongitude(t),
    Moon: normalizeDeg(moonGeometricLongitude(t) + dPsi),
    Mars: normalizeDeg(planetGeocentricLongitude('Mars', t) + dPsi),
    Mercury: normalizeDeg(planetGeocentricLongitude('Mercury', t) + dPsi),
    Jupiter: normalizeDeg(planetGeocentricLongitude('Jupiter', t) + dPsi),
    Venus: normalizeDeg(planetGeocentricLongitude('Venus', t) + dPsi),
    Saturn: normalizeDeg(planetGeocentricLongitude('Saturn', t) + dPsi),
    Rahu: rahu,
    Ketu: normalizeDeg(rahu + 180),
  };
}

function angularDelta(a: number, b: number): number {
  return ((a - b + 540) % 360) - 180;
}

/**
 * Calculates sidereal (Lahiri) planetary longitudes for a given Julian Day (UT).
 * Speeds come from a ±0.5-day central difference, so retrograde motion is detected
 * rather than assumed (DOCUMENT_02 §6.1).
 */
export function calculatePlanetaryPositions(jd: number): CalculatedPlanet[] {
  const ayanamsha = calculateLahiriAyanamsha(jd);
  const now = calculateTropicalLongitudes(jd);
  const before = calculateTropicalLongitudes(jd - 0.5);
  const after = calculateTropicalLongitudes(jd + 0.5);

  return BODY_ORDER.map((name) => {
    const tropical = now[name];
    const totalDeg = normalizeDeg(tropical - ayanamsha);
    const speed = angularDelta(after[name], before[name]);
    const signIndex = Math.floor(totalDeg / 30) + 1; // 1 to 12
    const sign = SIGNS[signIndex - 1];
    const degree = totalDeg - (signIndex - 1) * 30;
    const nakInfo = getNakshatraFromLongitude(totalDeg);

    return {
      planet: name,
      sign,
      signIndex,
      degree: Number(degree.toFixed(4)),
      totalLongitude: totalDeg,
      tropicalLongitude: tropical,
      speed,
      nakshatra: nakInfo.name,
      pada: nakInfo.pada,
      isRetrograde: speed < -0.0005,
      isExalted: EXALTATION[name]?.sign === sign,
      isDebilitated: DEBILITATION[name]?.sign === sign,
      lordOf: [], // populated when houses are computed
    };
  });
}
