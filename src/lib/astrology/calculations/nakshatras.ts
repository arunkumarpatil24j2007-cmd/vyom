export interface NakshatraInfo {
  index: number; // 0 to 26
  name: string;
  lord: string;
  pada: number; // 1 to 4
  degreesInNakshatra: number;
  totalFraction: number; // 0 to 1
}

export const NAKSHATRAS = [
  { name: 'Ashwini', lord: 'Ketu' },
  { name: 'Bharani', lord: 'Venus' },
  { name: 'Krittika', lord: 'Sun' },
  { name: 'Rohini', lord: 'Moon' },
  { name: 'Mrigashira', lord: 'Mars' },
  { name: 'Ardra', lord: 'Rahu' },
  { name: 'Punarvasu', lord: 'Jupiter' },
  { name: 'Pushya', lord: 'Saturn' },
  { name: 'Ashlesha', lord: 'Mercury' },
  { name: 'Magha', lord: 'Ketu' },
  { name: 'Purva Phalguni', lord: 'Venus' },
  { name: 'Uttara Phalguni', lord: 'Sun' },
  { name: 'Hasta', lord: 'Moon' },
  { name: 'Chitra', lord: 'Mars' },
  { name: 'Swati', lord: 'Rahu' },
  { name: 'Vishakha', lord: 'Jupiter' },
  { name: 'Anuradha', lord: 'Saturn' },
  { name: 'Jyeshtha', lord: 'Mercury' },
  { name: 'Mula', lord: 'Ketu' },
  { name: 'Purva Ashadha', lord: 'Venus' },
  { name: 'Uttara Ashadha', lord: 'Sun' },
  { name: 'Shravana', lord: 'Moon' },
  { name: 'Dhanishta', lord: 'Mars' },
  { name: 'Shatabhisha', lord: 'Rahu' },
  { name: 'Purva Bhadrapada', lord: 'Jupiter' },
  { name: 'Uttara Bhadrapada', lord: 'Saturn' },
  { name: 'Revati', lord: 'Mercury' },
];

const NAKSHATRA_SPAN = 360 / 27; // 13.3333333333 degrees = 13° 20'
const PADA_SPAN = NAKSHATRA_SPAN / 4; // 3.3333333333 degrees = 3° 20'

/**
 * Calculates Nakshatra, Lord, and Pada for a given sidereal longitude (0 - 360 degrees)
 */
export function getNakshatraFromLongitude(longitude: number): NakshatraInfo {
  // Normalize to 0 - 360
  const norm = ((longitude % 360) + 360) % 360;

  // A tiny epsilon keeps exact boundaries (e.g. 13°20' = 40/3) from falling into the previous
  // Nakshatra through floating-point division error (DOCUMENT_08 TC-13).
  const rawIndex = norm / NAKSHATRA_SPAN + 1e-12;
  const index = Math.min(26, Math.floor(rawIndex));
  const degInNakshatra = Math.max(0, norm - index * NAKSHATRA_SPAN);
  const pada = Math.min(4, Math.floor(degInNakshatra / PADA_SPAN + 1e-12) + 1);
  const totalFraction = degInNakshatra / NAKSHATRA_SPAN;

  const nak = NAKSHATRAS[index];

  return {
    index,
    name: nak.name,
    lord: nak.lord,
    pada,
    degreesInNakshatra: degInNakshatra,
    totalFraction,
  };
}
