import { TexturedPanel } from "@/shared/ui/textured-ui";
import { IngredientDiagram } from "./ingredient-diagram";

export function BibimCraftCenterPanel() {
  return (
    <TexturedPanel
      variant="felt"
      className="relative z-10 h-[95%] grow p-8 pointer-events-auto"
    >
      <IngredientDiagram />
    </TexturedPanel>
  );
}
