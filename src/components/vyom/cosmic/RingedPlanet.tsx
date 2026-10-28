import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { createPlanetSphereGeometry, createSaturnRingGeometry } from './geometry/createPlanetGeometry';
import { createSaturnBodyShaderMaterial, createSaturnRingShaderMaterial } from './materials/PlanetMaterial';
import { cosmicObjects } from './config/cosmicObjects';

interface RingedPlanetProps {
  position?: [number, number, number];
  radius?: number;
  ringInner?: number;
  ringOuter?: number;
  tilt?: [number, number, number];
  rotationSpeed?: number;
}

export const RingedPlanet: React.FC<RingedPlanetProps> = ({
  position = cosmicObjects.ringedPlanet.position,
  radius = cosmicObjects.ringedPlanet.radius,
  ringInner = cosmicObjects.ringedPlanet.ringInner,
  ringOuter = cosmicObjects.ringedPlanet.ringOuter,
  tilt = cosmicObjects.ringedPlanet.tilt,
  rotationSpeed = cosmicObjects.ringedPlanet.rotationSpeed,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const planetRef = useRef<THREE.Mesh>(null);

  const sphereGeo = useMemo(() => createPlanetSphereGeometry(radius, 64), [radius]);

  // Split ring into back half and front half relative to the tilted perspective
  // In the tilted coordinate frame (rotation.x = Math.PI / 2):
  // The rear half (upper / negative Z) is from -PI/2 to +PI/2
  // The front half (lower / positive Z) is from +PI/2 to +3PI/2
  const backRingGeo = useMemo(
    () => createSaturnRingGeometry(ringInner, ringOuter, 0, Math.PI, 96),
    [ringInner, ringOuter]
  );
  const frontRingGeo = useMemo(
    () => createSaturnRingGeometry(ringInner, ringOuter, Math.PI, Math.PI, 96),
    [ringInner, ringOuter]
  );

  const bodyMat = useMemo(() => createSaturnBodyShaderMaterial(), []);
  const ringMat = useMemo(() => createSaturnRingShaderMaterial(), []);

  useFrame((_, delta) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += rotationSpeed * delta;
    }
  });

  return (
    <group ref={groupRef} position={position} name="ringed-planet-saturn">
      <group rotation={tilt}>
        {/* 1. Back Ring Half (Passes strictly behind the spherical body) */}
        <mesh
          geometry={backRingGeo}
          material={ringMat}
          rotation={[Math.PI / 2, 0, 0]}
          renderOrder={0}
        />

        {/* 2. Saturn Spherical Body */}
        <mesh
          ref={planetRef}
          geometry={sphereGeo}
          material={bodyMat}
          renderOrder={1}
        />

        {/* 3. Front Ring Half (Passes strictly in front of the spherical body) */}
        <mesh
          geometry={frontRingGeo}
          material={ringMat}
          rotation={[Math.PI / 2, 0, 0]}
          renderOrder={2}
        />
      </group>
    </group>
  );
};

export default RingedPlanet;
