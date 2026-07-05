import { EditablePieChart } from "@/widgets/common/piecharts-draggable";
import { useBibimIngredientPieChart } from "../model/use-bibim-ingredient-pie-chart";

export function BibimIngredientPieChart() {
  const { minIngredientValue, pieData, handlePieDataChange } =
    useBibimIngredientPieChart();

  return (
    <div
      style={{
        position: "relative",
        width: 480,
      }}
    >
      <EditablePieChart
        initialData={pieData}
        minValue={minIngredientValue}
        onChange={handlePieDataChange}
      />
    </div>
  );
}
