import type { IngredientCategoryCode, IngredientId } from "@/entities/ingredient";
import { create } from "zustand";

type IngredientFlagMap = Record<IngredientId, boolean>;

type BibimCraftState = {
  selectedIngredientCategoryCode: IngredientCategoryCode | null;
  ingredientFlags: IngredientFlagMap;
  setSelectedIngredientCategoryCode: (
    categoryCode: IngredientCategoryCode,
  ) => void;
  clearSelectedIngredientCategoryCode: () => void;
  registerIngredientFlags: (ingredientIds: IngredientId[]) => void;
  setIngredientFlag: (ingredientId: IngredientId, value: boolean) => void;
  toggleIngredientFlag: (ingredientId: IngredientId) => void;
  clearIngredientFlags: () => void;
};

export const useBibimCraftStore = create<BibimCraftState>((set) => ({
  selectedIngredientCategoryCode: null,
  ingredientFlags: {},
  setSelectedIngredientCategoryCode: (categoryCode) =>
    set({ selectedIngredientCategoryCode: categoryCode }),
  clearSelectedIngredientCategoryCode: () =>
    set({ selectedIngredientCategoryCode: null }),
  registerIngredientFlags: (ingredientIds) =>
    set((state) => {
      const nextIngredientFlags = { ...state.ingredientFlags };
      let hasNewIngredientFlag = false;

      ingredientIds.forEach((ingredientId) => {
        if (nextIngredientFlags[ingredientId] === undefined) {
          nextIngredientFlags[ingredientId] = false;
          hasNewIngredientFlag = true;
        }
      });

      return hasNewIngredientFlag
        ? { ingredientFlags: nextIngredientFlags }
        : state;
    }),
  setIngredientFlag: (ingredientId, value) =>
    set((state) => ({
      ingredientFlags: {
        ...state.ingredientFlags,
        [ingredientId]: value,
      },
    })),
  toggleIngredientFlag: (ingredientId) =>
    set((state) => ({
      ingredientFlags: {
        ...state.ingredientFlags,
        [ingredientId]: !state.ingredientFlags[ingredientId],
      },
    })),
  clearIngredientFlags: () => set({ ingredientFlags: {} }),
}));
