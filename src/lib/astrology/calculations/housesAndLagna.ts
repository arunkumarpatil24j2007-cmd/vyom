import { deltaTSeconds, getJulianCentury } from './julianDate.ts';
import { calculateLahiriAyanamsha } from './lahiriAyanamsha.ts';
import { SIGNS, SIGN_LORDS, meanObliquity, nutation, type CalculatedPlanet } from './planetaryPositions.ts';
import { getNakshatraFromLongitude } from './nakshatras.ts';

export interface CalculatedHouse {
  house: number; // 1 to 12
  sign: string;
  signIndex: number; // 1 to 12
  degree: number;
  planets: string[];
  signLord: string;
}

export interface LagnaResult {
  sign: string;
  ascendantTropical: number;
  signIndex: number;
  degree: number;
  totalLongitude: number;
  nakshatra: string;
  pada: number;
  houses: CalculatedHouse[];
}

function degToRad(deg: number): number {
  return (deg * Math.PI) / 180.0;
}

function radToDeg(rad: number): number {
  return (rad * 180.0) / Math.PI;
}

function normalizeDeg(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

/**
 * Horizon angles per DOCUMENT_02 §2.3 & §4.1: GMST (Meeus Eq. 12.4) from JD(UT),
 * apparent sidereal time via the equation of the equinoxes, and atan2-based Ascendant/MC.
 * East longitude is positive.
 */
export function calculateHorizonAngles(jdUt: number, latitude: number, longitudeEast: number): {
  ramc: number;
  ascendantTropical: number;
  mcTropical: number;
} {
  const tUt = getJulianCentury(jdUt);
  const gmst = normalizeDeg(
    280.46061837 + 360.98564736629 * (jdUt - 2451545.0) + 0.000387933 * tUt * tUt - (tUt * tUt * tUt) / 38710000.0
  );
  const tTt = getJulianCentury(jdUt + deltaTSeconds(jdUt) / 86400);
  const { dPsi, dEps } = nutation(tTt);
  const eps = meanObliquity(tTt) + dEps;
  const ramc = normalizeDeg(gmst + dPsi * Math.cos(degToRad(eps)) + longitudeEast);

  const ramcRad = degToRad(ramc);
  const epsRad = degToRad(eps);
  const latRad = degToRad(latitude);
  const ascendantTropical = normalizeDeg(radToDeg(Math.atan2(
    Math.cos(ramcRad),
    -Math.sin(ramcRad) * Math.cos(epsRad) - Math.tan(latRad) * Math.sin(epsRad)
  )));
  const mcTropical = normalizeDeg(radToDeg(Math.atan2(Math.sin(ramcRad), Math.cos(ramcRad) * Math.cos(epsRad))));
  return { ramc, ascendantTropical, mcTropical };
}

/**
 * Calculates True Ascendant (Lagna) and 12 Bhavas (Houses)
 */
export function calculateLagnaAndHouses(
  jd: number,
  latitude: number,
  longitude: number,
  planets: CalculatedPlanet[]
): LagnaResult {
  const ayanamsha = calculateLahiriAyanamsha(jd);
  const { ascendantTropical: ascTropical } = calculateHorizonAngles(jd, latitude, longitude);

  // Sidereal Ascendant (Lagna)
  const ascSidereal = normalizeDeg(ascTropical - ayanamsha);
  const lagnaSignIndex = Math.floor(ascSidereal / 30) + 1; // 1 to 12
  const lagnaSign = SIGNS[lagnaSignIndex - 1];
  const lagnaDeg = ascSidereal - (lagnaSignIndex - 1) * 30;
  const lagnaNak = getNakshatraFromLongitude(ascSidereal);

  // Generate 12 Bhavas (Vedic Equal Sign/Bhava System)
  const houses: CalculatedHouse[] = [];

  for (let h = 1; h <= 12; h++) {
    // House 1 starts at Lagna sign, House 2 is next sign, etc.
    const hSignIndex = ((lagnaSignIndex - 1 + (h - 1)) % 12) + 1;
    const hSign = SIGNS[hSignIndex - 1];
    const hLord = SIGN_LORDS[hSign];

    // Find planets located in this house's sign
    const planetsInHouse = planets
      .filter((p) => p.signIndex === hSignIndex)
      .map((p) => p.planet);

    houses.push({
      house: h,
      sign: hSign,
      signIndex: hSignIndex,
      degree: Number(lagnaDeg.toFixed(2)),
      planets: planetsInHouse,
      signLord: hLord,
    });
  }

  // Update planets with their house numbers and lordships
  planets.forEach((p) => {
    // House number is difference from Lagna sign
    const houseNum = ((p.signIndex - lagnaSignIndex + 12) % 12) + 1;
    p.house = houseNum;

    // Houses ruled by this planet
    p.lordOf = houses
      .filter((h) => h.signLord === p.planet)
      .map((h) => h.house);
  });

  return {
    sign: lagnaSign,
    signIndex: lagnaSignIndex,
    degree: Number(lagnaDeg.toFixed(2)),
    totalLongitude: ascSidereal,
    ascendantTropical: ascTropical,
    nakshatra: lagnaNak.name,
    pada: lagnaNak.pada,
    houses,
  };
}
