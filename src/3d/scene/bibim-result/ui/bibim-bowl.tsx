import { forwardRef, useMemo } from "react";
import type { ComponentPropsWithoutRef } from "react";
import type { Group } from "three";

import { GlbModel } from "@/shared/3d/ui/glb-model";
import { TexturedPieSlice } from "@/shared/3d/ui/textured-pie-slice";
import type { BibimResultSceneSlice } from "../model/bibim-result-scene.types";
import { createSliceMeshes } from "../model/create-slice-meshes";

type GroupProps = ComponentPropsWithoutRef<"group">;

type BibimBowlProps = Omit<GroupProps, "children" | "ref"> & {
  slices: BibimResultSceneSlice[];
};

const BOWL_MODEL_URL = "3d/items/DarkStoneBowl.glb";
const FRIEDEGG_MODEL_URL = "3d/items/FriedEgg.glb";

export const BibimBowl = forwardRef<Group, BibimBowlProps>(
  ({ slices, ...props }, ref) => {
    const sliceMeshes = useMemo(() => createSliceMeshes(slices), [slices]);

    return (
      <group ref={ref} {...props}>
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
    );
  },
);

BibimBowl.displayName = "BibimBowl";
