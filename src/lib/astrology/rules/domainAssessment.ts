/**
 * Question-specific evidence assessment — the stable analytical foundation of a consultation.
 *
 * Given the calculated chart and fired rules, this module decides deterministically, for the life
 * domain a question is about: which chart factors matter, whether each one supports, challenges or
 * mitigates, the overall balance, the confidence level, what timing windows the Dasha sequence
 * supports, and what information is missing. The language model only writes from this assessment;
 * it cannot change roles, confidence or timing (DOCUMENT_05 §1–2, DOCUMENT_06 §3 conflict calculus).
 * Identical inputs therefore always yield the identical analytical conclusions.
 */
import type { ChartData, DashaPeriod } from '../../../types/index.ts';
import { SIGNS, SIGN_LORDS, EXALTATION, DEBILITATION } from '../calculations/planetaryPositions.ts';
import { aspectedSigns, type VedicAnalysis, type FiredRule } from './vedicAnalysis.ts';

export const ASSESSMENT_VERSION = 'assessment-v1';

export type AssessmentDomain =
  | 'marriage' | 'career' | 'wealth' | 'education' | 'family_children' | 'health'
  | 'relocation' | 'spirituality' | 'personality' | 'transitions';

export type FactorRole = 'supporting' | 'challenging' | 'mitigating';

export interface AssessedFactor {
  id: string;
  role: FactorRole;
  weight: 1 | 2 | 3;
  /** Plain-language statement, understandable without astrological knowledge. */
  plain: string;
  /** Technical statement for the evidence section. */
  technical: string;
  sources: string[];
}

export interface TimingWindow {
  id: string;
  start: string;
  end: string;
  period: string;
  strength: 'stronger' | 'supporting';
  theme: string;
  why: string[];
  limitations: string[];
}

export type Balance = 'mostly_supportive' | 'mixed' | 'mostly_challenging' | 'insufficient';
export type Confidence = 'well_supported' | 'tentative' | 'not_assessable';

export interface DomainAssessment {
  version: string;
  domain: AssessmentDomain;
  domainLabel: string;
  /** Everyday name of the life area (e.g. "marriage and partnership"), used in plain-language text. */
  area: string;
  reference: 'lagna' | 'moon';
  focusHouses: number[];
  factors: AssessedFactor[];
  balance: Balance;
  balanceExplanation: string;
  confidence: Confidence;
  confidenceReasons: string[];
  timing: { assessable: boolean; reason: string; windows: TimingWindow[] };
  missingInformation: string[];
  uncertainties: string[];
  /** Sign occupying each house from the reference point — used to validate generated text. */
  houseSigns: Record<number, string>;
}

const HOUSE_AREAS: Record<number, string> = {
  1: 'self, health and general direction', 2: 'savings, family and speech', 3: 'effort, courage and communication',
  4: 'home, mother and inner peace', 5: 'creativity, children and intellect', 6: 'daily work, health routines and obstacles',
  7: 'marriage and partnerships', 8: 'sudden changes, shared resources and longevity of bonds', 9: 'fortune, teachers and higher learning',
  10: 'career and public standing', 11: 'income, gains and networks', 12: 'expenses, foreign lands and retreat',
};

interface DomainConfig { label: string; area: string; primary: number[]; secondary: number[]; karakas: string[]; varga: 'D9' | 'D10' | null }
const DOMAINS: Record<AssessmentDomain, DomainConfig> = {
  marriage: { label: 'Relationships & marriage', area: 'marriage and partnership', primary: [7], secondary: [2, 8], karakas: ['Venus'], varga: 'D9' },
  career: { label: 'Career & direction', area: 'career', primary: [10], secondary: [6, 11], karakas: ['Saturn', 'Sun'], varga: 'D10' },
  wealth: { label: 'Money & finances', area: 'wealth', primary: [2, 11], secondary: [5, 9], karakas: ['Jupiter'], varga: null },
  education: { label: 'Education & learning', area: 'learning', primary: [4, 5], secondary: [9], karakas: ['Mercury', 'Jupiter'], varga: null },
  family_children: { label: 'Family & children', area: 'children and family', primary: [5], secondary: [2, 4], karakas: ['Jupiter'], varga: null },
  health: { label: 'Health & vitality', area: 'vitality', primary: [1, 6], secondary: [8], karakas: ['Sun', 'Moon'], varga: null },
  relocation: { label: 'Relocation & travel', area: 'foreign residence and travel', primary: [12, 9], secondary: [4], karakas: ['Rahu', 'Moon'], varga: null },
  spirituality: { label: 'Spiritual growth', area: 'spiritual life', primary: [9, 12], secondary: [5], karakas: ['Jupiter', 'Ketu'], varga: null },
  personality: { label: 'Personality & temperament', area: 'temperament', primary: [1], secondary: [5, 9], karakas: ['Moon', 'Sun'], varga: null },
  transitions: { label: 'Major life periods', area: 'life direction', primary: [1, 8], secondary: [4, 10], karakas: ['Saturn'], varga: null },
};

const NATURAL_MALEFICS = ['Sun', 'Mars', 'Saturn', 'Rahu', 'Ketu'];
const signIdx = (s: string) => SIGNS.indexOf(s);
const signAt = (refSign: string, house: number) => SIGNS[(signIdx(refSign) + house - 1) % 12];
const houseFrom = (refSign: string, sign: string) => ((signIdx(sign) - signIdx(refSign) + 12) % 12) + 1;
const ordinal = (n: number) => `${n}${n === 1 ? 'st' : n === 2 ? 'nd' : n === 3 ? 'rd' : 'th'}`;

export function assessDomain(chart: ChartData, analysis: VedicAnalysis, domain: AssessmentDomain, now: Date = new Date()): DomainAssessment {
  const cfg = DOMAINS[domain];
  const reference: 'lagna' | 'moon' = analysis.lagna ? 'lagna' : 'moon';
  const refSign = analysis.lagna?.sign ?? analysis.chandraLagna.sign;
  const refLabel = reference === 'lagna' ? '' : ' (counted from your Moon sign)';
  const p = (name: string) => analysis.planets.find((x) => x.planet === name)!;
  const waxing = analysis.chandraLagna.paksha.startsWith('Shukla');
  const isMalefic = (name: string) => NATURAL_MALEFICS.includes(name) || (name === 'Moon' && !waxing)
    // Mercury takes on the nature of the planets it joins (DOCUMENT_03 §1.1)
    || (name === 'Mercury' && analysis.planets.some((x) => x.planet !== 'Mercury' && NATURAL_MALEFICS.includes(x.planet) && x.sign === p('Mercury').sign));
  // Directional strength (Dig Bala, DOCUMENT_03 §5.2): house where each planet is strongest
  const DIG_BALA: Record<string, number> = { Jupiter: 1, Mercury: 1, Sun: 10, Mars: 10, Saturn: 7, Moon: 4, Venus: 4 };
  const factors: AssessedFactor[] = [];
  const add = (f: AssessedFactor) => { if (!factors.some((x) => x.id === f.id)) factors.push(f); };
  const scheme = analysis.lagna?.functionalScheme;
  const isFunctionalBenefic = (name: string) => !!scheme && (scheme.yogakaraka === name || scheme.benefics.includes(name));

  const strengthOf = (name: string): 'strong' | 'weak' | 'average' => {
    const d = p(name).dignity;
    if (/Exalted|Moolatrikona|Own sign/.test(d)) return 'strong';
    if (/Debilitated/.test(d)) return 'weak';
    return 'average';
  };
  const neechabhangaFor = (name: string): FiredRule | undefined =>
    analysis.rules.find((r) => r.ruleId === 'vedic.yoga.neechabhanga_rajayoga' && r.planets[0] === name && r.status !== 'suppressed');

  /** Planet condition: dignity, dusthana placement, combustion, debilitation cancellation. */
  const assessPlanet = (name: string, roleLabel: string, weight: 1 | 2 | 3, plainRole: string) => {
    const pl = p(name);
    const house = houseFrom(refSign, pl.sign);
    const s = strengthOf(name);
    const tech = `${roleLabel} ${name} in ${pl.sign} (${ordinal(house)} house${refLabel}), ${pl.dignity === 'Other' ? `dispositor relationship: ${pl.relationshipToDispositor}` : pl.dignity}${pl.isRetrograde ? ', retrograde' : ''}${pl.combust ? ', combust' : ''}`;
    if (s === 'strong') {
      add({ id: `f-dignity-${name}`, role: 'supporting', weight, plain: `${name}, ${plainRole}, is in one of its strongest signs, which tradition reads as a solid foundation for ${cfg.area}.`, technical: tech, sources: ['BPHS Ch. 3 (dignities)'] });
    } else if (s === 'weak') {
      add({ id: `f-dignity-${name}`, role: 'challenging', weight, plain: `${name}, ${plainRole}, is in a sign where tradition considers it weak, so ${cfg.area} is read as needing more conscious effort.`, technical: tech, sources: ['BPHS Ch. 3 (dignities)'] });
      const nb = neechabhangaFor(name);
      // status 'mitigated' = partial cancellation; 'active' + "Rajayoga" = full cancellation; 'active' otherwise = none
      const fullCancel = nb?.status === 'active' && /Rajayoga/.test(nb.name);
      if (nb && (nb.status === 'mitigated' || fullCancel)) {
        add({ id: `f-cancel-${name}`, role: 'mitigating', weight: fullCancel ? 2 : 1, plain: fullCancel
          ? `Several conditions in your chart cancel that weakness, which tradition reads as early difficulty turning into real strength over time.`
          : `Other conditions in your chart partly offset that weakness, so it is read as a challenge that can be worked through rather than a fixed limitation.`,
          technical: `${nb.name}: ${nb.reasons.join(' ')}`, sources: nb.sources });
      }
    }
    if ([6, 8, 12].includes(house) && s !== 'strong') {
      add({ id: `f-dusthana-${name}`, role: 'challenging', weight: 1, plain: `${name}, ${plainRole}, sits in a house associated with ${HOUSE_AREAS[house]}, which tradition reads as ${cfg.area} involving some complication or delay.`, technical: tech, sources: ['Laghu Parashari (Dusthana placement)'] });
    }
    if (pl.combust) {
      add({ id: `f-combust-${name}`, role: 'challenging', weight: 1, plain: `${name} is very close to the Sun, which tradition says can overshadow its results for ${cfg.area}.`, technical: `${name} combust (within its combustion orb of the Sun)`, sources: ['DOCUMENT_03 §1.1 combustion orbs'] });
    }
  };

  // ─── 1. Primary houses: occupants, aspects, hemming ───
  for (const h of cfg.primary) {
    const sign = signAt(refSign, h);
    const occupants = analysis.planets.filter((x) => x.sign === sign);
    for (const o of occupants) {
      const digBala = reference === 'lagna' && DIG_BALA[o.planet] === h;
      if (isMalefic(o.planet) && (digBala || cfg.karakas.includes(o.planet)) && strengthOf(o.planet) !== 'weak') {
        add({ id: `f-occupant-${h}-${o.planet}`, role: 'supporting', weight: 2, plain: `${o.planet} sits in your house of ${HOUSE_AREAS[h]}${digBala ? ', where tradition considers it at its most powerful' : ', and it is a natural significator of this area'} — a strong placement for ${cfg.area}.`, technical: `${o.planet} in the ${ordinal(h)} house (${sign})${digBala ? ' with full Dig Bala' : ' (karaka)'}; ${o.dignity}; ${o.functionalRole}`, sources: ['BPHS Ch. 27 (Dig Bala)'] });
        continue;
      }
      const strong = strengthOf(o.planet) === 'strong' || isFunctionalBenefic(o.planet);
      if (!isMalefic(o.planet)) {
        add({ id: `f-occupant-${h}-${o.planet}`, role: 'supporting', weight: 2, plain: `${o.planet}, a naturally gentle and expansive planet, sits in your house of ${HOUSE_AREAS[h]}, which tradition sees as protective for this area.`, technical: `${o.planet} occupies the ${ordinal(h)} house (${sign})${refLabel}; ${o.functionalRole}`, sources: ['Phaladeepika Ch. 15 (Bhava results)'] });
      } else if (strong) {
        add({ id: `f-occupant-${h}-${o.planet}`, role: 'mitigating', weight: 1, plain: `${o.planet} sits in your house of ${HOUSE_AREAS[h]}; it can bring intensity, but it is well placed or helpful for your chart, which softens that.`, technical: `${o.planet} occupies the ${ordinal(h)} house (${sign}); ${o.dignity}; ${o.functionalRole}`, sources: ['Phaladeepika Ch. 15'] });
      } else {
        add({ id: `f-occupant-${h}-${o.planet}`, role: 'challenging', weight: 2, plain: `${o.planet}, a planet tradition treats as harsh, sits in your house of ${HOUSE_AREAS[h]}, which can bring friction, intensity or delay to this area.`, technical: `${o.planet} occupies the ${ordinal(h)} house (${sign})${refLabel}; ${o.functionalRole}`, sources: ['Phaladeepika Ch. 15'] });
      }
    }
    for (const a of ['Jupiter', 'Venus', 'Saturn', 'Mars']) {
      if (p(a).sign === sign || !aspectedSigns(a, p(a).sign).includes(sign)) continue;
      if (a === 'Jupiter' || a === 'Venus') {
        add({ id: `f-aspect-${h}-${a}`, role: 'supporting', weight: a === 'Jupiter' ? 2 : 1, plain: `${a} looks toward your house of ${HOUSE_AREAS[h]}, which tradition counts as a blessing for this area.`, technical: `${a} (in ${p(a).sign}) casts a full aspect on the ${ordinal(h)} house (${sign})`, sources: ['BPHS Ch. 26 (Graha Drishti)'] });
      } else if (scheme?.yogakaraka === a || isFunctionalBenefic(a)) {
        add({ id: `f-aspect-${h}-${a}`, role: 'supporting', weight: 1, plain: `${a}, which is a helpful planet for your particular chart, looks toward your house of ${HOUSE_AREAS[h]}, adding commitment and staying power.`, technical: `${a} (${p(a).functionalRole}) aspects the ${ordinal(h)} house (${sign})`, sources: ['BPHS Ch. 26', 'Laghu Parashari'] });
      } else {
        add({ id: `f-aspect-${h}-${a}`, role: 'challenging', weight: 1, plain: `${a} looks toward your house of ${HOUSE_AREAS[h]}, which tradition reads as added pressure or tension here.`, technical: `${a} (in ${p(a).sign}) aspects the ${ordinal(h)} house (${sign})`, sources: ['BPHS Ch. 26'] });
      }
    }
    const prev = SIGNS[(signIdx(sign) + 11) % 12];
    const next = SIGNS[(signIdx(sign) + 1) % 12];
    const malefics = analysis.planets.filter((x) => isMalefic(x.planet));
    if (malefics.some((m) => m.sign === prev) && malefics.some((m) => m.sign === next)) {
      add({ id: `f-hemmed-${h}`, role: 'challenging', weight: 2, plain: `Your house of ${HOUSE_AREAS[h]} is flanked on both sides by harsher planets, which tradition reads as feeling squeezed or pressured in this area.`, technical: `Papa Kartari: malefics in ${prev} and ${next} around the ${ordinal(h)} house`, sources: ['DOCUMENT_05 §10 (Papa Kartari)'] });
    }

    // ─── 2. House lord ───
    const lord = SIGN_LORDS[sign];
    assessPlanet(lord, `The ruler of your ${ordinal(h)} house`, 3, `the planet that rules your area of ${cfg.area}`);
    const lordHouse = houseFrom(refSign, p(lord).sign);
    if ([1, 4, 5, 7, 9, 10].includes(lordHouse) && strengthOf(lord) !== 'weak') {
      add({ id: `f-lordplace-${h}`, role: 'supporting', weight: 2, plain: `The planet that governs ${cfg.area} (${lord}) sits in a strong, well-supported part of your chart (your house of ${HOUSE_AREAS[lordHouse]}).`, technical: `${ordinal(h)} lord ${lord} in the ${ordinal(lordHouse)} house (Kendra/Trikona)${refLabel}`, sources: ['Laghu Parashari'] });
    }
  }

  // ─── 3. Natural significators (Karaka) ───
  for (const k of cfg.karakas) assessPlanet(k, `The natural significator of ${cfg.area}:`, 2, `the planet traditionally associated with ${cfg.area}`);

  // ─── 4. Divisional chart depth (DOCUMENT_06 §3 stage 3) ───
  if (cfg.varga) {
    const lord = SIGN_LORDS[signAt(refSign, cfg.primary[0])];
    for (const name of [...new Set([lord, ...cfg.karakas.slice(0, 1)])]) {
      const vSign = cfg.varga === 'D9' ? p(name).navamsha : p(name).dashamsha;
      if (!vSign) continue;
      if (EXALTATION[name]?.sign === vSign || p(name).vargottama && cfg.varga === 'D9') {
        add({ id: `f-varga-${cfg.varga}-${name}`, role: 'supporting', weight: 1, plain: `In the deeper chart astrologers use for ${cfg.area}, ${name} is strong, which tradition reads as this area improving with maturity.`, technical: `${name} ${EXALTATION[name]?.sign === vSign ? 'exalted' : 'Vargottama'} in ${cfg.varga} (${vSign})`, sources: ['BPHS Ch. 6–7 (Vargas)'] });
      } else if (DEBILITATION[name]?.sign === vSign) {
        add({ id: `f-varga-${cfg.varga}-${name}`, role: 'challenging', weight: 1, plain: `In the deeper chart astrologers use for ${cfg.area}, ${name} is weak, which tradition reads as this area needing sustained attention over time.`, technical: `${name} debilitated in ${cfg.varga} (${vSign})`, sources: ['BPHS Ch. 6–7 (Vargas)'] });
      }
    }
  }

  // ─── 5. Domain-relevant fired rules ───
  const domainPlanets = new Set([...cfg.primary.map((h) => SIGN_LORDS[signAt(refSign, h)]), ...cfg.karakas]);
  for (const r of analysis.rules) {
    if (r.status === 'suppressed') continue;
    if (r.ruleId === 'vedic.dosha.manglik_with_parihara' && domain === 'marriage') {
      if (r.status === 'active') add({ id: 'f-rule-manglik', role: 'challenging', weight: 1, plain: 'Mars is in a position traditionally linked with strong, direct energy in close relationships — a very common placement (around 40–50% of charts) that calls for patient communication rather than fear.', technical: `${r.name}: ${r.summary}`, sources: r.sources });
      else add({ id: 'f-rule-manglik', role: 'mitigating', weight: 1, plain: 'A Mars placement that apps often flag as "Manglik" is cancelled by classical rules in your chart.', technical: `${r.name}: ${r.reasons.join(' ')}`, sources: r.sources });
    }
    if (r.ruleId === 'vedic.yoga.rajayoga.dharma_karmadhipati' && ['career', 'wealth', 'transitions'].includes(domain) && r.status !== 'cancelled') {
      add({ id: 'f-rule-dkr', role: 'supporting', weight: r.status === 'active' ? 2 : 1, plain: 'The planets of purpose and of work are linked in your chart, which tradition reads as career progress coming through meaningful, principled work.', technical: `${r.name} (${r.status}): ${r.reasons.join(' ')}`, sources: r.sources });
    }
    if (r.ruleId.startsWith('vedic.yoga.pancha_mahapurusha') && r.status !== 'cancelled' && r.planets.some((x) => domainPlanets.has(x) || cfg.primary.some((h) => p(x).sign === signAt(refSign, h)))) {
      add({ id: `f-rule-${r.ruleId.split('.').pop()}`, role: 'supporting', weight: r.status === 'active' ? 2 : 1, plain: `${r.planets[0]} is especially powerful in your chart, which tradition reads as a notable strength you can draw on in ${cfg.area}.`, technical: `${r.name} (${r.status}): ${r.reasons.join(' ')}`, sources: r.sources });
    }
    if (r.ruleId === 'vedic.yoga.gajakesari' && ['personality', 'wealth', 'education'].includes(domain) && r.status !== 'cancelled') {
      add({ id: 'f-rule-gajakesari', role: 'supporting', weight: 1, plain: 'Jupiter and the Moon support each other in your chart, traditionally linked with good judgement and support from mentors (a fairly common combination).', technical: `${r.name} (${r.status}): ${r.reasons.join(' ')}`, sources: r.sources });
    }
    if (r.ruleId === 'vedic.yoga.kemadruma_and_bhanga' && ['personality', 'wealth'].includes(domain)) {
      add({ id: 'f-rule-kemadruma', role: r.status === 'active' ? 'challenging' : 'mitigating', weight: 1, plain: r.status === 'active'
        ? 'Your Moon stands somewhat alone, which tradition links with a strong streak of self-reliance and needing to build your own support network.'
        : 'A traditional sign of emotional isolation is cancelled in your chart by planets supporting the Moon.', technical: `${r.name}: ${r.reasons.join(' ')}`, sources: r.sources });
    }
    if (r.ruleId === 'vedic.transit.sade_sati_ashtakavarga_modulated' && ['career', 'transitions', 'personality', 'wealth'].includes(domain)) {
      add({ id: 'f-transit-sadesati', role: r.status === 'mitigated' ? 'mitigating' : 'challenging', weight: 1, plain: r.status === 'mitigated'
        ? 'You are in Saturn\'s 7½-year cycle, but Saturn is a friendly planet for your chart, so tradition reads it mainly as a period of maturing and consolidating.'
        : 'You are in Saturn\'s 7½-year cycle, traditionally a period of heavier responsibility, restructuring and growing maturity.', technical: `${r.name}: ${r.summary}`, sources: r.sources });
    }
  }

  // ─── Balance (DOCUMENT_06 §3: cancellations reduce the weight of afflictions) ───
  const sum = (role: FactorRole) => factors.filter((f) => f.role === role).reduce((s, f) => s + f.weight, 0);
  const S = sum('supporting');
  const C = sum('challenging');
  const M = sum('mitigating');
  const netC = Math.max(0, C - 0.7 * M);
  let balance: Balance = 'insufficient';
  if (S + netC > 0) {
    const ratio = S / (S + netC);
    balance = ratio >= 0.65 ? 'mostly_supportive' : ratio <= 0.35 ? 'mostly_challenging' : 'mixed';
  }
  const balanceExplanation = `Supporting weight ${S}, challenging weight ${C}, mitigating weight ${M} (challenges reduced by mitigations to ${netC.toFixed(1)}).`;

  // ─── Confidence (consistency and completeness of the astrological evidence, not a probability) ───
  const bd = chart.birthData;
  const confidenceReasons: string[] = [];
  let confidence: Confidence = 'well_supported';
  if (factors.length === 0) { confidence = 'not_assessable'; confidenceReasons.push('No chart factors could be evaluated for this question.'); }
  if (reference === 'moon') { confidence = confidence === 'not_assessable' ? confidence : 'tentative'; confidenceReasons.push('Birth time is unknown, so houses are counted from the Moon sign — a secondary reference point.'); }
  if (bd && bd.timePrecision === 'approximate' && bd.lagnaSignsInWindow.length > 1) { confidence = confidence === 'not_assessable' ? confidence : 'tentative'; confidenceReasons.push('The rising sign changes within your birth-time window, so house-based conclusions are conditional.'); }
  if (balance === 'mixed') { confidence = confidence === 'well_supported' ? 'tentative' : confidence; confidenceReasons.push('Supporting and challenging indicators are closely balanced.'); }
  if (factors.length < 3 && confidence === 'well_supported') { confidence = 'tentative'; confidenceReasons.push('Fewer than three independent chart factors bear on this question.'); }
  if (confidence === 'well_supported') confidenceReasons.push('Several independent factors (house, its ruler, the natural significator) point the same way.');

  // ─── Timing (natal promise ∧ Dasha activation; DOCUMENT_05 §2) ───
  const timing = assessTiming(chart, analysis, cfg, refSign, reference, domain, now);

  // ─── Missing information & uncertainties ───
  const missingInformation: string[] = [];
  const uncertainties: string[] = [];
  if (reference === 'moon') missingInformation.push('Your birth time — needed to calculate your houses accurately and to judge timing.');
  if (bd?.timePrecision === 'approximate' && bd.lagnaSignsInWindow.length > 1) missingInformation.push('A more precise birth time — your rising sign changes within the ±30-minute window.');
  if (domain === 'marriage') uncertainties.push('Upapada Lagna and partner compatibility were not calculated; a partner\'s chart is needed for compatibility.');
  if (domain === 'career' && bd?.suppressedFeatures.includes('navamsha_lagna')) uncertainties.push('The career chart (D10) rising sign is sensitive to small birth-time errors.');
  if (domain === 'wealth') uncertainties.push('Ashtakavarga (a point-based strength system often used for wealth) was not calculated.');
  if (domain === 'health') uncertainties.push('Astrology cannot assess medical conditions; this reading only describes traditional themes.');
  uncertainties.push('Planetary strength scores (Shadbala) were not calculated.');

  const houseSigns: Record<number, string> = {};
  for (let h = 1; h <= 12; h++) houseSigns[h] = signAt(refSign, h);

  return {
    version: ASSESSMENT_VERSION,
    domain,
    domainLabel: cfg.label,
    area: cfg.area,
    reference,
    focusHouses: cfg.primary,
    factors: factors.sort((a, b) => b.weight - a.weight || a.id.localeCompare(b.id)),
    balance,
    balanceExplanation,
    confidence,
    confidenceReasons,
    timing,
    missingInformation,
    uncertainties,
    houseSigns,
  };
}

function assessTiming(chart: ChartData, analysis: VedicAnalysis, cfg: DomainConfig, refSign: string, reference: 'lagna' | 'moon', domain: AssessmentDomain, now: Date): DomainAssessment['timing'] {
  if (domain === 'health') return { assessable: false, reason: 'Timing of health matters is not predicted.', windows: [] };
  if (reference === 'moon') return { assessable: false, reason: 'Timing needs an accurate birth time; without it the planetary-period dates are uncertain.', windows: [] };
  if (!analysis.dasha?.datesReliable || !chart.dashaPeriods?.length) return { assessable: false, reason: 'Planetary-period dates are not reliable for this birth-time precision.', windows: [] };

  const p = (name: string) => analysis.planets.find((x) => x.planet === name)!;
  const houseSigns = cfg.primary.map((h) => signAt(refSign, h));
  const lords = new Set(houseSigns.map((s) => SIGN_LORDS[s]));
  const connection = (lord: string): string | null => {
    if (lords.has(lord)) return `${lord} rules your house of ${cfg.area}`;
    if (houseSigns.includes(p(lord).sign)) return `${lord} sits in your house of ${cfg.area}`;
    if (cfg.karakas.includes(lord)) return `${lord} is the natural significator of ${cfg.area}`;
    if (houseSigns.some((s) => aspectedSigns(lord, p(lord).sign).includes(s))) return `${lord} aspects your house of ${cfg.area}`;
    if ([...lords].some((l) => p(l).sign === p(lord).sign)) return `${lord} is joined with the ruler of ${cfg.area}`;
    return null;
  };

  const horizon = now.getTime() + 6 * 365.25 * 86400000;
  const windows: TimingWindow[] = [];
  const doubleTransit = analysis.transits.doubleTransitHousesFromLagna.filter((h) => cfg.primary.includes(h));
  for (const md of chart.dashaPeriods as DashaPeriod[]) {
    const mdConn = connection(md.planet);
    for (const ad of md.subPeriods || []) {
      const s = ad.startMs ?? Date.parse(ad.startDate);
      const e = ad.endMs ?? Date.parse(ad.endDate);
      if (e < now.getTime() || s > horizon) continue;
      const adConn = connection(ad.planet);
      if (!adConn) continue;
      const strength: TimingWindow['strength'] = mdConn ? 'stronger' : 'supporting';
      const isCurrent = s <= now.getTime() && now.getTime() < e;
      windows.push({
        id: `w-${md.planet}-${ad.planet}-${ad.startDate.slice(0, 4)}`,
        start: ad.startDate,
        end: ad.endDate,
        period: `${md.planet} Mahadasha – ${ad.planet} Antardasha`,
        strength,
        theme: `A period in which ${cfg.area} themes are traditionally more active.`,
        why: [adConn, ...(mdConn ? [`the main period lord: ${mdConn}`] : [])].concat(isCurrent && doubleTransit.length ? ['Jupiter and Saturn currently both influence this house (double transit)'] : []),
        limitations: ['Shows when the theme is emphasised, not that a specific event will happen.', ...(isCurrent ? [] : ['Future transits were not evaluated for this window.'])],
      });
    }
  }
  windows.sort((a, b) => (a.strength === b.strength ? a.start.localeCompare(b.start) : a.strength === 'stronger' ? -1 : 1));
  const chosen = windows.slice(0, 4).sort((a, b) => a.start.localeCompare(b.start));
  return chosen.length
    ? { assessable: true, reason: 'Based on the Vimshottari planetary periods connected to this area over the next six years.', windows: chosen }
    : { assessable: true, reason: 'No planetary period in the next six years is strongly connected to this area.', windows: [] };
}

/** Maps router domains to an assessment domain (first match), or null for non-chart questions. */
export function pickAssessmentDomain(domains: string[], fallbackPersonal: boolean): AssessmentDomain | null {
  const order: AssessmentDomain[] = ['marriage', 'career', 'wealth', 'education', 'family_children', 'health', 'relocation', 'spirituality', 'transitions', 'personality'];
  for (const d of order) if (domains.includes(d)) return d;
  return fallbackPersonal ? 'personality' : null;
}
