import type { Material } from "three";

type MaterialShader = Parameters<Material["onBeforeCompile"]>[0];

const COMMON_INCLUDE = "#include <common>";
const DISPLACEMENT_MAP_VERTEX_INCLUDE = "#include <displacementmap_vertex>";

export const DISPLACEMENT_WEIGHT_ATTRIBUTE = "displacementWeight";

export const displacementWeightParsVertexShaderChunk = `
attribute float ${DISPLACEMENT_WEIGHT_ATTRIBUTE};
`;

export const displacementWeightedDisplacementMapVertexShaderChunk = `
#ifdef USE_DISPLACEMENTMAP
  float displacementHeight = texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias;
  transformed += normalize( objectNormal ) * displacementHeight * ${DISPLACEMENT_WEIGHT_ATTRIBUTE};
#endif
`;

export function replaceDisplacementMapWithWeightedChunk(
  shader: MaterialShader,
): void {
  shader.vertexShader = shader.vertexShader
    .replace(
      COMMON_INCLUDE,
      `${COMMON_INCLUDE}\n${displacementWeightParsVertexShaderChunk}`,
    )
    .replace(
      DISPLACEMENT_MAP_VERTEX_INCLUDE,
      displacementWeightedDisplacementMapVertexShaderChunk,
    );
}
