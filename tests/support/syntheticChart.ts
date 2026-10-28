// Builds ChartData for the synthetic rule cases in DOCUMENT_08 / DOCUMENT_10 without an ephemeris:
// placements are given directly as [sign, degree] so each rule can be tested in isolation.
import type { ChartData } from '../../src/types/index.ts';
import { SIGNS, SIGN_LORDS } from '../../src/lib/astrology/calculations/planetaryPositions.ts';

type Placement = [string, number];

export function syntheticChart(spec: { lagna: Placement | null; planets: Record<string, Placement> }): ChartData {
  const lagnaSign = spec.lagna?.[0] ?? 'Aries';
  const lagnaIdx = SIGNS.indexOf(lagnaSign);
  const planets = Object.entries(spec.planets).map(([planet, [sign, degree]]) => {
    const signIndex = SIGNS.indexOf(sign) + 1;
    return {
      planet: planet as any,
      sign: sign as any,
      signIndex,
      house: ((signIndex - 1 - lagnaIdx + 12) % 12) + 1,
      degree,
      longitude: (signIndex - 1) * 30 + degree,
      isRetrograde: planet === 'Rahu' || planet === 'Ketu',
      nakshatra: 'n/a' as any,
      pada: 1,
    };
  });
  return {
    id: 'synthetic',
    profileId: 'synthetic',
    calculationSettings: { tradition: 'vedic', ayanamsha: 'lahiri' as any, chartLayout: 'north-indian' },
    ascendant: { sign: lagnaSign as any, signIndex: lagnaIdx + 1, degree: spec.lagna?.[1] ?? 0 },
    planets,
    houses: SIGNS.map((_, h) => ({ house: h + 1, sign: SIGNS[(lagnaIdx + h) % 12] as any, signIndex: ((lagnaIdx + h) % 12) + 1, degree: 0, planets: [], signLord: SIGN_LORDS[SIGNS[(lagnaIdx + h) % 12]] as any })),
    moonSign: spec.planets.Moon[0] as any,
    isDemo: false,
    birthData: spec.lagna
      ? undefined
      : {
          localDate: '2000-01-01', localTime: null, timePrecision: 'unknown', uncertaintyWindowMinutes: 720, workflowId: 'C_unknown_time',
          utcDateTime: '', utcOffsetHours: 0, timezone: 'UTC', latitude: 0, longitude: 0, jdUt: 0, ayanamshaDeg: 0, ascendantLongitude: null,
          lagnaSignStabilityPct: 0, lagnaSignsInWindow: [...SIGNS], navamshaLagnaSignsInWindow: [...SIGNS], moonSignsInWindow: [spec.planets.Moon[0]],
          moonNakshatrasInWindow: ['n/a'], suppressedFeatures: ['udaya_lagna'], warnings: [],
        },
  };
}
