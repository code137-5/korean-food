import { create } from "zustand";
import type { FoodItem } from "@/entities/season/model/types";

type CuisineSelectionState = {
  items: FoodItem[];
  selectedIndex: number;
  registerCuisineItems: (items: FoodItem[]) => void;
  clearCuisineItems: () => void;
  setSelectedCuisineIndex: (index: number) => void;
  selectPreviousCuisine: () => void;
  selectNextCuisine: () => void;
};

function clampIndex(index: number, length: number) {
  if (length <= 0) {
    return 0;
  }

  return Math.min(Math.max(index, 0), length - 1);
}

function hasSameCuisineCodes(currentItems: FoodItem[], nextItems: FoodItem[]) {
  return (
    currentItems.length === nextItems.length &&
    currentItems.every((item, index) => item.code === nextItems[index]?.code)
  );
}

export const useCuisineSelectionStore = create<CuisineSelectionState>(
  (set) => ({
    items: [],
    selectedIndex: 0,
    registerCuisineItems: (items) =>
      set((state) => {
        const selectedIndex = hasSameCuisineCodes(state.items, items)
          ? clampIndex(state.selectedIndex, items.length)
          : 0;

        return {
          items,
          selectedIndex,
        };
      }),
    clearCuisineItems: () =>
      set({
        items: [],
        selectedIndex: 0,
      }),
    setSelectedCuisineIndex: (index) =>
      set((state) => ({
        selectedIndex: clampIndex(index, state.items.length),
      })),
    selectPreviousCuisine: () =>
      set((state) => ({
        selectedIndex: clampIndex(state.selectedIndex - 1, state.items.length),
      })),
    selectNextCuisine: () =>
      set((state) => ({
        selectedIndex: clampIndex(state.selectedIndex + 1, state.items.length),
      })),
  }),
);
