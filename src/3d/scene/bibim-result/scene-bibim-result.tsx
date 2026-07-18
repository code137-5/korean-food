import { useMemo, useRef } from "react";
import type { Group } from "three";

import { GlbModel } from "@/shared/3d/ui/glb-model";
import { TexturedPieSlice } from "@/shared/3d/ui/textured-pie-slice";
import type { BibimResultSceneSlice } from "./model/bibim-result-scene.types";
import { createSliceMeshes } from "./model/create-slice-meshes";
import { useRegisterBibimResultGlbDownload } from "./model/use-register-bibim-result-glb-download";

export type { BibimResultSceneSlice } from "./model/bibim-result-scene.types";

type ThreeSceneBibimResultProps = {
  slices: BibimResultSceneSlice[];
};

const BOWL_MODEL_URL = "3d/items/DarkStoneBowl.glb";
const FRIEDEGG_MODEL_URL = "3d/items/FriedEgg.glb";

export function ThreeSceneBibimResult({ slices }: ThreeSceneBibimResultProps) {
  const groupRef = useRef<Group>(null);
  const sliceMeshes = useMemo(() => createSliceMeshes(slices), [slices]);
  useRegisterBibimResultGlbDownload(groupRef);

  return (
    <>
      <group ref={groupRef}>
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
      </group>
    </>
  );
}
