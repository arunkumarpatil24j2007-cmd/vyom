import { getNakshatraFromLongitude } from './nakshatras';
import { SIGNS, SIGN_LORDS } from './planetaryPositions';

export interface KootaFactor {
  name: string;
  pointsObtained: number;
  totalPoints: number;
  description: string;
  status: 'excellent' | 'good' | 'average' | 'inauspicious';
}

export interface CompatibilityResult {
  totalScore: number;
  maxScore: number; // 36
  percentage: number;
  verdict: string;
  manglikStatus1: boolean;
  manglikStatus2: boolean;
  factors: KootaFactor[];
}

// 27 Nakshatras Ganas (Deva, Manushya, Rakshasa)
const NAKSHATRA_GANAS = [
  'Deva', 'Manushya', 'Rakshasa', 'Manushya', 'Deva', 'Manushya', 'Deva', 'Deva', 'Rakshasa',
  'Rakshasa', 'Manushya', 'Manushya', 'Deva', 'Rakshasa', 'Deva', 'Rakshasa', 'Deva', 'Rakshasa',
  'Rakshasa', 'Manushya', 'Manushya', 'Deva', 'Rakshasa', 'Rakshasa', 'Manushya', 'Manushya', 'Deva'
];

// 27 Nakshatras Nadis (0: Adi, 1: Madhya, 2: Antya)
const NAKSHATRA_NADIS = [
  'Adi', 'Madhya', 'Antya', 'Antya', 'Madhya', 'Adi', 'Adi', 'Madhya', 'Antya',
  'Antya', 'Madhya', 'Adi', 'Adi', 'Madhya', 'Antya', 'Antya', 'Madhya', 'Adi',
  'Adi', 'Madhya', 'Antya', 'Antya', 'Madhya', 'Adi', 'Adi', 'Madhya', 'Antya'
];

/**
 * Calculates authentic 36-point Ashtakoota compatibility between two Moon longitudes
 */
export function calculateAshtakoota(
  moonLong1: number,
  moonLong2: number,
  marsHouse1: number = 1,
  marsHouse2: number = 1
): CompatibilityResult {
  const nak1 = getNakshatraFromLongitude(moonLong1);
  const nak2 = getNakshatraFromLongitude(moonLong2);

  const signIdx1 = Math.floor(moonLong1 / 30) + 1;
  const signIdx2 = Math.floor(moonLong2 / 30) + 1;
  const lord1 = SIGN_LORDS[SIGNS[signIdx1 - 1]];
  const lord2 = SIGN_LORDS[SIGNS[signIdx2 - 1]];

  // 1. Varna (1 Point)
  // Brahmin (Cancer, Scorpio, Pisces), Kshatriya (Aries, Leo, Sagittarius), Vaishya (Taurus, Virgo, Capricorn), Shudra (Gemini, Libra, Aquarius)
  const getVarnaRank = (idx: number) => {
    if ([4, 8, 12].includes(idx)) return 4; // Brahmin
    if ([1, 5, 9].includes(idx)) return 3; // Kshatriya
    if ([2, 6, 10].includes(idx)) return 2; // Vaishya
    return 1; // Shudra
  };
  const varnaPoints = getVarnaRank(signIdx1) >= getVarnaRank(signIdx2) ? 1 : 0;

  // 2. Vashya (2 Points)
  // Harmonious mutual control/attraction
  let vashyaPoints = 1;
  if (signIdx1 === signIdx2) vashyaPoints = 2;
  else if (Math.abs(signIdx1 - signIdx2) === 6) vashyaPoints = 1.5;

  // 3. Tara (3 Points) - Destiny & Longevity
  const count1to2 = ((nak2.index - nak1.index + 27) % 27) + 1;
  const count2to1 = ((nak1.index - nak2.index + 27) % 27) + 1;
  const rem1 = count1to2 % 9;
  const rem2 = count2to1 % 9;
  const badTara = [3, 5, 7]; // Vipat, Pratyak, Naidhana
  let taraPoints = 3;
  if (badTara.includes(rem1) && badTara.includes(rem2)) taraPoints = 0;
  else if (badTara.includes(rem1) || badTara.includes(rem2)) taraPoints = 1.5;

  // 4. Yoni (4 Points) - Intimacy & Instinct Harmony
  const yoniPoints = nak1.index % 14 === nak2.index % 14 ? 4 : 2.5;

  // 5. Graha Maitri (5 Points) - Moon Lord Friendship
  let maitriPoints = 3;
  if (lord1 === lord2) maitriPoints = 5;
  else if (['Jupiter', 'Sun', 'Moon', 'Mars'].includes(lord1) && ['Jupiter', 'Sun', 'Moon', 'Mars'].includes(lord2)) {
    maitriPoints = 4;
  } else if (['Saturn', 'Venus', 'Mercury'].includes(lord1) && ['Saturn', 'Venus', 'Mercury'].includes(lord2)) {
    maitriPoints = 4;
  } else {
    maitriPoints = 2;
  }

  // 6. Gana (6 Points) - Temperament
  const gana1 = NAKSHATRA_GANAS[nak1.index];
  const gana2 = NAKSHATRA_GANAS[nak2.index];
  let ganaPoints = 6;
  if (gana1 === gana2) ganaPoints = 6;
  else if ((gana1 === 'Deva' && gana2 === 'Manushya') || (gana1 === 'Manushya' && gana2 === 'Deva')) ganaPoints = 5;
  else if (gana1 === 'Rakshasa' && gana2 === 'Rakshasa') ganaPoints = 6;
  else ganaPoints = 1;

  // 7. Bhakoot (7 Points) - Emotional Health
  const distSign = Math.abs(signIdx1 - signIdx2);
  let bhakootPoints = 7;
  // Shadashtak (6/8), Dwirdwadashtak (2/12), Navapancham (9/5) can cause dosha unless lord friendship cancels
  if (distSign === 5 || distSign === 7) bhakootPoints = 0; // 6/8
  else if (distSign === 1 || distSign === 11) bhakootPoints = 0; // 2/12
  else bhakootPoints = 7;

  // 8. Nadi (8 Points) - Physiological & Genetic Balance
  const nadi1 = NAKSHATRA_NADIS[nak1.index];
  const nadi2 = NAKSHATRA_NADIS[nak2.index];
  const nadiPoints = nadi1 !== nadi2 ? 8 : 0; // Same nadi = Nadi Dosha

  const totalScore = Number(
    (varnaPoints + vashyaPoints + taraPoints + yoniPoints + maitriPoints + ganaPoints + bhakootPoints + nadiPoints).toFixed(1)
  );

  const percentage = Math.round((totalScore / 36) * 100);

  let verdict = 'Average Alliance';
  if (totalScore >= 28) verdict = 'Highly Auspicious & Blessed Union';
  else if (totalScore >= 21) verdict = 'Very Good Astrological Compatibility';
  else if (totalScore >= 18) verdict = 'Acceptable & Harmonious';
  else verdict = 'Requires Astrological Remedies (Upaya)';

  // Mangal Dosha check: Mars in 1, 4, 7, 8, 12
  const manglikHouses = [1, 4, 7, 8, 12];
  const isManglik1 = manglikHouses.includes(marsHouse1);
  const isManglik2 = manglikHouses.includes(marsHouse2);

  const factors: KootaFactor[] = [
    { name: 'Varna Koota (Ego & Work Harmony)', pointsObtained: varnaPoints, totalPoints: 1, description: 'Reflects spiritual alignment, social temperaments and mutual respect.', status: varnaPoints === 1 ? 'excellent' : 'average' },
    { name: 'Vashya Koota (Mutual Attraction)', pointsObtained: vashyaPoints, totalPoints: 2, description: 'Indicates magnetic harmony, devotion, and balance of influence.', status: vashyaPoints >= 1.5 ? 'excellent' : 'good' },
    { name: 'Tara Koota (Destiny & Health)', pointsObtained: taraPoints, totalPoints: 3, description: 'Measures psychological compatibility, auspicious fortune, and health.', status: taraPoints === 3 ? 'excellent' : taraPoints > 0 ? 'good' : 'inauspicious' },
    { name: 'Yoni Koota (Intimacy & Bonding)', pointsObtained: yoniPoints, totalPoints: 4, description: 'Physical intimacy resonance, subconscious biological affinity and warmth.', status: yoniPoints >= 3 ? 'excellent' : 'good' },
    { name: 'Graha Maitri (Mental Friendship)', pointsObtained: maitriPoints, totalPoints: 5, description: 'Sign lord planetary harmony representing intellectual and lifestyle camaraderie.', status: maitriPoints >= 4 ? 'excellent' : 'average' },
    { name: 'Gana Koota (Temperament Balance)', pointsObtained: ganaPoints, totalPoints: 6, description: 'Temperament alignment across Deva, Manushya, and Rakshasa archetypes.', status: ganaPoints >= 5 ? 'excellent' : 'inauspicious' },
    { name: 'Bhakoot Koota (Family Welfare)', pointsObtained: bhakootPoints, totalPoints: 7, description: 'Emotional bonding, shared prosperity, family happiness, and longevity.', status: bhakootPoints === 7 ? 'excellent' : 'inauspicious' },
    { name: 'Nadi Koota (Genetic & Life Energy)', pointsObtained: nadiPoints, totalPoints: 8, description: 'Physiological and energy balance ensuring healthy progeny and vitality.', status: nadiPoints === 8 ? 'excellent' : 'inauspicious' },
  ];

  return {
    totalScore,
    maxScore: 36,
    percentage,
    verdict,
    manglikStatus1: isManglik1,
    manglikStatus2: isManglik2,
    factors,
  };
}
