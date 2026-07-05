import { TexturedButton, TexturedPanel } from "@/shared/ui/textured-ui";
import { IngredientDiagram } from "./ingredient-diagram";

export function BibimCraftCenterPanel() {
  return (
    <TexturedPanel
      variant="felt"
      className="relative z-10 h-[95%] grow p-8 pointer-events-auto flex flex-col gap-4 items-center"
    >
      <div className="min-h-0 flex-1">
        <IngredientDiagram />
      </div>
      <TexturedButton
        size="md"
        variant="dark"
        className="h-16 w-80 justify-center"
      >
        완료
      </TexturedButton>
    </TexturedPanel>
  );
}
