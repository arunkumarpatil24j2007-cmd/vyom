import * as THREE from 'three';

/**
 * Creates an ultra-smooth 3D ribbon buffer geometry along a 3D spline curve
 */
export function createRibbonGeometry(
  curvePoints: THREE.Vector3[],
  widths: number[] | number,
  segments: number = 160,
  twistAngles?: number[]
): THREE.BufferGeometry {
  const curve = new THREE.CatmullRomCurve3(curvePoints, false, 'centripetal', 0.5);
  const samplePoints = curve.getSpacedPoints(segments);

  const vertices: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  const tangents: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const u = i / segments;
    tangents.push(curve.getTangentAt(u));
  }

  // Initial reference up vector
  let up = new THREE.Vector3(0, 0, 1);

  for (let i = 0; i <= segments; i++) {
    const pt = samplePoints[i];
    const tangent = tangents[i];

    // Compute binormal perpendicular to tangent and up
    let binormal = new THREE.Vector3().crossVectors(tangent, up).normalize();
    if (binormal.lengthSq() < 0.001) {
      binormal = new THREE.Vector3(0, 1, 0);
    }
    const normal = new THREE.Vector3().crossVectors(binormal, tangent).normalize();

    // Width interpolation
    let w = 0.5;
    if (typeof widths === 'number') {
      w = widths;
    } else if (Array.isArray(widths) && widths.length > 0) {
      const idx = (i / segments) * (widths.length - 1);
      const low = Math.floor(idx);
      const high = Math.min(low + 1, widths.length - 1);
      const frac = idx - low;
      w = widths[low] * (1 - frac) + widths[high] * frac;
    }

    // Optional smooth twist along curve
    let binormalDir = binormal.clone();
    if (twistAngles && twistAngles.length > 0) {
      const idx = (i / segments) * (twistAngles.length - 1);
      const low = Math.floor(idx);
      const high = Math.min(low + 1, twistAngles.length - 1);
      const frac = idx - low;
      const angle = twistAngles[low] * (1 - frac) + twistAngles[high] * frac;
      binormalDir.applyAxisAngle(tangent, angle);
    }

    const halfWidth = w * 0.5;
    const vLeft = new THREE.Vector3().copy(pt).addScaledVector(binormalDir, -halfWidth);
    const vRight = new THREE.Vector3().copy(pt).addScaledVector(binormalDir, halfWidth);

    vertices.push(vLeft.x, vLeft.y, vLeft.z);
    vertices.push(vRight.x, vRight.y, vRight.z);

    // Initial normals (will be perfected by computeVertexNormals)
    normals.push(normal.x, normal.y, normal.z);
    normals.push(normal.x, normal.y, normal.z);

    const vCoord = i / segments;
    uvs.push(0, vCoord);
    uvs.push(1, vCoord);

    if (i < segments) {
      const row1 = i * 2;
      const row2 = (i + 1) * 2;

      // Clean single-layer quad faces
      indices.push(row1, row1 + 1, row2);
      indices.push(row1 + 1, row2 + 1, row2);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  return geometry;
}
