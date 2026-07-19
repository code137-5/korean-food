import { FillImage } from "@/shared/ui/fill-image";
import { TexturedPanel } from "@/shared/ui/textured-ui";
import { EMPTY_INGREDIENT_PIE_ITEM_ID } from "../../model/bibim-craft-store";
import { useBibimIngredientPieChart } from "../../model/use-bibim-ingredient-pie-chart";

export function IngredientBag() {
  const { pieData, totalValue } = useBibimIngredientPieChart();
  const visiblePieData = pieData.filter(
    (item) => item.id !== EMPTY_INGREDIENT_PIE_ITEM_ID,
  );

  return (
    <TexturedPanel variant="golden" className="w-full h-80 p-4 overflow-y-auto">
      <div className="grid gap-2">
        {visiblePieData.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-3 text-sm font-semibold text-white"
          >
            <span className="flex min-w-0 items-center gap-2">
              {item.thumbnailImageUrl ? (
                <span className="size-8 shrink-0">
                  <FillImage
                    alt=""
                    className="object-contain"
                    draggable={false}
                    src={item.thumbnailImageUrl}
                  />
                </span>
              ) : null}
              <span className="truncate">{item.name}</span>
            </span>
            <strong className="shrink-0 text-right">
              {totalValue > 0
                ? ((item.value / totalValue) * 100).toFixed(1)
                : "0.0"}
              %
            </strong>
          </div>
        ))}
      </div>
    </TexturedPanel>
  );
}
