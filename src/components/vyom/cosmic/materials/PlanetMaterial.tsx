import * as THREE from 'three';

// ── 1. Golden Solar Core (Surya) Material ──
export function createSunShaderMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      colorBright: { value: new THREE.Color('#FFE28A') },
      colorMid: { value: new THREE.Color('#FFAA20') },
      colorDeep: { value: new THREE.Color('#FF4E12') },
      colorShadow: { value: new THREE.Color('#8E2200') },
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vViewPosition;

      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 colorBright;
      uniform vec3 colorMid;
      uniform vec3 colorDeep;
      uniform vec3 colorShadow;

      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vViewPosition;

      void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(vViewPosition);

        // Directional key light from upper-left
        vec3 lightDir = normalize(vec3(0.5, 0.7, 0.8));
        float diff = max(dot(normal, lightDir), 0.0);

        // Soft limb darkening / Fresnel rim
        float fresnel = 1.0 - max(dot(normal, viewDir), 0.0);
        float rim = pow(fresnel, 2.0);

        // Smooth solar gradient
        vec3 col = mix(colorDeep, colorMid, smoothstep(0.0, 0.75, diff));
        col = mix(col, colorBright, pow(diff, 2.0) * 0.9);
        col = mix(col, colorShadow, clamp(-normal.y * 0.4 + (1.0 - diff) * 0.4, 0.0, 1.0));

        // Warm golden specular glow
        vec3 halfDir = normalize(lightDir + viewDir);
        float spec = pow(max(dot(normal, halfDir), 0.0), 28.0);
        col += colorBright * spec * 0.55 + colorMid * rim * 0.35;

        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });
}

// ── 2. Blue Planet (Oceanic Neptune / Chandra) Material ──
export function createBluePlanetShaderMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      deepNavy: { value: new THREE.Color('#0A2266') },
      midBlue: { value: new THREE.Color('#1E5AE6') },
      cyanLight: { value: new THREE.Color('#42ACFF') },
      cloudWhite: { value: new THREE.Color('#C4E8FF') },
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vViewPosition;

      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 deepNavy;
      uniform vec3 midBlue;
      uniform vec3 cyanLight;
      uniform vec3 cloudWhite;

      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vViewPosition;

      void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(vViewPosition);

        // Smooth horizontal atmospheric cloud bands along Y
        float lat = vPosition.y * 6.0;
        float wave1 = sin(lat * 3.0) * 0.5 + sin(lat * 6.5) * 0.25;
        float wave2 = sin(lat * 12.0 + vPosition.x * 2.5) * 0.2;

        float band = wave1 + wave2;

        // Key light from central sun (upper-right)
        vec3 lightDir = normalize(vec3(0.5, 0.7, 0.8));
        float diff = max(dot(normal, lightDir), 0.0);

        // Fresnel atmospheric halo
        float fresnel = 1.0 - max(dot(normal, viewDir), 0.0);
        float atmRim = pow(fresnel, 2.5) * 0.8;

        // Smooth atmospheric color mixing
        vec3 col = mix(deepNavy, midBlue, smoothstep(-0.6, 0.5, band));
        col = mix(col, cyanLight, smoothstep(0.1, 0.7, band));
        col = mix(col, cloudWhite, smoothstep(0.55, 0.9, band) * 0.65);

        // Illumination
        vec3 finalCol = col * (diff * 0.82 + 0.18) + cyanLight * atmRim;

        // Silky specular highlight
        vec3 halfDir = normalize(lightDir + viewDir);
        float spec = pow(max(dot(normal, halfDir), 0.0), 32.0);
        finalCol += cloudWhite * spec * 0.6;

        gl_FragColor = vec4(finalCol, 1.0);
      }
    `,
  });
}

// ── 3. Red Planet (Mars / Mangala) Material ──
export function createRedPlanetShaderMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      rustDeep: { value: new THREE.Color('#781406') },
      orangeMid: { value: new THREE.Color('#D83C14') },
      orangeWarm: { value: new THREE.Color('#FF6822') },
      highlight: { value: new THREE.Color('#FFB05C') },
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vViewPosition;

      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 rustDeep;
      uniform vec3 orangeMid;
      uniform vec3 orangeWarm;
      uniform vec3 highlight;

      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vViewPosition;

      void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(vViewPosition);

        // Light direction from central Sun (upper-left)
        vec3 lightDir = normalize(vec3(-0.6, 0.6, 0.8));
        float diff = max(dot(normal, lightDir), 0.0);

        // Gentle Martian atmospheric bands & terrain shading
        float band = sin(vPosition.y * 7.0) * 0.4 + sin(vPosition.y * 14.0 + vPosition.x * 2.0) * 0.2;

        vec3 col = mix(rustDeep, orangeMid, smoothstep(-0.5, 0.4, band));
        col = mix(col, orangeWarm, diff * 0.85);

        // Soft specular and warm limb glow
        float fresnel = 1.0 - max(dot(normal, viewDir), 0.0);
        col += highlight * pow(fresnel, 2.5) * 0.45;

        vec3 halfDir = normalize(lightDir + viewDir);
        float spec = pow(max(dot(normal, halfDir), 0.0), 24.0);
        col += highlight * spec * 0.4;

        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });
}

// ── 4. Saturn Body Material ──
export function createSaturnBodyShaderMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      caramel: { value: new THREE.Color('#D69E64') },
      bandDark: { value: new THREE.Color('#825224') },
      bandLight: { value: new THREE.Color('#F6DAB0') },
      specularTint: { value: new THREE.Color('#FFF0D4') },
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vViewPosition;

      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 caramel;
      uniform vec3 bandDark;
      uniform vec3 bandLight;
      uniform vec3 specularTint;

      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vViewPosition;

      void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(vViewPosition);

        // Saturn horizontal atmospheric bands along Y
        float bandCoord = vPosition.y * 10.0;
        float band = sin(bandCoord) * 0.5 + sin(bandCoord * 2.2) * 0.25;

        vec3 col = mix(bandDark, caramel, smoothstep(-0.6, 0.4, band));
        col = mix(col, bandLight, smoothstep(0.2, 0.8, band) * 0.65);

        // Light direction from central Sun
        vec3 lightDir = normalize(vec3(-0.7, -0.4, 0.7));
        float diff = max(dot(normal, lightDir), 0.0);

        vec3 halfDir = normalize(lightDir + viewDir);
        float spec = pow(max(dot(normal, halfDir), 0.0), 32.0);

        vec3 finalCol = col * (diff * 0.85 + 0.15) + specularTint * spec * 0.5;

        gl_FragColor = vec4(finalCol, 1.0);
      }
    `,
  });
}

// ── 5. Saturn Rings Annular Shader Material ──
export function createSaturnRingShaderMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      colorInner: { value: new THREE.Color('#8A5E30') },
      colorMidBright: { value: new THREE.Color('#F4DBB2') },
      colorOuter: { value: new THREE.Color('#B2844E') },
      lightDir: { value: new THREE.Vector3(-0.7, -0.4, 0.7).normalize() },
    },
    side: THREE.DoubleSide,
    transparent: true,
    depthWrite: false,
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vViewPosition;

      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 colorInner;
      uniform vec3 colorMidBright;
      uniform vec3 colorOuter;
      uniform vec3 lightDir;

      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vViewPosition;

      void main() {
        float r = vUv.x;

        float alpha = 0.0;
        vec3 col = colorInner;

        if (r < 0.2) {
          alpha = smoothstep(0.0, 0.08, r) * 0.45;
          col = mix(colorInner, colorMidBright, r / 0.2);
        } else if (r < 0.65) {
          // B Ring
          alpha = 0.88;
          col = mix(colorInner, colorMidBright, (r - 0.2) / 0.45);
        } else if (r < 0.71) {
          // Cassini Division
          alpha = 0.1;
          col = colorInner * 0.35;
        } else if (r < 0.96) {
          // A Ring
          alpha = 0.72;
          col = mix(colorMidBright, colorOuter, (r - 0.71) / 0.25);
        } else {
          alpha = (1.0 - smoothstep(0.96, 1.0, r)) * 0.55;
          col = colorOuter;
        }

        vec3 normal = normalize(vNormal);
        float diff = abs(dot(normal, lightDir)) * 0.65 + 0.35;
        col *= diff;

        gl_FragColor = vec4(col, alpha);
      }
    `,
  });
}
