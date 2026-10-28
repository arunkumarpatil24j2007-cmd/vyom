import * as THREE from 'three';

export function createStarPointShaderMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      starColor: { value: new THREE.Color('#FFF8EB') },
      starGold: { value: new THREE.Color('#FFD685') },
    },
    transparent: true,
    depthWrite: false,
    vertexShader: `
      attribute float aSize;
      attribute float aPhase;
      varying float vPhase;

      void main() {
        vPhase = aPhase;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        // Scale to small, subtle pinpricks (2px to 5px)
        float size = aSize * (22.0 / -mvPosition.z);
        gl_PointSize = clamp(size, 1.5, 5.5);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec3 starColor;
      uniform vec3 starGold;
      varying float vPhase;

      void main() {
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);
        if (dist > 0.5) discard;

        // Gaussian glow with crisp core
        float intensity = exp(-dist * dist * 16.0);

        // Gentle, slow twinkling
        float twinkle = 0.7 + 0.3 * sin(time * 1.8 + vPhase * 6.28);
        vec3 col = mix(starColor, starGold, sin(vPhase * 3.14) * 0.5 + 0.5);

        gl_FragColor = vec4(col, intensity * twinkle);
      }
    `,
  });
}
