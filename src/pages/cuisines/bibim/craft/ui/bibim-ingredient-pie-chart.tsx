import { EditablePieChart } from "@/widgets/common/piecharts-draggable";
import { useBibimIngredientPieChart } from "../model/use-bibim-ingredient-pie-chart";

export function BibimIngredientPieChart() {
  const {
    getMinIngredientValue,
    minIngredientValue,
    pieData,
    handlePieDataChange,
  } = useBibimIngredientPieChart();
  const pieDataKey = pieData
    .map((datum) => `${datum.id}:${datum.name}`)
    .join("|");

  return (
    <div className="relative h-full aspect-square max-h-full max-w-full">
      <EditablePieChart
        key={pieDataKey}
        getMinValue={getMinIngredientValue}
        initialData={pieData}
        minValue={minIngredientValue}
        onChange={handlePieDataChange}
      />
    </div>
  );
}
