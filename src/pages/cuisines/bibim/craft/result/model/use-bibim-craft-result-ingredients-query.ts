import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import {
  useIngredientsQuery,
  type Ingredient,
  type IngredientId,
} from "@/entities/ingredient";

const INGREDIENTS_SEARCH_PARAM = "i";
const LEGACY_INGREDIENTS_SEARCH_PARAM = "ingredients";
const MAX_TOTAL_VALUE = 100;

export type BibimCraftResultIngredient = {
  ingredient: Ingredient;
  ingredientId: IngredientId;
  order: number;
  value: number;
};

type ParsedIngredientParam = {
  ingredientId: IngredientId;
  value: number;
};

type InvalidIngredientParam = {
  rawValue: string;
  reason: "duplicate" | "invalid-format" | "invalid-value" | "unknown";
};

function splitIngredientParamEntry(entry: string): [string, string] | null {
  if (entry.includes(":")) {
    const [ingredientId, value] = entry.split(":");
    return ingredientId && value ? [ingredientId, value] : null;
  }

  const lastDotIndex = entry.lastIndexOf(".");

  if (lastDotIndex <= 0 || lastDotIndex === entry.length - 1) {
    return null;
  }

  return [entry.slice(0, lastDotIndex), entry.slice(lastDotIndex + 1)];
}

function parseIngredientSearchParam(rawParam: string): {
  invalidParams: InvalidIngredientParam[];
  parsedParams: ParsedIngredientParam[];
} {
  const parsedParams: ParsedIngredientParam[] = [];
  const invalidParams: InvalidIngredientParam[] = [];
  const usedIngredientIds = new Set<IngredientId>();

  rawParam
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .forEach((entry) => {
      const paramEntry = splitIngredientParamEntry(entry);

      if (!paramEntry) {
        invalidParams.push({
          rawValue: entry,
          reason: "invalid-format",
        });
        return;
      }

      const [rawIngredientId, rawValue] = paramEntry;
      const ingredientId = decodeURIComponent(rawIngredientId) as IngredientId;
      const value = Number(rawValue);

      if (!Number.isFinite(value) || value <= 0) {
        invalidParams.push({
          rawValue: entry,
          reason: "invalid-value",
        });
        return;
      }

      if (usedIngredientIds.has(ingredientId)) {
        invalidParams.push({
          rawValue: entry,
          reason: "duplicate",
        });
        return;
      }

      usedIngredientIds.add(ingredientId);
      parsedParams.push({
        ingredientId,
        value,
      });
    });

  return {
    invalidParams,
    parsedParams,
  };
}

export function useBibimCraftResultIngredientsQuery() {
  const [searchParams] = useSearchParams();
  const ingredientsQuery = useIngredientsQuery();
  const rawIngredientsParam =
    searchParams.get(INGREDIENTS_SEARCH_PARAM) ??
    searchParams.get(LEGACY_INGREDIENTS_SEARCH_PARAM) ??
    "";
  const parsedIngredientSearchParam = useMemo(
    () => parseIngredientSearchParam(rawIngredientsParam),
    [rawIngredientsParam],
  );

  return useMemo(() => {
    const invalidParams = [...parsedIngredientSearchParam.invalidParams];
    const ingredients = ingredientsQuery.data;
    const resultIngredients = ingredients
      ? parsedIngredientSearchParam.parsedParams.flatMap(
          ({ ingredientId, value }, order) => {
            const ingredient = ingredients[ingredientId];

            if (!ingredient) {
              invalidParams.push({
                rawValue: `${ingredientId}:${value}`,
                reason: "unknown",
              });
              return [];
            }

            return [
              {
                ingredient,
                ingredientId,
                order,
                value,
              },
            ];
          },
        )
      : [];
    const totalValue = resultIngredients.reduce(
      (total, item) => total + item.value,
      0,
    );

    return {
      ...ingredientsQuery,
      data: resultIngredients,
      invalidParams,
      isEmpty: resultIngredients.length === 0,
      isInvalidTotalValue: totalValue > MAX_TOTAL_VALUE,
      rawIngredientsParam,
      totalValue,
    };
  }, [ingredientsQuery, parsedIngredientSearchParam, rawIngredientsParam]);
}
