import { useMemo } from "react";

import {
  useIngredientsQuery,
  type IngredientId,
} from "@/entities/ingredient";
import type { BibimResultSceneSlice } from "@/3d/scene/bibim-result/scene-bibim-result";

const DEFAULT_BIBIM_INGREDIENT_IDS = [
  "gosari",
  "spinach",
  "beef",
  "radish",
  "lentinus",
  "kimchi",
] as const satisfies readonly IngredientId[];

const DEFAULT_BIBIM_SLICE_VALUE = 1;
const DEFAULT_BIBIM_SLICE_COLOR = "#7fb069";
const EMPTY_BIBIM_SLICES: BibimResultSceneSlice[] = [];

export function useDefaultBibimSlices() {
  const ingredientsQuery = useIngredientsQuery();
  const ingredients = ingredientsQuery.data;
  const slices = useMemo(
    () =>
      ingredients
        ? DEFAULT_BIBIM_INGREDIENT_IDS.flatMap((ingredientId) => {
            const ingredient = ingredients[ingredientId];

            if (!ingredient) {
              return [];
            }

            return [
              {
                color: ingredient.color ?? DEFAULT_BIBIM_SLICE_COLOR,
                diffuseMapUrl: ingredient.diffuseMapUrl,
                displacementMapUrl: ingredient.displacementMapUrl,
                id: ingredient.id,
                normalMapUrl: ingredient.normalMapUrl,
                value: DEFAULT_BIBIM_SLICE_VALUE,
              },
            ];
          })
        : EMPTY_BIBIM_SLICES,
    [ingredients],
  );

  return {
    ...ingredientsQuery,
    data: slices,
  };
}
