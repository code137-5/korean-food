import { DetailPanelHeader } from "@/shared/ui/detail-panel";
import { BibimIngredientPieChart } from "../bibim-ingredient-pie-chart";

export function IngredientDiagram() {
  return (
    <div className="h-full w-full pointer-events-auto flex flex-col py-4">
      <DetailPanelHeader title="비빔밥 재료 선택" text="dark" />
      <div className="flex-1 min-h-0 flex items-center justify-center">
        <BibimIngredientPieChart />
      </div>
    </div>
  );
}
