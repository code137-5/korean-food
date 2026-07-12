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
const DEG_TO_RAD = Math.PI / 180;
const SLICE_EDGE_FULL_HEIGHT_ANGLE = 5 * DEG_TO_RAD;

function clampSegments(value: number | undefined, fallback: number): number {
  return Math.max(MIN_SEGMENTS, Math.floor(value ?? fallback));
}

function getSliceHeightFactor(thetaRatio: number, thetaLength: number): number {
  // return 1;
  const distanceFromEdge =
    Math.min(thetaRatio, 1 - thetaRatio) * Math.abs(thetaLength);

  if (distanceFromEdge >= SLICE_EDGE_FULL_HEIGHT_ANGLE) {
    return 1;
  }

  const normalizedDistance = distanceFromEdge / SLICE_EDGE_FULL_HEIGHT_ANGLE;

  return Math.sqrt(1 - (1 - normalizedDistance) ** 2);
}

function getSliceNormal(
  thetaRatio: number,
  theta: number,
  thetaLength: number,
  ringRadius: number,
  fallbackRingRadius: number,
  topY: number,
  sliceCount: number,
): [number, number, number] {
  const heightFactor = getSliceHeightFactor(thetaRatio, thetaLength);

  if (heightFactor >= 1 || thetaLength === 0 || topY === 0) {
    return [0, 1, 0];
  }

  const deltaRatio = 1 / sliceCount;
  const prevRatio = Math.max(0, thetaRatio - deltaRatio);
  const nextRatio = Math.min(1, thetaRatio + deltaRatio);
  const deltaTheta = thetaLength * (nextRatio - prevRatio);

  if (deltaTheta === 0) {
    return [0, 1, 0];
  }

  const prevY = topY * getSliceHeightFactor(prevRatio, thetaLength);
  const nextY = topY * getSliceHeightFactor(nextRatio, thetaLength);
  const heightSlope = (nextY - prevY) / deltaTheta;
  const normalRadius = ringRadius || fallbackRingRadius;

  if (normalRadius === 0) {
    return [0, 1, 0];
  }

  const normalX = -Math.cos(theta) * heightSlope;
  const normalY = normalRadius;
  const normalZ = Math.sin(theta) * heightSlope;
  const normalLength = Math.hypot(normalX, normalY, normalZ);

  return [
    normalX / normalLength,
    normalY / normalLength,
    normalZ / normalLength,
  ];
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
  const uvRadius = normalizedRadius * 1.23 || 1.23;
  const topY = height / 2;

  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const displacementWeights: number[] = [];
  const indices: number[] = [];

  for (let ring = 0; ring <= ringCount; ring += 1) {
    const radiusRatio = ring / ringCount;
    const ringRadius = normalizedRadius * radiusRatio;

    const baseLength = normalizedRadius * radiusRatio;
    const edgeCornerRadius =
      baseLength * (SLICE_EDGE_FULL_HEIGHT_ANGLE / thetaLength);
    const resultLength =
      baseLength - 2 * edgeCornerRadius + 2 * (Math.PI / 2) * edgeCornerRadius;

    const edgeRadiusVertexCount =
      sliceCount * (((Math.PI / 2) * edgeCornerRadius) / resultLength);
    // console.log(resultLength);
    // console.log(edgeSliceRadius, resultLength);
    /* console.log(sliceCount, resultLength);
    console.log(
      Math.round(
        sliceCount * (((Math.PI / 2) * edgeCornerRadius) / resultLength),
      ),
    );
    console.log(
      sliceCount * (baseLength - (2 * edgeCornerRadius) / resultLength),
    );
    console.log("=========="); */

    /*     for (let slice = 0; slice <= sliceCount; slice += 1) {


    } */

    for (let slice = 0; slice <= sliceCount; slice += 1) {
      const thetaRatio = slice / sliceCount;
      const theta = thetaStart + thetaLength * thetaRatio;
      const sliceHeightFactor = getSliceHeightFactor(thetaRatio, thetaLength);
      const x = ringRadius * Math.sin(theta);
      const y = topY * sliceHeightFactor;
      const z = ringRadius * Math.cos(theta);
      const normal = getSliceNormal(
        thetaRatio,
        theta,
        thetaLength,
        ringRadius,
        normalizedRadius / ringCount,
        topY,
        sliceCount,
      );

      positions.push(x, y, z);
      normals.push(...normal);
      uvs.push((x / uvRadius + 1) / 2, (z / uvRadius + 1) / 2);
      displacementWeights.push(
        sliceHeightFactor *
          sliceHeightFactor *
          sliceHeightFactor *
          sliceHeightFactor *
          sliceHeightFactor,
      );
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
  geometry.setAttribute(
    "displacementWeight",
    new Float32BufferAttribute(displacementWeights, 1),
  );
  geometry.computeBoundingSphere();

  return geometry;
}
