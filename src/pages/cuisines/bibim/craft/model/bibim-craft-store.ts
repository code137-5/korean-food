import type {
  Ingredient,
  IngredientCategoryCode,
  IngredientId,
} from "@/entities/ingredient";
import { create } from "zustand";

const DEFAULT_INGREDIENT_PIE_ITEM_VALUE = 15;
const MIN_INGREDIENT_PIE_ITEM_VALUE = 15;
const MAX_INGREDIENT_PIE_ITEMS_VALUE = 100;
const DEFAULT_INGREDIENT_PIE_ITEM_COLOR = "#7fb069";
export const EMPTY_INGREDIENT_PIE_ITEM_ID = "__empty__" as IngredientId;
const EMPTY_INGREDIENT_PIE_ITEM_NAME_KEY = "empty.name";
const EMPTY_INGREDIENT_PIE_ITEM_COLOR = "#d8c8a8";

type IngredientFlagMap = Record<IngredientId, boolean>;

export type BibimCraftIngredientPieItem = {
  ingredientId: IngredientId;
  nameKey: string;
  value: number;
  order: number;
  color: string;
};

export type BibimCraftIngredientPieChartItem = {
  id: IngredientId;
  value: number;
};

function isEmptyIngredientPieItem(item: BibimCraftIngredientPieItem): boolean {
  return item.ingredientId === EMPTY_INGREDIENT_PIE_ITEM_ID;
}

function createEmptyIngredientPieItem(
  order: number,
  value: number,
): BibimCraftIngredientPieItem {
  return {
    ingredientId: EMPTY_INGREDIENT_PIE_ITEM_ID,
    nameKey: EMPTY_INGREDIENT_PIE_ITEM_NAME_KEY,
    value,
    order,
    color: EMPTY_INGREDIENT_PIE_ITEM_COLOR,
  };
}

function normalizeIngredientPieItemOrder(
  items: BibimCraftIngredientPieItem[],
): BibimCraftIngredientPieItem[] {
  return items.map((item, index) => ({
    ...item,
    order: index,
  }));
}

function sortIngredientPieItems(
  items: BibimCraftIngredientPieItem[],
): BibimCraftIngredientPieItem[] {
  return [...items].sort((left, right) => left.order - right.order);
}

function getSelectedIngredientPieItemsTotalValue(
  items: BibimCraftIngredientPieItem[],
): number {
  return items
    .filter((item) => !isEmptyIngredientPieItem(item))
    .reduce((total, item) => total + item.value, 0);
}

function clampIngredientPieItemValue(
  value: number,
  otherItemsTotalValue: number,
): number {
  const maxValue = MAX_INGREDIENT_PIE_ITEMS_VALUE - otherItemsTotalValue;

  return Math.min(Math.max(value, MIN_INGREDIENT_PIE_ITEM_VALUE), maxValue);
}

function createIngredientPieItem(
  ingredient: Ingredient,
  order: number,
  value: number,
): BibimCraftIngredientPieItem {
  return {
    ingredientId: ingredient.id,
    nameKey: ingredient.nameKey,
    value,
    order,
    color: ingredient.color ?? DEFAULT_INGREDIENT_PIE_ITEM_COLOR,
  };
}

function syncEmptyIngredientPieItem(
  items: BibimCraftIngredientPieItem[],
): BibimCraftIngredientPieItem[] {
  const orderedItems = sortIngredientPieItems(items);
  const selectedItemsTotalValue =
    getSelectedIngredientPieItemsTotalValue(orderedItems);
  const emptyValue = Math.max(
    MAX_INGREDIENT_PIE_ITEMS_VALUE - selectedItemsTotalValue,
    0,
  );
  const hasEmptyItem = orderedItems.some(isEmptyIngredientPieItem);
  const nextItems = hasEmptyItem
    ? orderedItems.map((item) =>
        isEmptyIngredientPieItem(item)
          ? {
              ...item,
              value: emptyValue,
            }
          : item,
      )
    : [
        ...orderedItems,
        createEmptyIngredientPieItem(orderedItems.length, emptyValue),
      ];

  return normalizeIngredientPieItemOrder(nextItems);
}

function setIngredientPieItemSelected(
  items: BibimCraftIngredientPieItem[],
  ingredient: Ingredient,
  isSelected: boolean,
): BibimCraftIngredientPieItem[] {
  const orderedItems = sortIngredientPieItems(items);
  const hasItem = orderedItems.some(
    (item) => item.ingredientId === ingredient.id,
  );

  if (isSelected && !hasItem) {
    const remainingValue =
      MAX_INGREDIENT_PIE_ITEMS_VALUE -
      getSelectedIngredientPieItemsTotalValue(orderedItems);

    if (remainingValue < MIN_INGREDIENT_PIE_ITEM_VALUE) {
      return orderedItems;
    }

    return syncEmptyIngredientPieItem(
      normalizeIngredientPieItemOrder([
        ...orderedItems,
        createIngredientPieItem(
          ingredient,
          orderedItems.length,
          Math.min(DEFAULT_INGREDIENT_PIE_ITEM_VALUE, remainingValue),
        ),
      ]),
    );
  }

  if (!isSelected && hasItem) {
    return syncEmptyIngredientPieItem(
      normalizeIngredientPieItemOrder(
        orderedItems.filter((item) => item.ingredientId !== ingredient.id),
      ),
    );
  }

  return orderedItems;
}

function updateIngredientPieItemsFromChartItems(
  currentItems: BibimCraftIngredientPieItem[],
  chartItems: BibimCraftIngredientPieChartItem[],
): BibimCraftIngredientPieItem[] {
  const currentItemsById = new Map(
    currentItems.map((item) => [item.ingredientId, item]),
  );
  const nextItems = chartItems.flatMap((chartItem, index) => {
    const currentItem = currentItemsById.get(chartItem.id);

    if (!currentItem) {
      return [];
    }

    return [
      {
        ...currentItem,
        order: index,
        value: chartItem.value,
      },
    ];
  });
  const missingItems = sortIngredientPieItems(currentItems).filter(
    (item) => !chartItems.some((chartItem) => chartItem.id === item.ingredientId),
  );

  return syncEmptyIngredientPieItem([...nextItems, ...missingItems]);
}

type BibimCraftState = {
  selectedIngredientCategoryCode: IngredientCategoryCode | null;
  ingredientFlags: IngredientFlagMap;
  ingredientPieItems: BibimCraftIngredientPieItem[];
  setSelectedIngredientCategoryCode: (
    categoryCode: IngredientCategoryCode,
  ) => void;
  clearSelectedIngredientCategoryCode: () => void;
  registerIngredientFlags: (ingredientIds: IngredientId[]) => void;
  setIngredientFlag: (ingredientId: IngredientId, value: boolean) => void;
  toggleIngredientFlag: (ingredientId: IngredientId) => void;
  clearIngredientFlags: () => void;
  setIngredientSelection: (ingredient: Ingredient, value: boolean) => void;
  toggleIngredientSelection: (ingredient: Ingredient) => void;
  setIngredientPieItemValue: (
    ingredientId: IngredientId,
    value: number,
  ) => void;
  setIngredientPieItemsFromChartItems: (
    chartItems: BibimCraftIngredientPieChartItem[],
  ) => void;
  reorderIngredientPieItems: (ingredientIds: IngredientId[]) => void;
  clearIngredientPieItems: () => void;
};

export const useBibimCraftStore = create<BibimCraftState>((set) => ({
  selectedIngredientCategoryCode: null,
  ingredientFlags: {},
  ingredientPieItems: [createEmptyIngredientPieItem(0, 100)],
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
    set((state) => {
      const hasPieItem = state.ingredientPieItems.some(
        (item) => item.ingredientId === ingredientId,
      );
      const nextValue = value && hasPieItem;

      return {
        ingredientFlags: {
          ...state.ingredientFlags,
          [ingredientId]: nextValue,
        },
      ingredientPieItems: value
        ? state.ingredientPieItems
        : syncEmptyIngredientPieItem(
            normalizeIngredientPieItemOrder(
              state.ingredientPieItems.filter(
                (item) => item.ingredientId !== ingredientId,
              ),
            ),
          ),
      };
    }),
  toggleIngredientFlag: (ingredientId) =>
    set((state) => {
      const nextValue = !(state.ingredientFlags[ingredientId] ?? false);
      const hasPieItem = state.ingredientPieItems.some(
        (item) => item.ingredientId === ingredientId,
      );
      const nextFlagValue = nextValue && hasPieItem;

      return {
        ingredientFlags: {
          ...state.ingredientFlags,
          [ingredientId]: nextFlagValue,
        },
        ingredientPieItems: nextValue
          ? state.ingredientPieItems
          : syncEmptyIngredientPieItem(
              normalizeIngredientPieItemOrder(
                state.ingredientPieItems.filter(
                  (item) => item.ingredientId !== ingredientId,
                ),
              ),
            ),
      };
    }),
  clearIngredientFlags: () =>
    set({
      ingredientFlags: {},
      ingredientPieItems: [createEmptyIngredientPieItem(0, 100)],
    }),
  setIngredientSelection: (ingredient, value) =>
    set((state) => {
      const nextIngredientPieItems = setIngredientPieItemSelected(
        state.ingredientPieItems,
        ingredient,
        value,
      );
      const hasSelectedPieItem = nextIngredientPieItems.some(
        (item) => item.ingredientId === ingredient.id,
      );
      const nextValue = value && hasSelectedPieItem;

      return {
        ingredientFlags: {
          ...state.ingredientFlags,
          [ingredient.id]: nextValue,
        },
        ingredientPieItems: nextIngredientPieItems,
      };
    }),
  toggleIngredientSelection: (ingredient) =>
    set((state) => {
      const nextValue = !(state.ingredientFlags[ingredient.id] ?? false);
      const nextIngredientPieItems = setIngredientPieItemSelected(
        state.ingredientPieItems,
        ingredient,
        nextValue,
      );
      const hasSelectedPieItem = nextIngredientPieItems.some(
        (item) => item.ingredientId === ingredient.id,
      );
      const nextFlagValue = nextValue && hasSelectedPieItem;

      return {
        ingredientFlags: {
          ...state.ingredientFlags,
          [ingredient.id]: nextFlagValue,
        },
        ingredientPieItems: nextIngredientPieItems,
      };
    }),
  setIngredientPieItemValue: (ingredientId, value) =>
    set((state) => ({
      ingredientPieItems: syncEmptyIngredientPieItem(
        state.ingredientPieItems.map((item) => {
          if (item.ingredientId !== ingredientId) {
            return item;
          }

          const otherItemsTotalValue = state.ingredientPieItems.reduce(
            (total, currentItem) =>
              currentItem.ingredientId === ingredientId ||
              isEmptyIngredientPieItem(currentItem)
                ? total
                : total + currentItem.value,
            0,
          );

          return {
            ...item,
            value: clampIngredientPieItemValue(value, otherItemsTotalValue),
          };
        }),
      ),
    })),
  setIngredientPieItemsFromChartItems: (chartItems) =>
    set((state) => ({
      ingredientPieItems: updateIngredientPieItemsFromChartItems(
        state.ingredientPieItems,
        chartItems,
      ),
    })),
  reorderIngredientPieItems: (ingredientIds) =>
    set((state) => {
      const itemsByIngredientId = new Map(
        state.ingredientPieItems.map((item) => [item.ingredientId, item]),
      );
      const orderedItems = ingredientIds.flatMap((ingredientId) => {
        const item = itemsByIngredientId.get(ingredientId);
        return item ? [item] : [];
      });
      const remainingItems = sortIngredientPieItems(
        state.ingredientPieItems,
      ).filter((item) => !ingredientIds.includes(item.ingredientId));

      return {
        ingredientPieItems: syncEmptyIngredientPieItem(
          normalizeIngredientPieItemOrder([...orderedItems, ...remainingItems]),
        ),
      };
    }),
  clearIngredientPieItems: () =>
    set({
      ingredientFlags: {},
      ingredientPieItems: [createEmptyIngredientPieItem(0, 100)],
    }),
}));
