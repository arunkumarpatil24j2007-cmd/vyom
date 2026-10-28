/**
 * Deterministic Parashari rule engine (Layer D/E/F of DOCUMENT_07).
 *
 * Every rule below is transcribed from the Vyom process documents — DOCUMENT_03 (knowledge base),
 * DOCUMENT_05 (domains, timing, doshas) and DOCUMENT_06 (machine-readable rule catalog) — and carries
 * the source locators those documents give (DOCUMENT_09 source IDs). Raw afflictions are never
 * reported without their documented cancellation (Bhanga/Parihara) checks.
 */
import type { ChartData } from '../../../types/index.ts';
import { SIGNS, SIGN_LORDS, EXALTATION, DEBILITATION, calculatePlanetaryPositions, type CalculatedPlanet } from '../calculations/planetaryPositions.ts';
import { navamshaSignIndex, dashamshaSignIndex, signName } from '../calculations/vargas.ts';
import { jdFromEpochMs } from '../calculations/julianDate.ts';
import { DASHA_ORDER } from '../calculations/vimshottariDasha.ts';

export type RuleStatus = 'active' | 'weakened' | 'mitigated' | 'cancelled' | 'suppressed';

export interface FiredRule {
  ruleId: string;
  name: string;
  status: RuleStatus;
  planets: string[];
  summary: string;
  reasons: string[];
  sources: string[];
  confidence?: string;
  notes?: string[];
}

export interface PlanetAnalysis {
  planet: string;
  sign: string;
  degree: number;
  longitude: number;
  nakshatra: string;
  pada: number;
  house: number | null;
  housesFromMoon: number;
  lordOf: number[];
  dignity: string;
  relationshipToDispositor: string;
  functionalRole: string;
  isRetrograde: boolean;
  combust: boolean;
  navamsha: string;
  dashamsha: string | null;
  vargottama: boolean;
  aspectsHouses: number[];
}

export interface HouseAnalysis {
  house: number;
  sign: string;
  lord: string;
  lordPlacedInHouse: number;
  lordDignity: string;
  occupants: string[];
  aspectedBy: string[];
  hemmedByMalefics: boolean;
}

export interface TransitAnalysis {
  asOf: string;
  positions: Array<{ planet: string; sign: string; degree: number; isRetrograde: boolean; houseFromMoon: number; houseFromLagna: number | null; classicallyFavourableFromMoon: boolean | null; vedhaBy: string | null }>;
  sadeSati: { active: boolean; phase: 'Rising (12th from Moon)' | 'Peak (over natal Moon)' | 'Setting (2nd from Moon)' | null };
  saturnDhaiya: { active: boolean; kind: 'Kantaka/Ardhashtama (4th)' | 'Ashtama Shani (8th)' | null };
  doubleTransitHousesFromLagna: number[];
}

export interface DashaAnalysis {
  mahadasha: string;
  mahadashaPeriod: string;
  antardasha?: string;
  antardashaPeriod?: string;
  nextAntardasha?: string;
  nextAntardashaStart?: string;
  mdLordHouses: { occupies: number | null; rules: number[] };
  adLordHouses?: { occupies: number | null; rules: number[] };
  adFromMdHouse?: number;
  notes: string[];
  datesReliable: boolean;
}

export interface VedicAnalysis {
  settings: { tradition: string; zodiac: string; ayanamsha: string; ayanamshaDeg: number; houseSystem: string; nodeMode: string; dashaYear: string };
  workflow: { id: string; timePrecision: string; lagnaAvailable: boolean; suppressedFeatures: string[]; warnings: string[]; lagnaSignStabilityPct: number; lagnaSignsInWindow: string[]; moonSignsInWindow: string[]; moonNakshatrasInWindow: string[] };
  lagna: { sign: string; degree: number; nakshatra: string; navamsha: string; functionalScheme: FunctionalScheme } | null;
  chandraLagna: { sign: string; degree: number; nakshatra: string; pada: number; paksha: 'Shukla (waxing)' | 'Krishna (waning)'; tithi: number };
  suryaLagna: { sign: string };
  planets: PlanetAnalysis[];
  houses: HouseAnalysis[] | null;
  housesFromMoon: Array<{ house: number; sign: string; occupants: string[] }>;
  rules: FiredRule[];
  dasha: DashaAnalysis | null;
  transits: TransitAnalysis;
  notComputed: string[];
}

// ─── Reference tables (DOCUMENT_03 §1) ───
const OWN_SIGNS: Record<string, string[]> = {
  Sun: ['Leo'], Moon: ['Cancer'], Mars: ['Aries', 'Scorpio'], Mercury: ['Gemini', 'Virgo'],
  Jupiter: ['Sagittarius', 'Pisces'], Venus: ['Taurus', 'Libra'], Saturn: ['Capricorn', 'Aquarius'],
  Rahu: ['Aquarius'], Ketu: ['Scorpio'],
};

const MOOLATRIKONA: Record<string, { sign: string; from: number; to: number }> = {
  Sun: { sign: 'Leo', from: 0, to: 20 }, Moon: { sign: 'Taurus', from: 4, to: 30 }, Mars: { sign: 'Aries', from: 0, to: 12 },
  Mercury: { sign: 'Virgo', from: 16, to: 20 }, Jupiter: { sign: 'Sagittarius', from: 0, to: 10 },
  Venus: { sign: 'Libra', from: 0, to: 15 }, Saturn: { sign: 'Aquarius', from: 0, to: 20 },
};

// Naisargika Maitri (BPHS Ch. 3 v. 55; DOCUMENT_03 §1.3): +1 friend, 0 neutral, -1 enemy
const NATURAL_RELATIONS: Record<string, { friends: string[]; enemies: string[] }> = {
  Sun: { friends: ['Moon', 'Mars', 'Jupiter'], enemies: ['Venus', 'Saturn'] },
  Moon: { friends: ['Sun', 'Mercury'], enemies: [] },
  Mars: { friends: ['Sun', 'Moon', 'Jupiter'], enemies: ['Mercury'] },
  Mercury: { friends: ['Sun', 'Venus'], enemies: ['Moon'] },
  Jupiter: { friends: ['Sun', 'Moon', 'Mars'], enemies: ['Mercury', 'Venus'] },
  Venus: { friends: ['Mercury', 'Saturn'], enemies: ['Sun', 'Moon'] },
  Saturn: { friends: ['Mercury', 'Venus'], enemies: ['Sun', 'Moon', 'Mars'] },
};

// Combustion orbs (DOCUMENT_03 §1.1): [direct, retrograde]
const COMBUSTION_ORB: Record<string, [number, number]> = {
  Moon: [12, 12], Mars: [17, 17], Mercury: [14, 12], Jupiter: [11, 11], Venus: [10, 8], Saturn: [15, 15],
};

// Graha Drishti full aspects counted inclusively (BPHS Ch. 26; DOCUMENT_03 §5.1). Node aspects are disputed
// (DOCUMENT_03 §1.2) and disabled by default (enable_node_trinal_aspects = false).
export const FULL_ASPECTS: Record<string, number[]> = {
  Sun: [7], Moon: [7], Mercury: [7], Venus: [7], Mars: [4, 7, 8], Jupiter: [5, 7, 9], Saturn: [3, 7, 10], Rahu: [], Ketu: [],
};

const EXALTED_IN_SIGN: Record<string, string> = Object.fromEntries(
  Object.entries(EXALTATION).filter(([p]) => p !== 'Rahu' && p !== 'Ketu').map(([p, v]) => [v.sign, p])
);

const PHYSICAL = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
const FIVE_TARA = ['Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
const KENDRAS = [1, 4, 7, 10];
const DUSTHANAS = [6, 8, 12];

// Functional natures per Lagna — transcribed verbatim from DOCUMENT_03 §2 (Laghu Parashari matrix).
export interface FunctionalScheme { benefics: string[]; yogakaraka: string | null; malefics: string[]; marakas: string[]; note: string }
const FUNCTIONAL_BY_LAGNA: Record<string, FunctionalScheme> = {
  Aries: { benefics: ['Sun', 'Jupiter', 'Mars'], yogakaraka: null, malefics: ['Mercury', 'Venus', 'Saturn'], marakas: ['Venus'], note: 'Sun+Jupiter pair acts as Rajayoga' },
  Taurus: { benefics: ['Saturn', 'Sun', 'Mercury'], yogakaraka: 'Saturn', malefics: ['Jupiter', 'Venus', 'Moon'], marakas: ['Mars', 'Jupiter', 'Venus'], note: '' },
  Gemini: { benefics: ['Venus', 'Saturn'], yogakaraka: null, malefics: ['Mars', 'Jupiter', 'Sun'], marakas: ['Moon', 'Jupiter'], note: 'Venus is the sole unblemished benefic' },
  Cancer: { benefics: ['Mars', 'Jupiter', 'Moon'], yogakaraka: 'Mars', malefics: ['Venus', 'Mercury', 'Saturn'], marakas: ['Saturn', 'Sun'], note: '' },
  Leo: { benefics: ['Mars', 'Sun', 'Jupiter'], yogakaraka: 'Mars', malefics: ['Mercury', 'Venus', 'Saturn'], marakas: ['Saturn', 'Mercury'], note: '' },
  Virgo: { benefics: ['Venus', 'Mercury'], yogakaraka: null, malefics: ['Mars', 'Jupiter', 'Moon'], marakas: ['Venus', 'Jupiter'], note: 'Venus + Mercury form Dharma-Karma' },
  Libra: { benefics: ['Saturn', 'Mercury', 'Venus'], yogakaraka: 'Saturn', malefics: ['Sun', 'Jupiter', 'Mars'], marakas: ['Mars'], note: '' },
  Scorpio: { benefics: ['Moon', 'Jupiter', 'Sun'], yogakaraka: null, malefics: ['Mercury', 'Venus', 'Saturn'], marakas: ['Venus', 'Mercury'], note: 'Sun + Moon form 9L/10L Rajayoga' },
  Sagittarius: { benefics: ['Sun', 'Mars', 'Jupiter'], yogakaraka: null, malefics: ['Venus', 'Saturn'], marakas: ['Saturn', 'Mercury'], note: 'Sun + Mercury form 9L/10L' },
  Capricorn: { benefics: ['Venus', 'Mercury', 'Saturn'], yogakaraka: 'Venus', malefics: ['Mars', 'Jupiter', 'Moon'], marakas: ['Mars', 'Jupiter', 'Saturn'], note: '' },
  Aquarius: { benefics: ['Venus', 'Sun', 'Saturn'], yogakaraka: 'Venus', malefics: ['Jupiter', 'Moon', 'Mars'], marakas: ['Jupiter', 'Sun'], note: '' },
  Pisces: { benefics: ['Moon', 'Mars', 'Jupiter'], yogakaraka: null, malefics: ['Sun', 'Venus', 'Saturn', 'Mercury'], marakas: ['Mercury', 'Saturn'], note: 'Mars + Jupiter form 9L/10L' },
};

// Gochara favourable houses from natal Moon and their Vedha points (Phaladeepika Ch. 26; DOCUMENT_03 §9.1)
const GOCHARA: Record<string, { good: number[]; vedha: number[] }> = {
  Sun: { good: [3, 6, 10, 11], vedha: [9, 12, 4, 5] },
  Moon: { good: [1, 3, 6, 7, 10, 11], vedha: [5, 9, 12, 2, 4, 8] },
  Mars: { good: [3, 6, 11], vedha: [12, 9, 5] },
  Mercury: { good: [2, 4, 6, 8, 10, 11], vedha: [5, 3, 9, 1, 8, 12] },
  Jupiter: { good: [2, 5, 7, 9, 11], vedha: [12, 4, 3, 10, 8] },
  Venus: { good: [1, 2, 3, 4, 5, 8, 9, 11, 12], vedha: [8, 7, 1, 10, 9, 5, 11, 6, 3] },
  Saturn: { good: [3, 6, 11], vedha: [12, 9, 5] },
};
// Pairs that do not obstruct each other (Sun–Saturn per DOCUMENT_03 §9.1; Moon–Mercury per the same classical rule)
const VEDHA_EXEMPT: Array<[string, string]> = [['Sun', 'Saturn'], ['Moon', 'Mercury']];

const SRC = {
  bphs: (loc: string) => `Brihat Parashara Hora Shastra (SRC-BPHS-SANTHANAM), ${loc}`,
  phala: (loc: string) => `Phaladeepika (SRC-PHALADEEPIKA-SASTRI), ${loc}`,
  bj: (loc: string) => `Brihat Jataka (SRC-BRIHAT-JATAKA), ${loc}`,
  laghu: (loc: string) => `Laghu Parashari (SRC-LAGHU-PARASHARI), ${loc}`,
  mc: (loc: string) => `Muhurta Chintamani (SRC-MUHURTA-CHINTAMANI), ${loc}`,
  pm: (loc: string) => `Prashna Marga (SRC-PRASHNA-MARGA), ${loc}`,
};

const signIdx = (sign: string) => SIGNS.indexOf(sign); // 0-based
const offset = (fromSign: string, toSign: string) => ((signIdx(toSign) - signIdx(fromSign) + 12) % 12) + 1;
const angularSeparation = (a: number, b: number) => {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
};

function naturalRelation(planet: string, other: string): number {
  if (planet === other) return 1;
  const rel = NATURAL_RELATIONS[planet];
  if (!rel) return 0;
  if (rel.friends.includes(other)) return 1;
  if (rel.enemies.includes(other)) return -1;
  return 0;
}

/** Panchadha Maitri: natural + temporary (BPHS Ch. 3 v. 56–58). */
function compoundRelation(planet: string, other: string, signOf: (p: string) => string): string {
  if (!NATURAL_RELATIONS[planet] || !NATURAL_RELATIONS[other]) return 'n/a';
  if (planet === other) return 'own sign';
  const h = offset(signOf(planet), signOf(other));
  const temporary = [2, 3, 4, 10, 11, 12].includes(h) ? 1 : -1;
  const total = naturalRelation(planet, other) + temporary;
  return { 2: 'Adhimitra (great friend)', 1: 'Mitra (friend)', 0: 'Sama (neutral)', [-1]: 'Shatru (enemy)', [-2]: 'Adhishatru (bitter enemy)' }[total as 2 | 1 | 0 | -1 | -2];
}

function dignityOf(p: { planet: string; sign: string; degree: number }): string {
  if (EXALTATION[p.planet]?.sign === p.sign) return 'Exalted (Uccha)';
  if (DEBILITATION[p.planet]?.sign === p.sign) return 'Debilitated (Neecha)';
  const mt = MOOLATRIKONA[p.planet];
  if (mt && mt.sign === p.sign && p.degree >= mt.from && p.degree < mt.to) return 'Moolatrikona';
  if (OWN_SIGNS[p.planet]?.includes(p.sign)) return 'Own sign (Swakshetra)';
  return 'Other';
}

interface Body { planet: string; sign: string; degree: number; longitude: number; isRetrograde: boolean; nakshatra: string; pada: number }

function bodiesFromChart(chart: ChartData): Body[] {
  return chart.planets.map((p) => ({
    planet: p.planet,
    sign: p.sign,
    degree: p.degree,
    longitude: p.longitude ?? (p.signIndex - 1) * 30 + p.degree,
    isRetrograde: !!(p.isRetrograde ?? p.retrograde),
    nakshatra: String(p.nakshatra ?? ''),
    pada: p.pada ?? 1,
  }));
}

/** Signs aspected (fully) by a body placed in `sign`. */
export function aspectedSigns(planet: string, sign: string): string[] {
  return (FULL_ASPECTS[planet] || []).map((n) => SIGNS[(signIdx(sign) + n - 1) % 12]);
}

export function analyzeVedicChart(chart: ChartData, options: { now?: Date } = {}): VedicAnalysis {
  const now = options.now ?? new Date();
  const bd = chart.birthData;
  const lagnaAvailable = !bd || bd.timePrecision !== 'unknown';
  const lagnaStable = lagnaAvailable && (!bd || bd.lagnaSignsInWindow.length <= 1);
  const bodies = bodiesFromChart(chart);
  const get = (name: string) => bodies.find((b) => b.planet === name)!;
  const signOf = (name: string) => get(name).sign;
  const moon = get('Moon');
  const sun = get('Sun');
  const lagnaSign = lagnaAvailable ? chart.ascendant.sign : null;
  const lagnaLon = bd?.ascendantLongitude ?? (lagnaAvailable ? (chart.ascendant.signIndex - 1) * 30 + chart.ascendant.degree : null);
  const houseOf = (name: string): number | null => (lagnaSign ? offset(lagnaSign, signOf(name)) : null);
  const lordOfHouse = (h: number): string | null => (lagnaSign ? SIGN_LORDS[SIGNS[(signIdx(lagnaSign) + h - 1) % 12]] : null);
  const housesRuledBy = (planet: string): number[] => (lagnaSign ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].filter((h) => lordOfHouse(h) === planet) : []);
  const scheme = lagnaSign ? FUNCTIONAL_BY_LAGNA[lagnaSign] : null;
  const isCombust = (b: Body) => {
    const orb = COMBUSTION_ORB[b.planet];
    if (!orb) return false;
    return angularSeparation(b.longitude, sun.longitude) < (b.isRetrograde ? orb[1] : orb[0]);
  };
  const aspects = (source: string, targetSign: string) => aspectedSigns(source, signOf(source)).includes(targetSign);
  const elongation = ((moon.longitude - sun.longitude) % 360 + 360) % 360;
  const tithi = Math.floor(elongation / 12) + 1;
  const waxing = tithi <= 15;
  const isNaturalMalefic = (p: string) => ['Sun', 'Mars', 'Saturn', 'Rahu', 'Ketu'].includes(p) || (p === 'Moon' && !waxing);
  const functionalRole = (p: string): string => {
    if (!scheme) return 'unknown (needs Lagna)';
    if (scheme.yogakaraka === p) return 'Yogakaraka (supreme functional benefic)';
    const roles: string[] = [];
    if (scheme.benefics.includes(p)) roles.push('functional benefic');
    if (scheme.malefics.includes(p)) roles.push('functional malefic');
    if (scheme.marakas.includes(p)) roles.push('maraka (2nd/7th lord)');
    return roles.join(', ') || 'neutral / mixed';
  };

  // ─── Planets ───
  const planets: PlanetAnalysis[] = bodies.map((b) => {
    const dispositor = SIGN_LORDS[b.sign];
    return {
      planet: b.planet,
      sign: b.sign,
      degree: Math.round(b.degree * 100) / 100,
      longitude: Math.round(b.longitude * 10000) / 10000,
      nakshatra: b.nakshatra,
      pada: b.pada,
      house: houseOf(b.planet),
      housesFromMoon: offset(moon.sign, b.sign),
      lordOf: housesRuledBy(b.planet),
      dignity: dignityOf(b),
      relationshipToDispositor: dispositor === b.planet ? 'own sign' : compoundRelation(b.planet, dispositor, signOf),
      functionalRole: functionalRole(b.planet),
      isRetrograde: b.isRetrograde,
      combust: isCombust(b),
      navamsha: signName(navamshaSignIndex(b.longitude)),
      dashamsha: lagnaAvailable ? signName(dashamshaSignIndex(b.longitude)) : null,
      vargottama: signName(navamshaSignIndex(b.longitude)) === b.sign,
      aspectsHouses: lagnaSign ? (FULL_ASPECTS[b.planet] || []).map((n) => ((offset(lagnaSign, b.sign) + n - 2) % 12) + 1) : [],
    };
  });
  const pa = (name: string) => planets.find((p) => p.planet === name)!;

  // ─── Houses (three-pillar inputs: Bhava, Bhavesha; DOCUMENT_03 §3.1) ───
  let houses: HouseAnalysis[] | null = null;
  if (lagnaSign) {
    houses = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((h) => {
      const sign = SIGNS[(signIdx(lagnaSign) + h - 1) % 12];
      const lord = SIGN_LORDS[sign];
      const prev = SIGNS[(signIdx(sign) + 11) % 12];
      const next = SIGNS[(signIdx(sign) + 1) % 12];
      const malefics = bodies.filter((b) => isNaturalMalefic(b.planet));
      return {
        house: h,
        sign,
        lord,
        lordPlacedInHouse: houseOf(lord)!,
        lordDignity: pa(lord).dignity,
        occupants: bodies.filter((b) => b.sign === sign).map((b) => b.planet),
        aspectedBy: bodies.filter((b) => aspects(b.planet, sign)).map((b) => b.planet),
        hemmedByMalefics: malefics.some((m) => m.sign === prev) && malefics.some((m) => m.sign === next),
      };
    });
  }

  const rules: FiredRule[] = [];
  const timeNote = 'Requires Udaya Lagna; not evaluated because the birth time is unknown (DOCUMENT_01 Workflow C).';

  // ─── Pancha Mahapurusha (BPHS Ch. 75; Phaladeepika 6.1–4; DOCUMENT_06) ───
  const mahapurusha: Array<[string, string, string[], number]> = [
    ['Mars', 'Ruchaka', ['Aries', 'Scorpio', 'Capricorn'], 8.5],
    ['Mercury', 'Bhadra', ['Gemini', 'Virgo'], 14],
    ['Jupiter', 'Hamsa', ['Sagittarius', 'Pisces', 'Cancer'], 11],
    ['Venus', 'Malavya', ['Taurus', 'Libra', 'Pisces'], 10],
    ['Saturn', 'Shasha', ['Capricorn', 'Aquarius', 'Libra'], 15],
  ];
  for (const [planet, yoga, signs, combOrb] of mahapurusha) {
    const b = get(planet);
    if (!signs.includes(b.sign)) continue;
    const id = `vedic.yoga.pancha_mahapurusha.${yoga.toLowerCase()}`;
    const sources = [SRC.bphs('Ch. 75'), SRC.phala('Ch. 6, v. 1–4')];
    if (!lagnaSign) {
      rules.push({ ruleId: id, name: `${yoga} Mahapurusha Yoga`, status: 'suppressed', planets: [planet], summary: `${planet} is in ${b.sign} (own/exaltation sign) but Kendra placement from Lagna cannot be checked.`, reasons: [timeNote], sources, notes: [`Kendra from the Moon (${offset(moon.sign, b.sign)}th) is only a secondary variant per later commentators (DOCUMENT_06 known_disagreements).`] });
      continue;
    }
    const h = houseOf(planet)!;
    if (!KENDRAS.includes(h)) continue;
    const reasons = [`${planet} in ${b.sign} (${dignityOf(b)}) in house ${h} (Kendra) from Lagna.`];
    let status: RuleStatus = 'active';
    if (angularSeparation(b.longitude, sun.longitude) < combOrb) {
      status = planet === 'Mercury' ? 'active' : 'weakened';
      reasons.push(planet === 'Mercury' ? `Mercury within ${combOrb}° of the Sun — combustion/Budhaditya modification (disputed whether it cancels Bhadra).` : `Combust: within ${combOrb}° of the Sun.`);
    }
    if (DEBILITATION[planet]?.sign === pa(planet).navamsha) { status = 'weakened'; reasons.push(`Debilitated in Navamsha (${pa(planet).navamsha}).`); }
    if ((planet === 'Mars' || planet === 'Jupiter') && b.sign === signOf('Rahu')) { status = 'weakened'; reasons.push(`Conjunct Rahu (${planet === 'Jupiter' ? 'Guru-Chandala' : 'Angaraka'} affliction).`); }
    if (!lagnaStable) { status = 'weakened'; reasons.push('Lagna is not stable across the birth-time uncertainty window, so the Kendra placement is conditional.'); }
    rules.push({ ruleId: id, name: `${yoga} Mahapurusha Yoga`, status, planets: [planet], summary: `${yoga} Yoga formed by ${planet}.`, reasons, sources, confidence: 'textual_support: high_explicit_canonical; empirical_validation: not_established' });
  }

  // ─── Gajakesari (BPHS Ch. 36 v. 3–4; Phaladeepika 6.14) ───
  {
    const j = get('Jupiter');
    const fromMoon = offset(moon.sign, j.sign);
    if (KENDRAS.includes(fromMoon)) {
      const reasons = [`Jupiter (${j.sign}) is ${fromMoon === 1 ? 'conjunct the Moon' : `in the ${fromMoon}th from the Moon`} (Kendra from Moon).`];
      let status: RuleStatus = 'active';
      if (j.sign === 'Capricorn') { status = 'cancelled'; reasons.push('Jupiter is debilitated (Capricorn) — rule condition fails.'); }
      if (angularSeparation(j.longitude, sun.longitude) < 11) { status = 'cancelled'; reasons.push('Jupiter is combust (within 11° of the Sun) — rule condition fails.'); }
      if (status === 'active' && houseOf('Jupiter') && DUSTHANAS.includes(houseOf('Jupiter')!)) { status = 'weakened'; reasons.push(`Jupiter is in the ${houseOf('Jupiter')}th (Dusthana) from Lagna — recognition muted into private/scholarly pursuits.`); }
      if (status === 'active' && moon.sign === 'Scorpio') { status = 'weakened'; reasons.push('Moon is debilitated in Scorpio.'); }
      if (status === 'active' && !waxing) { reasons.push('Moon is waning (Krishna Paksha), reducing Paksha Bala.'); }
      if (bd && bd.moonSignsInWindow.length > 1) { status = 'weakened'; reasons.push('Moon changes sign within the birth-time window; the yoga is conditional.'); }
      rules.push({ ruleId: 'vedic.yoga.gajakesari', name: 'Gajakesari Yoga', status, planets: ['Jupiter', 'Moon'], summary: 'Jupiter in a Kendra from the Moon.', reasons, sources: [SRC.bphs('Ch. 36, v. 3–4'), SRC.phala('Ch. 6, v. 14')], notes: ['Base-rate caution: raw Gajakesari geometry occurs in ~33% of all births (DOCUMENT_06, DOCUMENT_10 §2).'] });
    }
  }

  // ─── Kemadruma and Kemadruma Bhanga (Brihat Jataka 13.3; Phaladeepika 6.59–61) ───
  {
    const flanking = FIVE_TARA.filter((p) => [2, 12].includes(offset(moon.sign, signOf(p))));
    if (flanking.length === 0) {
      const cancel: string[] = [];
      const moonKendra = FIVE_TARA.filter((p) => KENDRAS.includes(offset(moon.sign, signOf(p))));
      if (moonKendra.length) cancel.push(`${moonKendra.join(', ')} in a Kendra from the Moon.`);
      if (lagnaSign) {
        const lagnaKendra = PHYSICAL.filter((p) => KENDRAS.includes(houseOf(p)!));
        if (lagnaKendra.length) cancel.push(`${lagnaKendra.join(', ')} in a Kendra from Lagna.`);
      }
      const moonAspecters = ['Jupiter', 'Venus', 'Mercury'].filter((p) => aspects(p, moon.sign) || signOf(p) === moon.sign);
      if (moonAspecters.length) cancel.push(`Moon aspected/joined by ${moonAspecters.join(', ')}.`);
      if (tithi === 15) cancel.push('Full Moon (Purnima).');
      rules.push({
        ruleId: 'vedic.yoga.kemadruma_and_bhanga',
        name: cancel.length ? 'Kemadruma Yoga — CANCELLED (Kemadruma Bhanga)' : 'Kemadruma Yoga (uncancelled)',
        status: cancel.length ? 'cancelled' : 'active',
        planets: ['Moon'],
        summary: 'No planet (Mars–Saturn) in the 2nd or 12th from the Moon.',
        reasons: cancel.length ? cancel : ['No cancellation condition found.'],
        sources: [SRC.bj('Ch. 13, v. 3'), SRC.phala('Ch. 6, v. 59–61')],
        notes: ['Never report Kemadruma without its cancellations; avoid catastrophic literal-translation language (DOCUMENT_06 safety_constraints).', ...(lagnaSign ? [] : ['Lagna-based cancellation could not be checked (birth time unknown).'])],
      });
    }
  }

  // ─── Neechabhanga (Phaladeepika 7.26–30; Jataka Parijata Ch. 7) ───
  for (const p of PHYSICAL) {
    const b = get(p);
    if (DEBILITATION[p]?.sign !== b.sign) continue;
    const dispositor = SIGN_LORDS[b.sign];
    const exaltLord = EXALTED_IN_SIGN[b.sign];
    const clauses: string[] = [];
    const inKendraFrom = (q: string) => [
      ...(lagnaSign && KENDRAS.includes(houseOf(q)!) ? ['Lagna'] : []),
      ...(KENDRAS.includes(offset(moon.sign, signOf(q))) ? ['Moon'] : []),
    ];
    if (inKendraFrom(dispositor).length) clauses.push(`Dispositor ${dispositor} is in a Kendra from ${inKendraFrom(dispositor).join(' and ')}.`);
    if (exaltLord && inKendraFrom(exaltLord).length) clauses.push(`${exaltLord}, the planet whose exaltation sign is ${b.sign} (it is not itself exalted here), is in a Kendra from ${inKendraFrom(exaltLord).join(' and ')}.`);
    if (aspects(dispositor, b.sign)) clauses.push(`Dispositor ${dispositor} aspects ${p}.`);
    if (EXALTATION[p]?.sign === pa(p).navamsha) clauses.push(`${p} is exalted in Navamsha (${pa(p).navamsha}).`);
    const inKendra = lagnaSign ? KENDRAS.includes(houseOf(p)!) : false;
    const full = clauses.length >= 2 && inKendra;
    rules.push({
      ruleId: 'vedic.yoga.neechabhanga_rajayoga',
      name: clauses.length === 0 ? `${p} debilitated (no Neechabhanga)` : full ? `Neechabhanga Rajayoga (${p})` : `Neechabhanga — debilitation of ${p} mitigated`,
      status: clauses.length === 0 ? 'active' : full ? 'active' : 'mitigated',
      planets: [p],
      summary: `${p} is debilitated in ${b.sign}.`,
      reasons: clauses.length ? clauses : ['No cancellation clause satisfied.'],
      sources: [SRC.phala('Ch. 7, v. 26–30'), 'Jataka Parijata (SRC-JATAKA-PARIJATA), Ch. 7'],
      notes: ['1 clause = mitigated; ≥2 clauses with the planet in a Kendra = full Neechabhanga Rajayoga (DOCUMENT_06 modifying_factors).', ...(lagnaSign ? [] : ['Kendra-from-Lagna clauses not checked (birth time unknown).'])],
    });
  }

  if (lagnaSign) {
    // ─── Vipareeta Rajayoga (Phaladeepika 6.63–69) ───
    const vipNames: Record<number, string> = { 6: 'Harsha', 8: 'Sarala', 12: 'Vimala' };
    for (const h of DUSTHANAS) {
      const lord = lordOfHouse(h)!;
      const placed = houseOf(lord)!;
      if (!DUSTHANAS.includes(placed)) continue;
      const reasons = [`${h}th lord ${lord} is in the ${placed}th house.`];
      let status: RuleStatus = 'active';
      const lordsHouses = housesRuledBy(lord);
      if (lordsHouses.some((x) => [1, 5, 9].includes(x))) { status = 'cancelled'; reasons.push(`${lord} also rules a Trikona (${lordsHouses.join(', ')}) — Trikona lordship takes precedence.`); }
      const kendraTrikonaLords = [1, 4, 5, 7, 9, 10].map((x) => lordOfHouse(x)!).filter((l) => l !== lord);
      const conj = kendraTrikonaLords.filter((l) => signOf(l) === signOf(lord));
      if (status === 'active' && conj.length) { status = 'cancelled'; reasons.push(`Conjunct Kendra/Trikona lord(s) ${[...new Set(conj)].join(', ')} — the Dusthana lord afflicts them instead.`); }
      rules.push({ ruleId: 'vedic.yoga.vipareeta_rajayoga', name: `${vipNames[h]} Vipareeta Rajayoga`, status, planets: [lord], summary: `${h}th lord in a Dusthana.`, reasons, sources: [SRC.phala('Ch. 6, v. 63–69'), 'Uttara Kalamrita (SRC-UTTARA-KALAMRITA), Ch. 4, v. 22'], notes: ['Phaladeepika (placement) vs. Uttara Kalamrita (mutual 6/8/12-lord connection) define this differently (DOCUMENT_06 known_disagreements).'] });
    }

    // ─── Dharma-Karmadhipati Rajayoga (BPHS Ch. 39; Laghu Parashari Ch. 2) ───
    const l9 = lordOfHouse(9)!;
    const l10 = lordOfHouse(10)!;
    const links: string[] = [];
    if (l9 === l10) links.push(`${l9} rules both the 9th and 10th houses.`);
    else {
      if (signOf(l9) === signOf(l10)) links.push(`9th lord ${l9} and 10th lord ${l10} are conjunct in ${signOf(l9)}.`);
      if (aspects(l9, signOf(l10)) && aspects(l10, signOf(l9))) links.push(`9th lord ${l9} and 10th lord ${l10} aspect each other.`);
      if (SIGN_LORDS[signOf(l9)] === l10 && SIGN_LORDS[signOf(l10)] === l9) links.push(`9th lord ${l9} and 10th lord ${l10} exchange signs (Parivartana).`);
    }
    if (links.length) {
      const reasons = [...links];
      let status: RuleStatus = 'active';
      if (DUSTHANAS.includes(houseOf(l9)!) && DUSTHANAS.includes(houseOf(l10)!)) { status = 'weakened'; reasons.push('Both lords occupy Dusthanas (6/8/12).'); }
      if (housesRuledBy(l9).some((x) => [8, 11].includes(x)) || housesRuledBy(l10).some((x) => [8, 11].includes(x))) { status = 'weakened'; reasons.push('A participating lord also rules the 8th or 11th — Laghu Parashari treats the yoga as blemished/mixed.'); }
      rules.push({ ruleId: 'vedic.yoga.rajayoga.dharma_karmadhipati', name: 'Dharma-Karmadhipati Rajayoga', status, planets: [...new Set([l9, l10])], summary: '9th and 10th lords connected.', reasons, sources: [SRC.bphs('Ch. 39, v. 1–12'), SRC.laghu('Ch. 2, v. 1–6')], notes: ['Results expected in the Mahadasha/Antardasha of the 9th and 10th lords.'] });
    }

    // ─── Manglik / Kuja Dosha with Parihara (Muhurta Chintamani; Prashna Marga Ch. 21; DOCUMENT_06) ───
    const mars = get('Mars');
    const mh = houseOf('Mars')!;
    if ([1, 2, 4, 7, 8, 12].includes(mh)) {
      const cancel: string[] = [];
      if (['Aries', 'Scorpio', 'Capricorn'].includes(mars.sign)) cancel.push(`Mars in own/exaltation sign (${mars.sign}).`);
      if (['Cancer', 'Leo'].includes(lagnaSign)) cancel.push(`Mars is Yogakaraka for ${lagnaSign} Lagna.`);
      if (aspects('Jupiter', mars.sign) || signOf('Jupiter') === mars.sign) cancel.push('Mars is aspected by or conjunct Jupiter.');
      const houseSign: Record<number, string[]> = { 2: ['Gemini', 'Virgo'], 4: ['Aries', 'Scorpio'], 7: ['Cancer', 'Capricorn'], 8: ['Sagittarius', 'Pisces'], 12: ['Taurus', 'Libra'] };
      if (houseSign[mh]?.includes(mars.sign)) cancel.push(`Mars in the ${mh}th house in ${mars.sign} (house-specific Parihara).`);
      const fromMoon = offset(moon.sign, mars.sign);
      const fromVenus = offset(signOf('Venus'), mars.sign);
      rules.push({
        ruleId: 'vedic.dosha.manglik_with_parihara',
        name: cancel.length ? 'Manglik (Kuja) placement — CANCELLED by Parihara' : 'Manglik (Kuja) Dosha — no classical cancellation found',
        status: cancel.length ? 'cancelled' : 'active',
        planets: ['Mars'],
        summary: `Mars in the ${mh}th house from Lagna (${mars.sign}).`,
        reasons: cancel.length ? cancel : ['None of the 8 documented cancellation predicates is satisfied.'],
        sources: [SRC.mc('Vivaha Prakarana'), SRC.pm('Ch. 21')],
        confidence: 'textual_support: moderate (late-medieval marriage texts); cross_source_agreement: low; empirical_validation: refuted in demographic divorce studies',
        notes: [
          `From the Moon Mars is in the ${fromMoon}th${[1, 2, 4, 7, 8, 12].includes(fromMoon) ? ' (also a Manglik house, 50% weight)' : ''}; from Venus the ${fromVenus}th${[1, 2, 4, 7, 8, 12].includes(fromVenus) ? ' (Manglik house, 25% weight)' : ''}.`,
          'Base rate: ~42–50% of all charts have Mars in these houses from Lagna alone (DOCUMENT_05 §5, DOCUMENT_10 §2).',
          'Never claim Manglik causes a spouse\'s death or requires a paid ritual (DOCUMENT_06 safety_constraints).',
          'North Indian lists use houses 1,4,7,8,12; South Indian lists add/replace with the 2nd (DOCUMENT_06 known_disagreements).',
        ],
      });
    }
  } else {
    rules.push({ ruleId: 'vedic.dosha.manglik_with_parihara', name: 'Manglik (Kuja) Dosha — not evaluated', status: 'suppressed', planets: ['Mars'], summary: `Mars is in the ${offset(moon.sign, signOf('Mars'))}th from the Moon.`, reasons: [timeNote], sources: [SRC.mc('Vivaha Prakarana')], notes: ['A Moon-based check is only a secondary (50% weight) variant.'] });
  }

  // ─── Parivartana (Phaladeepika 6.32–34) ───
  const seen = new Set<string>();
  for (const a of PHYSICAL) {
    const bLord = SIGN_LORDS[signOf(a)];
    if (bLord === a || !PHYSICAL.includes(bLord) || SIGN_LORDS[signOf(bLord)] !== a) continue;
    const key = [a, bLord].sort().join('-');
    if (seen.has(key)) continue;
    seen.add(key);
    let kind = 'Parivartana (sign exchange)';
    if (lagnaSign) {
      const hs = [houseOf(a)!, houseOf(bLord)!];
      kind = hs.some((h) => DUSTHANAS.includes(h)) ? 'Dainya Parivartana' : hs.includes(3) ? 'Kahala Parivartana' : 'Maha Parivartana';
    }
    rules.push({ ruleId: 'vedic.yoga.parivartana', name: `${kind}: ${a} ⇄ ${bLord}`, status: 'active', planets: [a, bLord], summary: `${a} in ${signOf(a)} and ${bLord} in ${signOf(bLord)} exchange signs.`, reasons: lagnaSign ? [`Links houses ${houseOf(a)} and ${houseOf(bLord)}.`] : ['House classification needs Lagna.'], sources: [SRC.phala('Ch. 6, v. 32–34')] });
  }

  // ─── Kala Sarpa historical audit (DOCUMENT_05 §5; DOCUMENT_06) ───
  {
    const rahu = get('Rahu').longitude;
    const inArc = (from: number, lon: number) => ((lon - from + 360) % 360) < 180;
    const all = PHYSICAL.map((p) => get(p).longitude);
    const side1 = all.every((l) => inArc(rahu, l));
    const side2 = all.every((l) => !inArc(rahu, l));
    if (side1 || side2) {
      rules.push({ ruleId: 'vedic.dosha.kala_sarpa_historical_audit', name: 'Kala Sarpa configuration (non-classical construct)', status: 'active', planets: ['Rahu', 'Ketu'], summary: 'All seven planets lie on one side of the Rahu–Ketu axis (exact-longitude check).', reasons: ['Geometric condition met.'], sources: ['Light on Life, de Fouw & Svoboda (SRC-DEFOUW-SVOBODA)', SRC.bphs('Ch. 35 — Nabhasa Sarpa Yoga only; no Kala Sarpa')], confidence: 'textual_support: absent in classical corpus (20th-century popularization)', notes: ['MANDATORY DISCLOSURE: Kala Sarpa does not appear in BPHS, Brihat Jataka, Phaladeepika or Saravali. Evaluate the actual house placements instead and reject fear-based remedy claims.'] });
    }
  }

  // ─── Vargottama (Phaladeepika 3.6; Brihat Jataka 1.14) ───
  const vargottama = planets.filter((p) => p.vargottama).map((p) => p.planet);
  const lagnaVargottama = lagnaLon !== null && lagnaStable && signName(navamshaSignIndex(lagnaLon)) === lagnaSign;
  if (vargottama.length || lagnaVargottama) {
    rules.push({ ruleId: 'vedic.varga.vargottama', name: 'Vargottama', status: 'active', planets: vargottama, summary: `Same sign in D1 and D9: ${[...vargottama, ...(lagnaVargottama ? ['Lagna'] : [])].join(', ')}.`, reasons: ['D1 sign equals D9 sign — stability comparable to own sign.'], sources: [SRC.phala('Ch. 3, v. 6'), SRC.bj('Ch. 1, v. 14')] });
  }

  // ─── Dasha synthesis (BPHS Ch. 47–59; Laghu Parashari Ch. 4; DOCUMENT_06) ───
  let dasha: DashaAnalysis | null = null;
  if (chart.activeDasha) {
    const ad = chart.activeDasha;
    const notes: string[] = [];
    const md = ad.mahadasha;
    const adLord = ad.antardasha;
    if (adLord && md === adLord) notes.push('Svabhukti (first Antardasha of the Mahadasha): per Laghu Parashari it is a preparatory phase that rarely gives the Mahadasha\'s full results.');
    let rel: number | undefined;
    if (adLord && md !== adLord) {
      rel = offset(signOf(md), signOf(adLord));
      if ([6, 8].includes(rel) || [2, 12].includes(rel)) notes.push(`Antardasha lord is ${rel}th from the Mahadasha lord (${[6, 8].includes(rel) ? 'Shadashtaka 6/8' : 'Dwidwadasha 2/12'}) — classically associated with conflicting priorities or friction.`);
      else if ([1, 4, 5, 7, 9, 10].includes(rel)) notes.push(`Antardasha lord is ${rel}th from the Mahadasha lord (Kendra/Trikona relationship) — classically cohesive.`);
    }
    const mdNakLord = PHYSICAL.includes(md) || md === 'Rahu' || md === 'Ketu' ? get(md).nakshatra : '';
    if (mdNakLord) notes.push(`Mahadasha lord ${md} is in ${mdNakLord} Nakshatra.`);
    const datesReliable = !bd || !bd.suppressedFeatures.includes('exact_dasha_dates');
    if (!datesReliable) notes.push('Dasha boundary dates are NOT reliable for this birth-time precision; speak only of broad periods.');
    dasha = {
      mahadasha: md,
      mahadashaPeriod: `${ad.mahadashaStart} → ${ad.mahadashaEnd}`,
      antardasha: adLord,
      antardashaPeriod: adLord ? `${ad.antardashaStart} → ${ad.antardashaEnd}` : undefined,
      nextAntardasha: ad.nextAntardasha,
      nextAntardashaStart: ad.nextAntardashaStart,
      mdLordHouses: { occupies: houseOf(md), rules: housesRuledBy(md) },
      adLordHouses: adLord ? { occupies: houseOf(adLord), rules: housesRuledBy(adLord) } : undefined,
      adFromMdHouse: rel,
      notes,
      datesReliable,
    };
  }

  // ─── Gochara (current transits) from natal Moon (Phaladeepika Ch. 26) ───
  const transitPlanets: CalculatedPlanet[] = calculatePlanetaryPositions(jdFromEpochMs(now.getTime()));
  const tSign = (name: string) => transitPlanets.find((p) => p.planet === name)!.sign;
  const positions = transitPlanets.map((tp) => {
    const fromMoon = offset(moon.sign, tp.sign);
    const g = GOCHARA[tp.planet];
    let favourable: boolean | null = null;
    let vedhaBy: string | null = null;
    if (g) {
      const idx = g.good.indexOf(fromMoon);
      favourable = idx >= 0;
      if (idx >= 0) {
        const vedhaHouse = g.vedha[idx];
        const blocker = transitPlanets.find((o) => o.planet !== tp.planet && PHYSICAL.includes(o.planet)
          && offset(moon.sign, o.sign) === vedhaHouse
          && !VEDHA_EXEMPT.some(([a, b]) => (a === tp.planet && b === o.planet) || (b === tp.planet && a === o.planet)));
        if (blocker) vedhaBy = blocker.planet;
      }
    }
    return { planet: tp.planet, sign: tp.sign, degree: Math.round(tp.degree * 100) / 100, isRetrograde: tp.isRetrograde, houseFromMoon: fromMoon, houseFromLagna: lagnaSign ? offset(lagnaSign, tp.sign) : null, classicallyFavourableFromMoon: favourable, vedhaBy };
  });
  const satFromMoon = offset(moon.sign, tSign('Saturn'));
  const sadePhase = satFromMoon === 12 ? 'Rising (12th from Moon)' : satFromMoon === 1 ? 'Peak (over natal Moon)' : satFromMoon === 2 ? 'Setting (2nd from Moon)' : null;
  const doubleTransit: number[] = [];
  if (lagnaSign) {
    const jupHouses = [1, 5, 7, 9].map((n) => ((offset(lagnaSign, tSign('Jupiter')) + n - 2) % 12) + 1);
    const satHouses = [1, 3, 7, 10].map((n) => ((offset(lagnaSign, tSign('Saturn')) + n - 2) % 12) + 1);
    for (let h = 1; h <= 12; h++) if (jupHouses.includes(h) && satHouses.includes(h)) doubleTransit.push(h);
  }
  const transits: TransitAnalysis = {
    asOf: now.toISOString().split('T')[0],
    positions,
    sadeSati: { active: !!sadePhase, phase: sadePhase },
    saturnDhaiya: { active: [4, 8].includes(satFromMoon), kind: satFromMoon === 4 ? 'Kantaka/Ardhashtama (4th)' : satFromMoon === 8 ? 'Ashtama Shani (8th)' : null },
    doubleTransitHousesFromLagna: doubleTransit,
  };
  if (sadePhase) {
    const mitig: string[] = [];
    if (lagnaSign && ['Taurus', 'Libra', 'Capricorn', 'Aquarius'].includes(lagnaSign)) mitig.push(`Saturn is Yogakaraka or Lagna lord for ${lagnaSign} Lagna.`);
    if (['Capricorn', 'Aquarius'].includes(moon.sign)) mitig.push('Saturn owns the natal Moon sign.');
    rules.push({ ruleId: 'vedic.transit.sade_sati_ashtakavarga_modulated', name: `Sade Sati — ${sadePhase}`, status: mitig.length ? 'mitigated' : 'active', planets: ['Saturn', 'Moon'], summary: `Transiting Saturn in ${tSign('Saturn')} is ${satFromMoon === 1 ? 'over' : `${satFromMoon}th from`} the natal Moon (${moon.sign}).`, reasons: mitig.length ? mitig : ['No documented mitigation from Lagna/Moon sign; Ashtakavarga modulation not computed.'], sources: [SRC.phala('Ch. 26, v. 22–30'), SRC.bphs('Ch. 66')], notes: ['Frame as a 7.5-year cycle of maturation and restructuring, never guaranteed misfortune (DOCUMENT_05 §5).', 'Must be read together with the running Mahadasha (DOCUMENT_07 Q08).'] });
  }

  return {
    settings: {
      tradition: 'Vedic Parashari (Jyotisha)',
      zodiac: 'Sidereal (Nirayana)',
      ayanamsha: 'Lahiri (Chitrapaksha)',
      ayanamshaDeg: Math.round((bd?.ayanamshaDeg ?? 0) * 10000) / 10000,
      houseSystem: 'Whole Sign (Rashi = Bhava)',
      nodeMode: 'Mean node',
      dashaYear: 'Vimshottari, 365.2425-day year',
    },
    workflow: {
      id: bd?.workflowId ?? 'A_exact',
      timePrecision: bd?.timePrecision ?? 'exact',
      lagnaAvailable,
      suppressedFeatures: bd?.suppressedFeatures ?? [],
      warnings: bd?.warnings ?? [],
      lagnaSignStabilityPct: bd?.lagnaSignStabilityPct ?? 100,
      lagnaSignsInWindow: bd?.lagnaSignsInWindow ?? [chart.ascendant.sign],
      moonSignsInWindow: bd?.moonSignsInWindow ?? [moon.sign],
      moonNakshatrasInWindow: bd?.moonNakshatrasInWindow ?? [moon.nakshatra],
    },
    lagna: lagnaSign && lagnaLon !== null
      ? { sign: lagnaSign, degree: Math.round(chart.ascendant.degree * 100) / 100, nakshatra: String(chart.ascendant.nakshatra ?? ''), navamsha: signName(navamshaSignIndex(lagnaLon)), functionalScheme: scheme! }
      : null,
    chandraLagna: { sign: moon.sign, degree: Math.round(moon.degree * 100) / 100, nakshatra: moon.nakshatra, pada: moon.pada, paksha: waxing ? 'Shukla (waxing)' : 'Krishna (waning)', tithi },
    suryaLagna: { sign: sun.sign },
    planets,
    houses,
    housesFromMoon: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((h) => {
      const sign = SIGNS[(signIdx(moon.sign) + h - 1) % 12];
      return { house: h, sign, occupants: bodies.filter((b) => b.sign === sign).map((b) => b.planet) };
    }),
    rules,
    dasha,
    transits,
    notComputed: ['Shadbala', 'Ashtakavarga (SAV/BAV bindus)', 'Pratyantardasha', 'Divisional charts other than D9/D10', 'Arudha Lagna / Upapada', 'Chara Karakas (Jaimini)', 'Western / Hellenistic / BaZi charts'],
  };
}

export const VIMSHOTTARI_LORDS = DASHA_ORDER.map((d) => d.planet);
