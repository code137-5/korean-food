import { useIngredientsByCategoryQuery } from "@/entities/ingredient";
import { useBibimCraftStore } from "../../model/bibim-craft-store";
import { PaperTile } from "@/shared/ui/textured-ui";
import { useTranslation } from "react-i18next";

export function IngredientTileGrid() {
  const { t } = useTranslation("ingredient");
  const selectedIngredientCategoryCode = useBibimCraftStore(
    (state) => state.selectedIngredientCategoryCode,
  );
  const { data: ingredients } = useIngredientsByCategoryQuery(
    selectedIngredientCategoryCode,
  );

  return (
    <div className="grid grid-cols-4 content-start gap-1">
      {ingredients.map((ingredient) => (
        <PaperTile
          key={ingredient.id}
          className="block w-28 aspect-2/3"
          contentClassName="flex items-center justify-center px-2 text-center text-sm font-semibold leading-5 text-[#3f2f1f]"
        >
          {t(ingredient.nameKey)}
        </PaperTile>
      ))}
    </div>
  );
}
