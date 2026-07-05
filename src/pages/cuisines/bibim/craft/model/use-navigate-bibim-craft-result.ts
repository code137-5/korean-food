import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import {
  EMPTY_INGREDIENT_PIE_ITEM_ID,
  useBibimCraftStore,
} from "./bibim-craft-store";

const BIBIM_CRAFT_RESULT_PATH = "/cuisines/bibim/craft/result";
const INGREDIENTS_SEARCH_PARAM = "i";

function formatIngredientValue(value: number): string {
  if (Number.isInteger(value)) {
    return String(value);
  }

  return value.toFixed(2).replace(/\.?0+$/, "");
}

export function useNavigateBibimCraftResult() {
  const navigate = useNavigate();
  const ingredientPieItems = useBibimCraftStore(
    (state) => state.ingredientPieItems,
  );

  return useCallback(() => {
    const serializedIngredientItems = [...ingredientPieItems]
      .sort((left, right) => left.order - right.order)
      .filter(
        (item) =>
          item.ingredientId !== EMPTY_INGREDIENT_PIE_ITEM_ID && item.value > 0,
      )
      .map(
        (item) =>
          `${encodeURIComponent(item.ingredientId)}:${formatIngredientValue(
            item.value,
          )}`,
      );

    if (serializedIngredientItems.length === 0) {
      navigate(BIBIM_CRAFT_RESULT_PATH);
      return;
    }

    navigate(
      `${BIBIM_CRAFT_RESULT_PATH}?${INGREDIENTS_SEARCH_PARAM}=${serializedIngredientItems.join(
        ",",
      )}`,
    );
  }, [ingredientPieItems, navigate]);
}
