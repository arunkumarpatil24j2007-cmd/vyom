import * as THREE from 'three';

export function createPhysicalGlassMaterial(options?: {
  roughness?: number;
  transmission?: number;
  ior?: number;
  thickness?: number;
  color?: string;
}): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(options?.color || '#D8E5FF'),
    transmission: options?.transmission ?? 0.88,
    opacity: 1,
    transparent: true,
    roughness: options?.roughness ?? 0.12,
    ior: options?.ior ?? 1.48,
    thickness: options?.thickness ?? 0.35,
    specularIntensity: 0.95,
    specularColor: new THREE.Color('#FFFFFF'),
    side: THREE.DoubleSide,
    depthWrite: false,
  });
}
