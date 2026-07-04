import { useMatches } from "react-router-dom";

import type { ThreeSceneType } from "./types";

type RouteHandle = {
  scene?: ThreeSceneType;
};

export function useCurrentThreeScene() {
  const matches = useMatches();

  return [...matches]
    .reverse()
    .map((match) => (match.handle as RouteHandle | undefined)?.scene)
    .find(Boolean);
}
