import type { Ingredient } from "@/entities/ingredient";
import { useBibimCraftStore } from "../../model/bibim-craft-store";
import { cn } from "@/lib/utils";
import { PaperTile } from "@/shared/ui/textured-ui";
import { useTranslation } from "react-i18next";

type IngredientTileProps = {
  ingredient: Ingredient;
};

export function IngredientTile({ ingredient }: IngredientTileProps) {
  const { t } = useTranslation("ingredient");
  const isSelected = useBibimCraftStore(
    (state) => state.ingredientFlags[ingredient.id] ?? false,
  );
  const toggleIngredientFlag = useBibimCraftStore(
    (state) => state.toggleIngredientFlag,
  );

  return (
    <PaperTile
      className={cn(
        "block w-28 aspect-2/3 cursor-pointer",
        isSelected && "ui-paper-tile-frame-selected",
      )}
      contentClassName={cn(
        "flex items-center justify-center px-2 text-center text-sm font-semibold leading-5 text-[#3f2f1f] transition",
        isSelected && "bg-[#4a3322]/20 text-[#21170f]",
      )}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      onClick={() => toggleIngredientFlag(ingredient.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          toggleIngredientFlag(ingredient.id);
        }
      }}
    >
      {t(ingredient.nameKey)}
    </PaperTile>
  );
}
