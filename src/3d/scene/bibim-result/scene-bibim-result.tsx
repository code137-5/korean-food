import { useRef } from "react";
import type { Group } from "three";

import type { BibimResultSceneSlice } from "./model/bibim-result-scene.types";
import { useRegisterBibimResultGlbDownload } from "./model/use-register-bibim-result-glb-download";
import { BibimBowl } from "./ui/bibim-bowl";

export type { BibimResultSceneSlice } from "./model/bibim-result-scene.types";

type ThreeSceneBibimResultProps = {
  slices: BibimResultSceneSlice[];
};

export function ThreeSceneBibimResult({ slices }: ThreeSceneBibimResultProps) {
  const groupRef = useRef<Group>(null);
  useRegisterBibimResultGlbDownload(groupRef);

  return <BibimBowl ref={groupRef} slices={slices} />;
}
