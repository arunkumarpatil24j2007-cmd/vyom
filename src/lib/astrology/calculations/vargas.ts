import { SIGNS } from './planetaryPositions.ts';

/**
 * Parashari divisional-chart sign mapping (BPHS Ch. 6; DOCUMENT_03 §6). Returns a 0-based sign
 * index (0 = Aries). Only the vargas Vyom interprets are implemented.
 */
function parts(longitude: number) {
  const lon = ((longitude % 360) + 360) % 360;
  return { lon, s: Math.floor(lon / 30), x: lon % 30 };
}

/** D9 Navamsha: continuous mapping, 3°20' segments. */
export function navamshaSignIndex(longitude: number): number {
  return Math.floor(parts(longitude).lon / (10 / 3)) % 12;
}

/** D10 Dashamsha: odd signs start from the sign itself, even signs from the 9th. */
export function dashamshaSignIndex(longitude: number): number {
  const { s, x } = parts(longitude);
  const k = Math.floor(x / 3);
  return s % 2 === 0 ? (s + k) % 12 : (s + 8 + k) % 12;
}

/** D2 Hora (Parashari): odd signs Sun-then-Moon, even signs Moon-then-Sun. */
export function horaSignIndex(longitude: number): number {
  const { s, x } = parts(longitude);
  const firstHalf = x < 15;
  return s % 2 === 0 ? (firstHalf ? 4 : 3) : (firstHalf ? 3 : 4);
}

/** D3 Drekkana: 1st = same sign, 2nd = 5th, 3rd = 9th. */
export function drekkanaSignIndex(longitude: number): number {
  const { s, x } = parts(longitude);
  return (s + 4 * Math.floor(x / 10)) % 12;
}

/** D30 Trimshamsha (unequal Parashari segments). */
export function trimshamshaSignIndex(longitude: number): number {
  const { s, x } = parts(longitude);
  if (s % 2 === 0) return x < 5 ? 0 : x < 10 ? 10 : x < 18 ? 8 : x < 25 ? 2 : 6;
  return x < 5 ? 1 : x < 12 ? 5 : x < 20 ? 11 : x < 25 ? 9 : 7;
}

export function signName(index0: number): string {
  return SIGNS[((index0 % 12) + 12) % 12];
}
