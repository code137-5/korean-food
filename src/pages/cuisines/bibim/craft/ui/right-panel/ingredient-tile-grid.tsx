import { PaperTile } from "@/shared/ui/textured-ui";

const INGREDIENT_TILE_COUNT = 7;

export function IngredientTileGrid() {
  return (
    <div className="grid grid-cols-4 content-start gap-1">
      {Array.from({ length: INGREDIENT_TILE_COUNT }, (_, index) => (
        <PaperTile key={index} className="block w-28 aspect-2/3" />
      ))}
    </div>
  );
}
