import { TexturedButton, TexturedPanel } from "@/shared/ui/textured-ui";
import { useTranslation } from "react-i18next";
import { useNavigateBibimCraftResult } from "../../model/use-navigate-bibim-craft-result";
import { IngredientDiagram } from "./ingredient-diagram";
import {
  EMPTY_INGREDIENT_PIE_ITEM_ID,
  useBibimCraftStore,
} from "../../model/bibim-craft-store";

const COMPLETE_INGREDIENT_TOTAL_VALUE = 100;
const INGREDIENT_TOTAL_VALUE_TOLERANCE = 0.5;

export function BibimCraftCenterPanel() {
  const { t } = useTranslation("bibim-cuisine");
  const navigateBibimCraftResult = useNavigateBibimCraftResult();
  const selectedIngredientTotalValue = useBibimCraftStore((state) =>
    state.ingredientPieItems
      .filter((item) => item.ingredientId !== EMPTY_INGREDIENT_PIE_ITEM_ID)
      .reduce((total, item) => total + item.value, 0),
  );
  const isResultNavigationDisabled =
    selectedIngredientTotalValue <
    COMPLETE_INGREDIENT_TOTAL_VALUE - INGREDIENT_TOTAL_VALUE_TOLERANCE;

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
        disabled={isResultNavigationDisabled}
        onClick={navigateBibimCraftResult}
      >
        {t("craft.actions.complete")}
      </TexturedButton>
    </TexturedPanel>
  );
}
