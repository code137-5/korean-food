import { useMemo } from "react";

import { GlbModel } from "@/shared/3d/ui/glb-model";
import { TexturedPieSlice } from "@/shared/3d/ui/textured-pie-slice";

export type BibimResultSceneSlice = {
  color: string;
  diffuseMapUrl?: string;
  displacementMapUrl?: string;
  id: string;
  normalMapUrl?: string;
  value: number;
};

type BibimResultSceneSliceMesh = {
  color: string;
  diffuseMapUrl?: string;
  displacementMapUrl?: string;
  id: string;
  normalMapUrl?: string;
  thetaLength: number;
  thetaStart: number;
};

type ThreeSceneBibimResultProps = {
  slices: BibimResultSceneSlice[];
};

const EMPTY_SLICE: BibimResultSceneSlice = {
  color: "#d8c8a8",
  id: "empty",
  value: 100,
};
const BOWL_MODEL_URL = "3d/items/DarkStoneBowl.glb";
const FRIEDEGG_MODEL_URL = "3d/items/FriedEgg.glb";

function createSliceMeshes(
  slices: BibimResultSceneSlice[],
): BibimResultSceneSliceMesh[] {
  const visibleSlices = slices.length > 0 ? slices : [EMPTY_SLICE];
  const totalValue = visibleSlices.reduce((total, slice) => {
    return total + slice.value;
  }, 0);

  return visibleSlices.reduce<BibimResultSceneSliceMesh[]>(
    (sliceMeshes, slice) => {
      const previousSlice = sliceMeshes.at(-1);
      const thetaStart = previousSlice
        ? previousSlice.thetaStart + previousSlice.thetaLength
        : Math.PI / 2;

      return [
        ...sliceMeshes,
        {
          color: slice.color,
          diffuseMapUrl: slice.diffuseMapUrl,
          displacementMapUrl: slice.displacementMapUrl,
          id: slice.id,
          normalMapUrl: slice.normalMapUrl,
          thetaLength: (slice.value / totalValue) * Math.PI * 2,
          thetaStart,
        },
      ];
    },
    [],
  );
}

export function ThreeSceneBibimResult({ slices }: ThreeSceneBibimResultProps) {
  const sliceMeshes = useMemo(() => createSliceMeshes(slices), [slices]);

  return (
    <>
      <group position={[0, 0.8, 0]}>
        {sliceMeshes.map((slice) => (
          <TexturedPieSlice
            key={slice.id}
            diffuseMapUrl={slice.diffuseMapUrl}
            displacementMapUrl={slice.displacementMapUrl}
            fallbackColor={slice.color}
            normalMapUrl={slice.normalMapUrl}
            thetaLength={slice.thetaLength}
            thetaStart={slice.thetaStart}
          />
        ))}
      </group>
      <GlbModel url={BOWL_MODEL_URL} scale={2.45} />
      <GlbModel position={[0, 0.9, 0]} url={FRIEDEGG_MODEL_URL} />
    </>
  );
}
