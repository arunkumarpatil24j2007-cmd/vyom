import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { createStarPointShaderMaterial } from './materials/StarMaterial';

interface StarFieldProps {
  count?: number;
}

export const StarField: React.FC<StarFieldProps> = ({ count = 180 }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const material = useMemo(() => createStarPointShaderMaterial(), []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.45) * 8.0;
      const y = (Math.random() - 0.45) * 6.0;
      const z = -1.2 - Math.random() * 2.0;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      sizes[i] = 0.8 + Math.random() * 1.4;
      phases[i] = Math.random();
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
    return geo;
  }, [count]);

  useFrame((state) => {
    if (material.uniforms.time) {
      material.uniforms.time.value = state.clock.getElapsedTime();
    }
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
};

export default StarField;
