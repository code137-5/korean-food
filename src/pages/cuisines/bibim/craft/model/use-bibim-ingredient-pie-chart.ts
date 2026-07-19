import { useCallback, useMemo } from "react";
import type { IngredientId } from "@/entities/ingredient";
import type { PieDatum } from "@/widgets/common/piecharts-draggable";
import { useTranslation } from "react-i18next";
import {
  EMPTY_INGREDIENT_PIE_ITEM_ID,
  useBibimCraftStore,
} from "./bibim-craft-store";

const MIN_INGREDIENT_VALUE = 15;
const MIN_EMPTY_INGREDIENT_VALUE = 0;

export function useBibimIngredientPieChart() {
  const { t } = useTranslation("ingredient");
  const ingredientPieItems = useBibimCraftStore(
    (state) => state.ingredientPieItems,
  );
  const setIngredientPieItemsFromChartItems = useBibimCraftStore(
    (state) => state.setIngredientPieItemsFromChartItems,
  );
  const pieData = useMemo<PieDatum[]>(
    () =>
      [...ingredientPieItems]
        .sort((left, right) => left.order - right.order)
        .filter((item) => item.value > 0)
        .map((item) => ({
          id: item.ingredientId,
          name: t(item.nameKey),
          thumbnailImageUrl: item.thumbnailImageUrl,
          value: item.value,
          fill: item.color,
        })),
    [ingredientPieItems, t],
  );
  const totalValue = useMemo(
    () => pieData.reduce((total, item) => total + item.value, 0),
    [pieData],
  );

  const handlePieDataChange = useCallback(
    (nextData: PieDatum[]) => {
      setIngredientPieItemsFromChartItems(
        nextData.map((datum) => ({
          id: datum.id as IngredientId,
          value: datum.value,
        })),
      );
    },
    [setIngredientPieItemsFromChartItems],
  );
  const getMinIngredientValue = useCallback((datum: PieDatum) => {
    if (datum.id === EMPTY_INGREDIENT_PIE_ITEM_ID) {
      return MIN_EMPTY_INGREDIENT_VALUE;
    }

    return MIN_INGREDIENT_VALUE;
  }, []);

  return {
    getMinIngredientValue,
    minIngredientValue: MIN_INGREDIENT_VALUE,
    pieData,
    totalValue,
    handlePieDataChange,
  };
}
