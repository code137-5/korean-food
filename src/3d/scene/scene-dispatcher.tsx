import { useMatches } from "react-router-dom";
import { ThreeSceneCuisine } from "@/3d/scene/cuisine/scene-cuisine";
import { ThreeSceneHome } from "@/3d/scene/home/scene-home";
import type { ThreeSceneType } from "@/3d/scene/types";

type RouteHandle = {
  scene?: ThreeSceneType;
};

export function ThreeSceneDispatcher() {
  const matches = useMatches();
  const scene = [...matches]
    .reverse()
    .map((match) => (match.handle as RouteHandle | undefined)?.scene)
    .find(Boolean);

  switch (scene) {
    case "cuisine":
      return <ThreeSceneCuisine />;
    case "home":
    default:
      return <ThreeSceneHome />;
  }
}
