import { DetailPanelHeader } from "@/shared/ui/detail-panel";
import { useTranslation } from "react-i18next";
import { BibimIngredientPieChart } from "../bibim-ingredient-pie-chart";

export function IngredientDiagram() {
  const { t } = useTranslation("bibim-cuisine");

  return (
    <div className="h-full w-full pointer-events-auto flex flex-col py-4">
      <DetailPanelHeader title={t("craft.title")} text="dark" />
      <div className="flex-1 min-h-0 flex items-center justify-center">
        <BibimIngredientPieChart />
      </div>
    </div>
  );
}
