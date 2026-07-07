import {
  BufferGeometry,
  Float32BufferAttribute,
  Uint32BufferAttribute,
} from "three";

export type DisplaceableCylinderTopGeometryOptions = {
  height?: number;
  radialSegments?: number;
  radius?: number;
  thetaLength?: number;
  thetaSegments?: number;
  thetaStart?: number;
};

const MIN_SEGMENTS = 1;
const FULL_CIRCLE = Math.PI * 2;

function clampSegments(value: number | undefined, fallback: number): number {
  return Math.max(MIN_SEGMENTS, Math.floor(value ?? fallback));
}

export function createDisplaceableCylinderTopGeometry({
  height = 1,
  radialSegments = 32,
  radius = 1,
  thetaLength = FULL_CIRCLE,
  thetaSegments = 128,
  thetaStart = 0,
}: DisplaceableCylinderTopGeometryOptions = {}): BufferGeometry {
  const ringCount = clampSegments(radialSegments, 32);
  const sliceCount = clampSegments(thetaSegments, 128);
  const normalizedRadius = Math.max(0, radius);
  const uvRadius = normalizedRadius || 1;
  const topY = height / 2;

  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let ring = 0; ring <= ringCount; ring += 1) {
    const radiusRatio = ring / ringCount;
    const ringRadius = normalizedRadius * radiusRatio;

    for (let slice = 0; slice <= sliceCount; slice += 1) {
      const thetaRatio = slice / sliceCount;
      const theta = thetaStart + thetaLength * thetaRatio;
      const x = ringRadius * Math.sin(theta);
      const z = ringRadius * Math.cos(theta);

      positions.push(x, topY, z);
      normals.push(0, 1, 0);
      uvs.push((x / uvRadius + 1) / 2, (z / uvRadius + 1) / 2);
    }
  }

  const rowLength = sliceCount + 1;

  for (let ring = 0; ring < ringCount; ring += 1) {
    for (let slice = 0; slice < sliceCount; slice += 1) {
      const innerStart = ring * rowLength + slice;
      const innerEnd = innerStart + 1;
      const outerStart = innerStart + rowLength;
      const outerEnd = outerStart + 1;

      indices.push(innerStart, outerStart, outerEnd);
      indices.push(innerStart, outerEnd, innerEnd);
    }
  }

  const geometry = new BufferGeometry();

  geometry.setIndex(new Uint32BufferAttribute(indices, 1));
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.setAttribute("normal", new Float32BufferAttribute(normals, 3));
  geometry.setAttribute("uv", new Float32BufferAttribute(uvs, 2));
  geometry.computeBoundingSphere();

  return geometry;
}
