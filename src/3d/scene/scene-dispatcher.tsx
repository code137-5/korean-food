import type { ThreeSceneType } from "@/3d/scene/model";
import { ThreeSceneCuisine } from "@/3d/scene/cuisine/scene-cuisine";
import { ThreeSceneHome } from "@/3d/scene/home/scene-home";

type ThreeSceneDispatcherProps = {
  scene?: ThreeSceneType;
};

export function ThreeSceneDispatcher({ scene }: ThreeSceneDispatcherProps) {
  switch (scene) {
    case "cuisine":
      return <ThreeSceneCuisine />;
    case "home":
      return <ThreeSceneHome />;
    default:
      return null;
  }
}
