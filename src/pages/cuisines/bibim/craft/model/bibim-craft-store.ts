import type { IngredientCategoryCode } from "@/entities/ingredient";
import { create } from "zustand";

type BibimCraftState = {
  selectedIngredientCategoryCode: IngredientCategoryCode | null;
  setSelectedIngredientCategoryCode: (
    categoryCode: IngredientCategoryCode,
  ) => void;
  clearSelectedIngredientCategoryCode: () => void;
};

export const useBibimCraftStore = create<BibimCraftState>((set) => ({
  selectedIngredientCategoryCode: null,
  setSelectedIngredientCategoryCode: (categoryCode) =>
    set({ selectedIngredientCategoryCode: categoryCode }),
  clearSelectedIngredientCategoryCode: () =>
    set({ selectedIngredientCategoryCode: null }),
}));
