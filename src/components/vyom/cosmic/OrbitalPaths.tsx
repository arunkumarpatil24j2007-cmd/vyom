import React, { useMemo } from 'react';
import * as THREE from 'three';
import { createOrbitalTubeGeometry } from './geometry/createOrbitalPath';
import { createGoldMaterial } from './materials/GoldMaterial';
import { cosmicObjects } from './config/cosmicObjects';

export const OrbitalPaths: React.FC = () => {
  const rings = cosmicObjects.orbitalRings;
  const goldMat = useMemo(
    () =>
      createGoldMaterial({
        color: '#FFD066',
        roughness: 0.22,
        metalness: 0.88,
        emissiveIntensity: 0.4,
      }),
    []
  );

  // Orbital ring tubes
  const ringMeshes = useMemo(() => {
    return rings.map((ring) => {
      const geo = createOrbitalTubeGeometry(
        ring.radiusX,
        ring.radiusY,
        ring.tubeRadius,
        ring.center,
        ring.rotation,
        140,
        8
      );
      return { id: ring.id, geometry: geo };
    });
  }, [rings]);

  // Radial connector spokes from zodiac wheel to orbits (as seen in Reference B)
  const spokeMeshes = useMemo(() => {
    // Spoke 1: 12 o'clock spoke to top orbit ring
    const curve1 = new THREE.LineCurve3(
      new THREE.Vector3(0.18, 1.22, 0.02),
      new THREE.Vector3(0.18, 1.78, 0.05)
    );
    const geo1 = new THREE.TubeGeometry(curve1, 20, 0.006, 8, false);

    // Spoke 2: 1:30 o'clock spoke towards Saturn orbit
    const curve2 = new THREE.LineCurve3(
      new THREE.Vector3(0.98, 0.82, 0.02),
      new THREE.Vector3(1.72, 1.25, -0.05)
    );
    const geo2 = new THREE.TubeGeometry(curve2, 20, 0.005, 8, false);

    // Spoke 3: 5 o'clock spoke towards Mars orbit
    const curve3 = new THREE.LineCurve3(
      new THREE.Vector3(1.05, -0.58, 0.02),
      new THREE.Vector3(1.82, -0.78, 0.05)
    );
    const geo3 = new THREE.TubeGeometry(curve3, 20, 0.005, 8, false);

    return [
      { id: 'spoke-1', geo: geo1 },
      { id: 'spoke-2', geo: geo2 },
      { id: 'spoke-3', geo: geo3 },
    ];
  }, []);

  return (
    <group name="orbital-paths-group">
      {/* 3D Gold Orbit Ring Tubes */}
      {ringMeshes.map((r) => (
        <mesh key={r.id} geometry={r.geometry} material={goldMat} />
      ))}

      {/* 3D Gold Connector Spokes */}
      {spokeMeshes.map((s) => (
        <mesh key={s.id} geometry={s.geo} material={goldMat} />
      ))}
    </group>
  );
};

export default OrbitalPaths;
