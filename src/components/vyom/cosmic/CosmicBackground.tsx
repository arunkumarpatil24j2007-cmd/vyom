import React, { useMemo } from 'react';
import * as THREE from 'three';

export const CosmicBackground: React.FC = () => {
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        colorCenter: { value: new THREE.Color('#14234C') },
        colorMid: { value: new THREE.Color('#0A1434') },
        colorEdge: { value: new THREE.Color('#040818') },
      },
      depthWrite: false,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 colorCenter;
        uniform vec3 colorMid;
        uniform vec3 colorEdge;
        varying vec2 vUv;

        void main() {
          // Off-center radial glow towards upper-right where Sun and Saturn reside
          vec2 center = vec2(0.56, 0.52);
          float dist = distance(vUv, center);

          vec3 col = mix(colorCenter, colorMid, smoothstep(0.0, 0.45, dist));
          col = mix(col, colorEdge, smoothstep(0.45, 0.85, dist));

          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });
  }, []);

  return (
    <mesh position={[0, 0, -3.5]} renderOrder={0}>
      <planeGeometry args={[18, 14]} />
      <primitive object={shaderMaterial} attach="material" />
    </mesh>
  );
};

export default CosmicBackground;
