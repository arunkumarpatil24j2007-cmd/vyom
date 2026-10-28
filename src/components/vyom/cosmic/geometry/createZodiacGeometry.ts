import * as THREE from 'three';

/**
 * Creates thin circular ring geometry with specified inner & outer radii
 */
export function createZodiacCircleGeometry(
  innerRadius: number,
  outerRadius: number,
  thetaSegments: number = 96
): THREE.RingGeometry {
  return new THREE.RingGeometry(innerRadius, outerRadius, thetaSegments, 1);
}

/**
 * Creates 12 radial division segments as thin quad strips
 */
export function createRadialDivisionsGeometry(
  innerRadius: number,
  outerRadius: number,
  lineWidth: number = 0.006
): THREE.BufferGeometry {
  const vertices: number[] = [];
  const normals: number[] = [];
  const indices: number[] = [];

  const halfWidth = lineWidth * 0.5;

  for (let i = 0; i < 12; i++) {
    const angle = (i * Math.PI * 2) / 12 - Math.PI / 2;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    const perpX = -sin * halfWidth;
    const perpY = cos * halfWidth;

    const baseIndex = i * 4;

    const x0 = cos * innerRadius - perpX;
    const y0 = sin * innerRadius - perpY;
    const x1 = cos * innerRadius + perpX;
    const y1 = sin * innerRadius + perpY;
    const x2 = cos * outerRadius - perpX;
    const y2 = sin * outerRadius - perpY;
    const x3 = cos * outerRadius + perpX;
    const y3 = sin * outerRadius + perpY;

    vertices.push(x0, y0, 0, x1, y1, 0, x2, y2, 0, x3, y3, 0);
    normals.push(0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1);

    indices.push(baseIndex, baseIndex + 1, baseIndex + 2);
    indices.push(baseIndex + 1, baseIndex + 3, baseIndex + 2);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geometry.setIndex(indices);

  return geometry;
}

/**
 * Creates fine tick marks around the zodiac border
 */
export function createZodiacTicksGeometry(
  radius: number,
  tickLength: number = 0.035,
  tickCount: number = 72,
  tickWidth: number = 0.004
): THREE.BufferGeometry {
  const vertices: number[] = [];
  const normals: number[] = [];
  const indices: number[] = [];

  const halfWidth = tickWidth * 0.5;

  for (let i = 0; i < tickCount; i++) {
    const angle = (i * Math.PI * 2) / tickCount;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    const perpX = -sin * halfWidth;
    const perpY = cos * halfWidth;

    const isMajor = i % 6 === 0;
    const currentLen = isMajor ? tickLength * 1.5 : tickLength;
    const rOuter = radius + currentLen;

    const baseIndex = i * 4;

    const x0 = cos * radius - perpX;
    const y0 = sin * radius - perpY;
    const x1 = cos * radius + perpX;
    const y1 = sin * radius + perpY;
    const x2 = cos * rOuter - perpX;
    const y2 = sin * rOuter - perpY;
    const x3 = cos * rOuter + perpX;
    const y3 = sin * rOuter + perpY;

    vertices.push(x0, y0, 0, x1, y1, 0, x2, y2, 0, x3, y3, 0);
    normals.push(0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1);

    indices.push(baseIndex, baseIndex + 1, baseIndex + 2);
    indices.push(baseIndex + 1, baseIndex + 3, baseIndex + 2);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geometry.setIndex(indices);

  return geometry;
}

/**
 * Creates an exquisite 3D faceted 8-pointed golden celestial compass star with dual-toned facet shading
 */
export function createFacetedStarGeometry(
  majorRadius: number = 0.38,
  minorRadius: number = 0.24,
  centerDepth: number = 0.065
): THREE.BufferGeometry {
  const vertices: number[] = [];
  const normals: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];

  // Center apex
  const apex = [0, 0, centerDepth];

  // 8 points: 4 cardinal (major), 4 ordinal (minor)
  // 8 valleys between them (inner valley radius ~ 0.09)
  const valleyRadius = 0.085;
  const numRays = 8;

  // Colors: bright gold for one half of each ray, slightly deeper bronze-gold for other half
  const brightColor = new THREE.Color('#FFF0B5');
  const shadeColor = new THREE.Color('#D69932');

  let vertexCount = 0;

  for (let i = 0; i < numRays; i++) {
    const rayAngle = (i * Math.PI * 2) / numRays;
    const isCardinal = i % 2 === 0;
    const tipRadius = isCardinal ? majorRadius : minorRadius;

    const tipX = Math.cos(rayAngle) * tipRadius;
    const tipY = Math.sin(rayAngle) * tipRadius;

    // Previous valley
    const prevValleyAngle = rayAngle - Math.PI / numRays;
    const prevValX = Math.cos(prevValleyAngle) * valleyRadius;
    const prevValY = Math.sin(prevValleyAngle) * valleyRadius;

    // Next valley
    const nextValleyAngle = rayAngle + Math.PI / numRays;
    const nextValX = Math.cos(nextValleyAngle) * valleyRadius;
    const nextValY = Math.sin(nextValleyAngle) * valleyRadius;

    // Triangle 1: Apex -> prevValley -> Tip (Shaded facet)
    vertices.push(apex[0], apex[1], apex[2]);
    vertices.push(prevValX, prevValY, 0);
    vertices.push(tipX, tipY, 0);

    colors.push(brightColor.r, brightColor.g, brightColor.b);
    colors.push(brightColor.r, brightColor.g, brightColor.b);
    colors.push(brightColor.r, brightColor.g, brightColor.b);

    // Compute normal
    const v1 = new THREE.Vector3(apex[0], apex[1], apex[2]);
    const v2 = new THREE.Vector3(prevValX, prevValY, 0);
    const v3 = new THREE.Vector3(tipX, tipY, 0);
    const n1 = new THREE.Vector3().crossVectors(v2.sub(v1), v3.sub(v1)).normalize();
    normals.push(n1.x, n1.y, n1.z, n1.x, n1.y, n1.z, n1.x, n1.y, n1.z);

    indices.push(vertexCount, vertexCount + 1, vertexCount + 2);
    vertexCount += 3;

    // Triangle 2: Apex -> Tip -> nextValley (Darker shaded facet for 3D bevel look)
    vertices.push(apex[0], apex[1], apex[2]);
    vertices.push(tipX, tipY, 0);
    vertices.push(nextValX, nextValY, 0);

    colors.push(shadeColor.r, shadeColor.g, shadeColor.b);
    colors.push(shadeColor.r, shadeColor.g, shadeColor.b);
    colors.push(shadeColor.r, shadeColor.g, shadeColor.b);

    const vA = new THREE.Vector3(apex[0], apex[1], apex[2]);
    const vB = new THREE.Vector3(tipX, tipY, 0);
    const vC = new THREE.Vector3(nextValX, nextValY, 0);
    const n2 = new THREE.Vector3().crossVectors(vB.sub(vA), vC.sub(vA)).normalize();
    normals.push(n2.x, n2.y, n2.z, n2.x, n2.y, n2.z, n2.x, n2.y, n2.z);

    indices.push(vertexCount, vertexCount + 1, vertexCount + 2);
    vertexCount += 3;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);

  return geometry;
}
