import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { createPlanetSphereGeometry } from './geometry/createPlanetGeometry';
import { createSunShaderMaterial } from './materials/PlanetMaterial';
import ZodiacWheel from './ZodiacWheel';
import { cosmicObjects } from './config/cosmicObjects';

interface ZodiacCoreProps {
  position?: [number, number, number];
  radius?: number;
  rotationSpeed?: number;
}

export const ZodiacCore: React.FC<ZodiacCoreProps> = ({
  position = cosmicObjects.centralZodiac.position,
  radius = cosmicObjects.centralZodiac.radius,
  rotationSpeed = cosmicObjects.centralZodiac.rotationSpeed,
}) => {
  const sunMaterial = useMemo(() => createSunShaderMaterial(), []);
  const sphereGeo = useMemo(() => createPlanetSphereGeometry(radius, 64), [radius]);
  const coreGroupRef = useRef<THREE.Group>(null);

  // Animate the solar granulation uniform subtly
  useFrame((state) => {
    if (sunMaterial.uniforms.time) {
      sunMaterial.uniforms.time.value = state.clock.getElapsedTime();
    }
  });

  return (
    <group ref={coreGroupRef} position={position} name="zodiac-core-surya">
      {/* 3D Golden-Orange Base Celestial Sphere */}
      <mesh geometry={sphereGeo} material={sunMaterial} />

      {/* Embedded Zodiac Wheel Assembly placed on the front face (Z offset just touching the sphere crown) */}
      <group position={[0, 0, radius * 0.96]}>
        <ZodiacWheel radius={radius * 0.94} rotationSpeed={rotationSpeed} />
      </group>

      {/* Warm golden solar point light radiating outward */}
      <pointLight
        color="#FFAE35"
        intensity={2.8}
        distance={8}
        decay={2}
        position={[0, 0, radius * 0.5]}
      />
    </group>
  );
};

export default ZodiacCore;
