import type { IngredientMap } from "@/entities/ingredient/model/types";

export async function getIngredients(): Promise<IngredientMap> {
  const response = await fetch(
    `${import.meta.env.BASE_URL}data/entitities/ingredient.entity.json`,
  );

  if (!response.ok) {
    throw new Error("Failed to load ingredients.");
  }

  return response.json() as Promise<IngredientMap>;
}
