import * as THREE from 'three';
import { create3DEllipseCurve } from '../utils/coordinates';

/**
 * Creates a 3D tube geometry following an elliptical orbit path
 */
export function createOrbitalTubeGeometry(
  radiusX: number,
  radiusY: number,
  tubeRadius: number = 0.007,
  center: [number, number, number] = [0, 0, 0],
  rotation: [number, number, number] = [0, 0, 0],
  tubularSegments: number = 160,
  radialSegments: number = 8
): THREE.TubeGeometry {
  const points = create3DEllipseCurve(radiusX, radiusY, center, rotation, tubularSegments);
  const curve = new THREE.CatmullRomCurve3(points, true);
  return new THREE.TubeGeometry(curve, tubularSegments, tubeRadius, radialSegments, true);
}
