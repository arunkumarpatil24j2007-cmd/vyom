import * as THREE from 'three';

/**
 * Creates an ellipse curve in 3D space with tilt rotations
 */
export function create3DEllipseCurve(
  radiusX: number,
  radiusY: number,
  center: [number, number, number] = [0, 0, 0],
  rotation: [number, number, number] = [0, 0, 0],
  segments: number = 128
): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  const euler = new THREE.Euler(rotation[0], rotation[1], rotation[2]);

  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    const x = Math.cos(theta) * radiusX;
    const y = Math.sin(theta) * radiusY;
    const z = 0;

    const v = new THREE.Vector3(x, y, z).applyEuler(euler);
    v.x += center[0];
    v.y += center[1];
    v.z += center[2];

    points.push(v);
  }

  return points;
}

/**
 * Calculates 12 zodiac angles evenly spaced around the circle
 */
export function getZodiacSectorAngles(): { index: number; angle: number; glyphAngle: number }[] {
  const sectors = [];
  const step = (Math.PI * 2) / 12;

  for (let i = 0; i < 12; i++) {
    const angle = i * step;
    const glyphAngle = angle + step / 2;
    sectors.push({ index: i, angle, glyphAngle });
  }

  return sectors;
}
