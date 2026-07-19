import { BibimBowl } from "@/3d/scene/bibim-result/ui/bibim-bowl";
import type { BibimResultSceneSlice } from "@/3d/scene/bibim-result/scene-bibim-result";

const DEFAULT_BIBIM_SLICES: BibimResultSceneSlice[] = [
  {
    color: "#7a5d3a",
    diffuseMapUrl: "3d/maps/cuisines/ingredients/gosari-diffuse.png",
    displacementMapUrl: "3d/maps/cuisines/ingredients/gosari-displacement.png",
    id: "gosari",
    normalMapUrl: "3d/maps/cuisines/ingredients/gosari-normal.png",
    value: 20,
  },
  {
    color: "#4f8f45",
    diffuseMapUrl: "3d/maps/cuisines/ingredients/spinach-diffuse.png",
    displacementMapUrl: "3d/maps/cuisines/ingredients/spinach-displacement.png",
    id: "spinach",
    normalMapUrl: "3d/maps/cuisines/ingredients/spinach-normal.png",
    value: 20,
  },
  {
    color: "#9d4a35",
    diffuseMapUrl: "3d/maps/cuisines/ingredients/beef-diffuse.png",
    displacementMapUrl: "3d/maps/cuisines/ingredients/beef-displacement.png",
    id: "beef",
    normalMapUrl: "3d/maps/cuisines/ingredients/beef-normal.png",
    value: 20,
  },
  {
    color: "#eee3d1",
    diffuseMapUrl: "3d/maps/cuisines/ingredients/radish-diffuse.png",
    displacementMapUrl: "3d/maps/cuisines/ingredients/radish-displacement.png",
    id: "radish",
    normalMapUrl: "3d/maps/cuisines/ingredients/radish-normal.png",
    value: 20,
  },
  {
    color: "#8a5a3c",
    diffuseMapUrl: "3d/maps/cuisines/ingredients/lentinus-diffuse.png",
    displacementMapUrl: "3d/maps/cuisines/ingredients/lentinus-displacement.png",
    id: "lentinus",
    normalMapUrl: "3d/maps/cuisines/ingredients/lentinus-normal.png",
    value: 20,
  },
];

export function ThreeSceneBibim() {
  return <BibimBowl slices={DEFAULT_BIBIM_SLICES} />;
}
