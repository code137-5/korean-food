import type { ThreeSceneType } from "@/3d/scene/model";
import {
  ThreeSceneBibimResult,
  type BibimResultSceneSlice,
} from "@/3d/scene/bibim-result/scene-bibim-result";
import { ThreeSceneCuisine } from "@/3d/scene/cuisine/scene-cuisine";
import { ThreeSceneHome } from "@/3d/scene/home/scene-home";

type ThreeSceneDispatcherProps = {
  bibimResultSlices: BibimResultSceneSlice[];
  scene?: ThreeSceneType;
};

export function ThreeSceneDispatcher({
  bibimResultSlices,
  scene,
}: ThreeSceneDispatcherProps) {
  switch (scene) {
    case "cuisine":
      return <ThreeSceneCuisine />;
    case "bibim.result":
      return <ThreeSceneBibimResult slices={bibimResultSlices} />;
    case "home":
      return <ThreeSceneHome />;
    default:
      return null;
  }
}
