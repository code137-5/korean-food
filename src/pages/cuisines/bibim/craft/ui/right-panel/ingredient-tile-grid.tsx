import { useIngredientsByCategoryQuery } from "@/entities/ingredient";
import { useBibimCraftStore } from "../../model/bibim-craft-store";
import { IngredientTile } from "./ingredient-tile";
import { useEffect } from "react";

export function IngredientTileGrid() {
  const selectedIngredientCategoryCode = useBibimCraftStore(
    (state) => state.selectedIngredientCategoryCode,
  );
  const registerIngredientFlags = useBibimCraftStore(
    (state) => state.registerIngredientFlags,
  );
  const { data: ingredients } = useIngredientsByCategoryQuery(
    selectedIngredientCategoryCode,
  );
  const ingredientIdsKey = ingredients
    .map((ingredient) => ingredient.id)
    .join("|");

  useEffect(() => {
    if (!ingredientIdsKey) {
      return;
    }

    registerIngredientFlags(ingredientIdsKey.split("|"));
  }, [ingredientIdsKey, registerIngredientFlags]);

  return (
    <div className="grid grid-cols-4 content-start gap-1">
      {ingredients.map((ingredient) => (
        <IngredientTile key={ingredient.id} ingredient={ingredient} />
      ))}
    </div>
  );
}
