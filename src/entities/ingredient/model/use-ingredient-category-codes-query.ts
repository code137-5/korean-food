import type {
  IngredientCategoryCode,
  IngredientMap,
} from "@/entities/ingredient";
import { useIngredientsQuery } from "@/entities/ingredient/model/use-ingredients-query";

const EMPTY_INGREDIENT_CATEGORY_CODES: IngredientCategoryCode[] = [];

type UseIngredientCategoryCodesQueryResult = Omit<
  ReturnType<typeof useIngredientsQuery>,
  "data"
> & {
  data: IngredientCategoryCode[];
};

function getIngredientCategoryCodes(
  ingredients: IngredientMap,
): IngredientCategoryCode[] {
  const categoryCodes = new Set<IngredientCategoryCode>();

  Object.values(ingredients)
    .sort((left, right) => (left.sortOrder ?? 0) - (right.sortOrder ?? 0))
    .forEach((ingredient) => {
      categoryCodes.add(ingredient.categoryCode);
    });

  return Array.from(categoryCodes);
}

export function useIngredientCategoryCodesQuery(): UseIngredientCategoryCodesQueryResult {
  const query = useIngredientsQuery();

  return {
    ...query,
    data: query.data
      ? getIngredientCategoryCodes(query.data)
      : EMPTY_INGREDIENT_CATEGORY_CODES,
  };
}
