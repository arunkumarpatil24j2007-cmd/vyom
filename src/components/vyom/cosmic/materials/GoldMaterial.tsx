import * as THREE from 'three';

export function createGoldMaterial(options?: {
  roughness?: number;
  metalness?: number;
  emissiveIntensity?: number;
  color?: string;
}): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(options?.color || '#FFD066'),
    metalness: options?.metalness ?? 0.82,
    roughness: options?.roughness ?? 0.24,
    emissive: new THREE.Color('#4A2B05'),
    emissiveIntensity: options?.emissiveIntensity ?? 0.35,
    side: THREE.DoubleSide,
  });
}

export function createGoldStarMaterial(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    vertexColors: true, // Enables the dual-tone facet coloring
    metalness: 0.88,
    roughness: 0.16,
    emissive: new THREE.Color('#553408'),
    emissiveIntensity: 0.4,
    flatShading: true,
    side: THREE.DoubleSide,
  });
}
