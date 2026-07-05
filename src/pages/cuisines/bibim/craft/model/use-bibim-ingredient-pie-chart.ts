import { useCallback, useMemo, useState } from "react";
import type { PieDatum } from "@/widgets/common/piecharts-draggable";
import type { BibimIngredientChartItem } from "./bibim-ingredient-chart.types";

const MIN_INGREDIENT_VALUE = 3;

const INITIAL_BIBIM_INGREDIENTS: BibimIngredientChartItem[] = [
  {
    code: "rice",
    name: "Rice",
    value: 35,
    color: "#f3ead7",
  },
  {
    code: "namul",
    name: "Namul",
    value: 30,
    color: "#7fb069",
  },
  {
    code: "protein",
    name: "Protein",
    value: 18,
    color: "#c56a45",
  },
  {
    code: "sauce",
    name: "Gochujang",
    value: 10,
    color: "#9f1d20",
  },
  {
    code: "egg",
    name: "Egg",
    value: 7,
    color: "#f2c14e",
  },
];

function toPieDatum(item: BibimIngredientChartItem): PieDatum {
  return {
    id: item.code,
    name: item.name,
    value: item.value,
    fill: item.color,
  };
}

function toIngredientChartItem(
  datum: PieDatum,
  currentItems: BibimIngredientChartItem[],
): BibimIngredientChartItem {
  const currentItem = currentItems.find((item) => item.code === datum.id);

  if (currentItem) {
    return {
      ...currentItem,
      value: datum.value,
    };
  }

  return {
    code: datum.id as BibimIngredientChartItem["code"],
    name: datum.name,
    value: datum.value,
    color: datum.fill,
  };
}

export function useBibimIngredientPieChart() {
  const [items, setItems] = useState(INITIAL_BIBIM_INGREDIENTS);
  const pieData = useMemo(() => items.map(toPieDatum), [items]);
  const totalValue = useMemo(
    () => items.reduce((total, item) => total + item.value, 0),
    [items],
  );

  const handlePieDataChange = useCallback((nextData: PieDatum[]) => {
    setItems((currentItems) =>
      nextData.map((datum) => toIngredientChartItem(datum, currentItems)),
    );
  }, []);

  return {
    items,
    minIngredientValue: MIN_INGREDIENT_VALUE,
    pieData,
    totalValue,
    handlePieDataChange,
  };
}
