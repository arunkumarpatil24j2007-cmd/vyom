import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { createPlanetSphereGeometry } from './geometry/createPlanetGeometry';
import {
  createBluePlanetShaderMaterial,
  createRedPlanetShaderMaterial,
} from './materials/PlanetMaterial';
import { createGoldMaterial } from './materials/GoldMaterial';

export type PlanetType = 'blue' | 'red' | 'gold' | 'neutral';

interface PlanetProps {
  type: PlanetType;
  position: [number, number, number];
  radius: number;
  rotationSpeed?: number;
  name?: string;
}

export const Planet: React.FC<PlanetProps> = ({
  type,
  position,
  radius,
  rotationSpeed = 0.015,
  name,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const sphereGeo = useMemo(() => createPlanetSphereGeometry(radius, 48), [radius]);

  const material = useMemo(() => {
    switch (type) {
      case 'blue':
        return createBluePlanetShaderMaterial();
      case 'red':
        return createRedPlanetShaderMaterial();
      case 'gold':
        return createGoldMaterial({
          roughness: 0.28,
          metalness: 0.82,
          emissiveIntensity: 0.25,
          color: '#FFB838',
        });
      case 'neutral':
        return new THREE.MeshStandardMaterial({
          color: new THREE.Color('#C9B7A0'),
          roughness: 0.45,
          metalness: 0.2,
          emissive: new THREE.Color('#1F1810'),
          emissiveIntensity: 0.2,
        });
      default:
        return new THREE.MeshStandardMaterial({ color: '#FFB838' });
    }
  }, [type]);

  // Subtle planetary axial rotation
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed * delta;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      geometry={sphereGeo}
      material={material}
      name={name || `planet-${type}`}
    />
  );
};

export default Planet;
