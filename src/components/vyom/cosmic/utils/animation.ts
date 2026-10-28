export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}

export function damp(current: number, target: number, lambda: number, delta: number): number {
  return lerp(current, target, 1 - Math.exp(-lambda * delta));
}
