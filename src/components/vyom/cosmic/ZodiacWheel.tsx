import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import {
  createZodiacCircleGeometry,
  createRadialDivisionsGeometry,
  createZodiacTicksGeometry,
  createFacetedStarGeometry,
} from './geometry/createZodiacGeometry';
import { createGoldMaterial, createGoldStarMaterial } from './materials/GoldMaterial';
import ZodiacGlyphs from './ZodiacGlyphs';

interface ZodiacWheelProps {
  rotationSpeed?: number;
  radius?: number;
}

export const ZodiacWheel: React.FC<ZodiacWheelProps> = ({
  rotationSpeed = 0.012,
  radius = 1.18,
}) => {
  const wheelGroupRef = useRef<THREE.Group>(null);

  // Materials
  const goldMat = useMemo(() => createGoldMaterial({ roughness: 0.22, metalness: 0.85 }), []);
  const starMat = useMemo(() => createGoldStarMaterial(), []);

  // Concentric circle rings
  const outerRingGeo = useMemo(() => createZodiacCircleGeometry(radius * 0.97, radius, 128), [radius]);
  const middleRingGeo = useMemo(() => createZodiacCircleGeometry(radius * 0.85, radius * 0.87, 128), [radius]);
  const innerTrackRingGeo = useMemo(() => createZodiacCircleGeometry(radius * 0.47, radius * 0.49, 128), [radius]);
  const hubRingGeo = useMemo(() => createZodiacCircleGeometry(radius * 0.12, radius * 0.14, 96), [radius]);

  // Radial dividers & ticks
  const radialDividersGeo = useMemo(
    () => createRadialDivisionsGeometry(radius * 0.48, radius * 0.98, 0.007),
    [radius]
  );
  const ticksGeo = useMemo(
    () => createZodiacTicksGeometry(radius * 0.98, 0.035, 72, 0.005),
    [radius]
  );

  // 8-pointed faceted golden celestial star
  const starGeo = useMemo(
    () => createFacetedStarGeometry(radius * 0.44, radius * 0.26, 0.06),
    [radius]
  );

  // Rotate smoothly on every frame using elapsed delta time
  useFrame((_, delta) => {
    if (wheelGroupRef.current) {
      wheelGroupRef.current.rotation.z += rotationSpeed * delta;
    }
  });

  return (
    <group ref={wheelGroupRef} name="zodiac-rotating-wheel">
      {/* Outer concentric ring */}
      <mesh geometry={outerRingGeo} material={goldMat} position={[0, 0, 0.005]} />

      {/* Outer fine tick marks */}
      <mesh geometry={ticksGeo} material={goldMat} position={[0, 0, 0.006]} />

      {/* Middle ring bounding the glyphs */}
      <mesh geometry={middleRingGeo} material={goldMat} position={[0, 0, 0.006]} />

      {/* 12 Radial dividers separating the 12 signs */}
      <mesh geometry={radialDividersGeo} material={goldMat} position={[0, 0, 0.007]} />

      {/* 12 Authentic Astrological Glyphs in Pure Gold */}
      <ZodiacGlyphs radius={radius * 0.68} glyphSize={radius * 0.22} />

      {/* Inner track ring enclosing the star */}
      <mesh geometry={innerTrackRingGeo} material={goldMat} position={[0, 0, 0.008]} />

      {/* Central hub ring */}
      <mesh geometry={hubRingGeo} material={goldMat} position={[0, 0, 0.009]} />

      {/* Central 8-Pointed Faceted Star */}
      <mesh geometry={starGeo} material={starMat} position={[0, 0, 0.015]} />

      {/* Small golden center point */}
      <mesh position={[0, 0, 0.075]}>
        <sphereGeometry args={[radius * 0.045, 24, 24]} />
        <meshStandardMaterial
          color="#FFF0B5"
          metalness={0.9}
          roughness={0.15}
          emissive="#7A4808"
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
};

export default ZodiacWheel;
