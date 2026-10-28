import type { BirthDataProvenance, BirthTimePrecision, ChartData, GrahaName, TimeWorkflowId } from '../../../types/index.ts';
import { jdFromEpochMs } from './julianDate.ts';
import { SIGNS, calculatePlanetaryPositions, calculateTropicalLongitudes } from './planetaryPositions.ts';
import { calculateHorizonAngles, calculateLagnaAndHouses } from './housesAndLagna.ts';
import { calculateVimshottariDasha, findActiveDasha } from './vimshottariDasha.ts';
import { calculateLahiriAyanamsha } from './lahiriAyanamsha.ts';
import { getNakshatraFromLongitude } from './nakshatras.ts';

export interface BirthCalculationInput {
  name: string;
  birthDate: string; // YYYY-MM-DD
  birthTime: string; // HH:mm ('' when unknown)
  birthTimePrecision?: BirthTimePrecision;
  birthPlace?: string;
  latitude: number;
  longitude: number;
  timezone?: string; // IANA zone (e.g. "Asia/Kolkata") or fixed offset "+05:30"
  chartLayout?: 'north-indian' | 'south-indian';
  /** Reference instant for "currently running" Dasha (defaults to now). */
  now?: Date;
}

// Uncertainty windows per DOCUMENT_01 §4 (Workflow A: ±1 min; Workflow B: 5–60 min, default ±30).
const EXACT_WINDOW_MIN = 1;
const APPROXIMATE_WINDOW_MIN = 30;

export class BirthDataValidationError extends Error {}

/**
 * UTC offset (hours) in force at a local wall-clock time. IANA zones are resolved through the
 * runtime's tz database (historical offsets and DST included); fixed offsets like "+05:30" are parsed.
 */
export function resolveUtcOffsetHours(tz: string | undefined, y: number, mo: number, d: number, h: number, mi: number): number {
  if (!tz || tz === 'IST') return 5.5;
  const fixed = tz.match(/^(?:UTC|GMT)?([+-])(\d{1,2})(?::?(\d{2}))?$/);
  if (fixed) {
    const sign = fixed[1] === '-' ? -1 : 1;
    return sign * (parseInt(fixed[2], 10) + (parseInt(fixed[3] || '0', 10) / 60));
  }
  try {
    const fmt = new Intl.DateTimeFormat('en-US', {
      timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
    const offsetAt = (utcMs: number) => {
      const parts = Object.fromEntries(fmt.formatToParts(new Date(utcMs)).map((p) => [p.type, p.value]));
      const asUtc = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute, +parts.second);
      return (asUtc - utcMs) / 3600000;
    };
    const wallAsUtc = Date.UTC(y, mo - 1, d, h, mi);
    let offset = offsetAt(wallAsUtc);
    offset = offsetAt(wallAsUtc - offset * 3600000);
    return offset;
  } catch {
    throw new BirthDataValidationError(`Unrecognised timezone "${tz}"`);
  }
}

/**
 * Workflow F (DOCUMENT_01 §4; DOCUMENT_08 TC-10/TC-11): detects a DST fall-back fold (the wall-clock
 * time occurs twice) or spring-forward gap (it never occurs) at the birth time.
 */
export function detectDstAmbiguity(tz: string, y: number, mo: number, d: number, h: number, mi: number): 'fold' | 'gap' | null {
  if (!tz || /^(?:UTC|GMT)?[+-]\d/.test(tz) || tz === 'IST') return null;
  const wall = Date.UTC(y, mo - 1, d, h, mi);
  const before = resolveUtcOffsetHours(tz, y, mo, d, Math.max(0, h - 3), mi);
  const after = resolveUtcOffsetHours(tz, y, mo, d, Math.min(23, h + 3), mi);
  if (before === after) return null;
  // An offset is valid for this wall time if the instant it produces really carries that offset.
  const validUnder = (off: number) => Math.abs(offsetAtInstant(tz, wall - off * 3600000) - off) < 1e-9;
  const a = validUnder(before);
  const b = validUnder(after);
  if (a && b) return 'fold';
  if (!a && !b) return 'gap';
  return null;
}

function offsetAtInstant(tz: string, utcMs: number): number {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
  const parts = Object.fromEntries(fmt.formatToParts(new Date(utcMs)).map((p) => [p.type, p.value]));
  return (Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute, +parts.second) - utcMs) / 3600000;
}

function formatDegrees(deg: number): string {
  const d = Math.floor(deg);
  const m = Math.floor((deg - d) * 60);
  return `${d}° ${m.toString().padStart(2, '0')}'`;
}

function signOf(longitude: number): string {
  return SIGNS[Math.floor((((longitude % 360) + 360) % 360) / 30)];
}

function navamshaSignOf(longitude: number): string {
  return SIGNS[Math.floor((((longitude % 360) + 360) % 360) / (10 / 3)) % 12];
}

/** Stage 02 validation (DOCUMENT_01 §3; DOCUMENT_08 TC-18). */
function validateBirthInput(input: BirthCalculationInput): { y: number; mo: number; d: number } {
  const m = input.birthDate?.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) throw new BirthDataValidationError('Birth date must be in YYYY-MM-DD format.');
  const [y, mo, d] = [+m[1], +m[2], +m[3]];
  const probe = new Date(Date.UTC(y, mo - 1, d));
  if (probe.getUTCFullYear() !== y || probe.getUTCMonth() !== mo - 1 || probe.getUTCDate() !== d) {
    throw new BirthDataValidationError(`${input.birthDate} is not a valid calendar date.`);
  }
  if (!(input.latitude >= -90 && input.latitude <= 90)) throw new BirthDataValidationError('Latitude must be between -90° and +90°.');
  if (!(input.longitude >= -180 && input.longitude <= 180)) throw new BirthDataValidationError('Longitude must be between -180° and +180°.');
  return { y, mo, d };
}

function parseTime(birthTime: string): { h: number; mi: number } | null {
  const m = (birthTime || '').match(/^(\d{1,2}):(\d{2})/);
  if (!m) return null;
  const h = parseInt(m[1], 10);
  const mi = parseInt(m[2], 10);
  if (h > 23 || mi > 59) throw new BirthDataValidationError(`Birth time "${birthTime}" is not a valid 24-hour time.`);
  return { h, mi };
}

/**
 * Deterministic Master Astrology Engine: Calculates complete Vedic birth chart (Lahiri, Whole Sign)
 * and the birth-time uncertainty envelope required by DOCUMENT_01 §4 Workflows A–E.
 */
export function calculateNatalChart(input: BirthCalculationInput): ChartData {
  const { y, mo, d } = validateBirthInput(input);
  const parsedTime = parseTime(input.birthTime);
  const precision: BirthTimePrecision = !parsedTime ? 'unknown' : (input.birthTimePrecision || 'exact');
  const tz = input.timezone || 'Asia/Kolkata';

  // With an unknown time, planets are computed for local noon purely as a mid-day reference;
  // everything that depends on the clock time is flagged as suppressed below (Workflow C).
  const { h, mi } = parsedTime ?? { h: 12, mi: 0 };
  const offsetHours = resolveUtcOffsetHours(tz, y, mo, d, h, mi);
  const birthUtcMs = Date.UTC(y, mo - 1, d, h, mi) - offsetHours * 3600000;
  const jd = jdFromEpochMs(birthUtcMs);

  const planets = calculatePlanetaryPositions(jd);
  const lagnaResult = calculateLagnaAndHouses(jd, input.latitude, input.longitude, planets);
  const moon = planets.find((p) => p.planet === 'Moon')!;

  // ─── Sensitivity sweep across the uncertainty window (Layer G, DOCUMENT_07) ───
  const windowMinutes = precision === 'exact' ? EXACT_WINDOW_MIN : precision === 'approximate' ? APPROXIMATE_WINDOW_MIN : 0;
  const sweepStart = precision === 'unknown' ? Date.UTC(y, mo - 1, d, 0, 0) - offsetHours * 3600000 : birthUtcMs - windowMinutes * 60000;
  const sweepEnd = precision === 'unknown' ? sweepStart + (24 * 60 - 1) * 60000 : birthUtcMs + windowMinutes * 60000;
  const stepMs = precision === 'unknown' ? 10 * 60000 : 60000;
  const lagnaCounts = new Map<string, number>();
  const navamshaLagnas = new Set<string>();
  const moonSigns = new Set<string>();
  const moonNakshatras = new Set<string>();
  let samples = 0;
  for (let t = sweepStart; t <= sweepEnd; t += stepMs) {
    const jdT = jdFromEpochMs(t);
    const ayan = calculateLahiriAyanamsha(jdT);
    const asc = calculateHorizonAngles(jdT, input.latitude, input.longitude).ascendantTropical - ayan;
    const moonLon = calculateTropicalLongitudes(jdT).Moon - ayan;
    lagnaCounts.set(signOf(asc), (lagnaCounts.get(signOf(asc)) || 0) + 1);
    navamshaLagnas.add(navamshaSignOf(asc));
    moonSigns.add(signOf(moonLon));
    moonNakshatras.add(getNakshatraFromLongitude(moonLon).name);
    samples++;
  }
  const lagnaSignStabilityPct = precision === 'unknown'
    ? 0
    : Math.round(((lagnaCounts.get(lagnaResult.sign) || 0) / samples) * 1000) / 10;

  let workflowId: TimeWorkflowId = precision === 'exact' ? 'A_exact' : precision === 'approximate' ? 'B_approximate' : 'C_unknown_time';
  const suppressedFeatures: string[] = [];
  const warnings: string[] = [];
  if (precision === 'unknown') {
    suppressedFeatures.push('udaya_lagna', 'house_placements_from_lagna', 'house_lordships_from_lagna', 'divisional_chart_lagnas', 'lagna_based_yogas', 'exact_dasha_dates');
    warnings.push('Birth time unknown: Lagna, houses and divisional-chart ascendants cannot be calculated; analysis must use Chandra Lagna (Moon sign) and planetary sign placements.');
  } else {
    if (lagnaCounts.size > 1) {
      suppressedFeatures.push('single_sign_lagna_claim');
      warnings.push(`Lagna changes sign within ±${windowMinutes} min of the given time (${[...lagnaCounts.keys()].join(' / ')}).`);
    }
    if (navamshaLagnas.size > 1) suppressedFeatures.push('navamsha_lagna');
    if (precision === 'approximate') suppressedFeatures.push('d16_to_d60_vargas', 'pratyantardasha_dates');
    else suppressedFeatures.push('d60_shashtiamsha');
    const dst = detectDstAmbiguity(tz, y, mo, d, h, mi);
    if (dst) {
      workflowId = 'F_tz_dst_boundary';
      suppressedFeatures.push('single_sign_lagna_claim');
      warnings.push(dst === 'fold'
        ? `Clocks were turned back around ${input.birthTime} on ${input.birthDate} in ${tz}: this wall-clock time occurred twice, one hour apart (~15° of Ascendant). The chart uses the first (daylight-time) occurrence; confirm which applies.`
        : `${input.birthTime} on ${input.birthDate} did not exist in ${tz} (clocks sprang forward). Confirm the recorded time.`);
    } else if (h < 4) {
      workflowId = 'E_midnight';
      warnings.push(`Birth between 00:00 and 04:00: the date ${input.birthDate} is taken as the civil calendar date (the Hindu weekday/Vara still belongs to the previous day until sunrise). Confirm the date if it was described as "night of" the previous day.`);
    }
  }
  if (moonSigns.size > 1) warnings.push(`Moon changes sign within the uncertainty window (${[...moonSigns].join(' / ')}).`);
  if (moonNakshatras.size > 1) {
    suppressedFeatures.push('exact_dasha_dates');
    warnings.push(`Moon changes Nakshatra within the uncertainty window (${[...moonNakshatras].join(' / ')}), so the Vimshottari sequence itself is uncertain.`);
  }

  const now = input.now ?? new Date();
  const dashaPeriods = calculateVimshottariDasha(moon.totalLongitude, birthUtcMs, now);
  const active = findActiveDasha(dashaPeriods, now);
  const dashas = dashaPeriods.map((dp) => {
    const startY = new Date(dp.startDate).getUTCFullYear();
    const endY = new Date(dp.endDate).getUTCFullYear();
    return { planet: dp.planet as GrahaName, startYear: startY, endYear: endY, durationYears: endY - startY };
  });

  const birthData: BirthDataProvenance = {
    localDate: input.birthDate,
    localTime: parsedTime ? input.birthTime.slice(0, 5) : null,
    timePrecision: precision,
    uncertaintyWindowMinutes: precision === 'unknown' ? 720 : windowMinutes,
    workflowId,
    utcDateTime: new Date(birthUtcMs).toISOString(),
    utcOffsetHours: offsetHours,
    timezone: tz,
    latitude: input.latitude,
    longitude: input.longitude,
    jdUt: jd,
    ayanamshaDeg: calculateLahiriAyanamsha(jd),
    ascendantLongitude: precision === 'unknown' ? null : lagnaResult.totalLongitude,
    lagnaSignStabilityPct,
    lagnaSignsInWindow: precision === 'unknown' ? [...SIGNS] : [...lagnaCounts.keys()],
    navamshaLagnaSignsInWindow: precision === 'unknown' ? [...SIGNS] : [...navamshaLagnas],
    moonSignsInWindow: [...moonSigns],
    moonNakshatrasInWindow: [...moonNakshatras],
    suppressedFeatures: [...new Set(suppressedFeatures)],
    warnings,
  };

  const chartId = `chart-${input.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now().toString(36)}`;

  return {
    id: chartId,
    profileId: `profile-${Date.now().toString(36)}`,
    calculationSettings: {
      tradition: 'vedic',
      ayanamsha: 'lahiri',
      houseSystem: 'whole_sign',
      chartLayout: input.chartLayout || 'north-indian',
    },
    ascendant: {
      sign: lagnaResult.sign as any,
      rashiName: lagnaResult.sign,
      signIndex: lagnaResult.signIndex,
      degree: lagnaResult.degree,
      degreesFormatted: formatDegrees(lagnaResult.degree),
      nakshatra: lagnaResult.nakshatra as any,
      pada: lagnaResult.pada,
    },
    moonSign: {
      sign: moon.sign as any,
      rashiName: moon.sign,
      degree: moon.degree,
      degreesFormatted: formatDegrees(moon.degree),
      nakshatra: moon.nakshatra as any,
      pada: moon.pada,
    },
    moonNakshatra: moon.nakshatra as any,
    planets: planets.map((p) => ({
      planet: p.planet as any,
      sign: p.sign as any,
      signIndex: p.signIndex,
      house: p.house || 1,
      degree: p.degree,
      degrees: p.degree,
      degreesFormatted: formatDegrees(p.degree),
      dignity: p.isExalted ? 'Exalted' : p.isDebilitated ? 'Debilitated' : 'Neutral',
      nakshatra: p.nakshatra as any,
      pada: p.pada,
      isRetrograde: p.isRetrograde,
      retrograde: p.isRetrograde,
      isExalted: p.isExalted,
      isDebilitated: p.isDebilitated,
      lordOf: p.lordOf,
      longitude: p.totalLongitude,
      speed: p.speed,
    })),
    houses: lagnaResult.houses as any,
    dashas,
    dashaPeriods,
    activeDasha: active
      ? {
          mahadasha: active.mahadasha.planet,
          mahadashaStart: active.mahadasha.startDate,
          mahadashaEnd: active.mahadasha.endDate,
          antardasha: active.antardasha?.planet,
          antardashaStart: active.antardasha?.startDate,
          antardashaEnd: active.antardasha?.endDate,
          nextAntardasha: active.nextAntardasha?.planet,
          nextAntardashaStart: active.nextAntardasha?.startDate,
        }
      : null,
    birthData,
    calculatedAt: new Date().toISOString(),
    isDemo: false,
  };
}
