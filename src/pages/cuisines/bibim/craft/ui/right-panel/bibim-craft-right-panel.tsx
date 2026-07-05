import { TexturedPanel } from "@/shared/ui/textured-ui";
import { IngredientTileGrid } from "./ingredient-tile-grid";

export function BibimCraftRightPanel() {
  return (
    <TexturedPanel className="relative z-20 h-[90%] p-4 pointer-events-auto">
      <IngredientTileGrid />
    </TexturedPanel>
  );
}
