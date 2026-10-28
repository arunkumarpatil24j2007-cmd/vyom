import * as THREE from 'three';

export function createCelestialRibbonShaderMaterial(options?: {
  rimColor?: string;
  bodyColor?: string;
  baseOpacity?: number;
}): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      rimColor: { value: new THREE.Color(options?.rimColor || '#FFCE6B') },
      bodyColor: { value: new THREE.Color(options?.bodyColor || '#2B488C') },
      highlightWhite: { value: new THREE.Color('#FFFFFF') },
      baseOpacity: { value: options?.baseOpacity ?? 0.62 },
      lightDir: { value: new THREE.Vector3(0.5, 0.7, 0.8).normalize() },
      sunPos: { value: new THREE.Vector3(0.18, 0.04, 0.4) },
    },
    side: THREE.DoubleSide,
    transparent: true,
    depthWrite: false,
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      varying vec3 vWorldPosition;
      varying vec2 vUv;

      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPos.xyz;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 rimColor;
      uniform vec3 bodyColor;
      uniform vec3 highlightWhite;
      uniform float baseOpacity;
      uniform vec3 lightDir;
      uniform vec3 sunPos;

      varying vec3 vNormal;
      varying vec3 vViewPosition;
      varying vec3 vWorldPosition;
      varying vec2 vUv;

      void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(vViewPosition);

        // Double-sided view dot
        float NdotV = abs(dot(normal, viewDir));

        // Glass Fresnel: higher at grazing angles
        float fresnel = pow(1.0 - NdotV, 2.0);

        // Edge contouring along the ribbon boundary
        float edgeDist = abs(vUv.x - 0.5) * 2.0; // 0 at center, 1 at edges
        float edgeRim = pow(edgeDist, 3.5);

        // Specular sheen along the curving crest
        vec3 halfDir = normalize(lightDir + viewDir);
        float spec = pow(max(abs(dot(normal, halfDir)), 0.0), 40.0);

        // Directional illumination from central Sun
        vec3 sunDir = normalize(sunPos - vWorldPosition);
        float sunDiff = max(abs(dot(normal, sunDir)), 0.0);

        // Color blending: translucent frosted crystal body + radiant golden edges + crisp white highlight
        vec3 col = mix(bodyColor, rimColor, edgeRim * 0.85 + fresnel * 0.45);
        col = mix(col, highlightWhite, spec * 0.95 + pow(fresnel, 4.0) * 0.5);

        // Opacity: high transparency in body (revealing stars/planets), radiant at edges
        float alpha = clamp(baseOpacity * (0.35 + edgeRim * 0.65 + fresnel * 0.45), 0.15, 0.92);

        gl_FragColor = vec4(col, alpha);
      }
    `,
  });
}
