import * as THREE from 'three';

export function createPlanetSphereGeometry(radius: number, segments: number = 64): THREE.SphereGeometry {
  return new THREE.SphereGeometry(radius, segments, segments);
}

export function createSaturnRingGeometry(
  innerRadius: number,
  outerRadius: number,
  thetaStart: number = 0,
  thetaLength: number = Math.PI * 2,
  thetaSegments: number = 128
): THREE.RingGeometry {
  const geometry = new THREE.RingGeometry(innerRadius, outerRadius, thetaSegments, 8, thetaStart, thetaLength);
  
  // Custom UV mapping for annular ring: U is normalized radius, V is angle
  const pos = geometry.attributes.position;
  const uvs = geometry.attributes.uv;
  const count = pos.count;

  for (let i = 0; i < count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const r = Math.sqrt(x * x + y * y);
    const normalizedR = (r - innerRadius) / (outerRadius - innerRadius);
    const angle = Math.atan2(y, x);
    const normalizedAngle = (angle + Math.PI) / (Math.PI * 2);

    uvs.setXY(i, Math.max(0, Math.min(1, normalizedR)), normalizedAngle);
  }
  uvs.needsUpdate = true;

  return geometry;
}
