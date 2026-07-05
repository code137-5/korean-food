import type { Ingredient, IngredientCategoryCode } from "@/entities/ingredient";
import { useIngredientsQuery } from "@/entities/ingredient/model/use-ingredients-query";

const EMPTY_INGREDIENTS: Ingredient[] = [];

type UseIngredientsByCategoryQueryResult = Omit<
  ReturnType<typeof useIngredientsQuery>,
  "data"
> & {
  data: Ingredient[];
};

function getIngredientsByCategory(
  ingredients: Ingredient[],
  categoryCode: IngredientCategoryCode,
): Ingredient[] {
  return ingredients
    .filter((ingredient) => ingredient.categoryCode === categoryCode)
    .sort((left, right) => (left.sortOrder ?? 0) - (right.sortOrder ?? 0));
}

export function useIngredientsByCategoryQuery(
  categoryCode: IngredientCategoryCode | null,
): UseIngredientsByCategoryQueryResult {
  const query = useIngredientsQuery();
  const ingredients = query.data ? Object.values(query.data) : EMPTY_INGREDIENTS;

  return {
    ...query,
    data:
      categoryCode && query.data
        ? getIngredientsByCategory(ingredients, categoryCode)
        : EMPTY_INGREDIENTS,
  };
}
