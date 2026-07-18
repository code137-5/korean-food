import { BackRouteButton } from "@/widgets/common/back-route-button";
import { IngredientBag } from "./ingredient-bag";
import { IngredientCategories } from "./ingredient-categories";

export function BibimCraftLeftPanel() {
  return (
    <aside className="relative z-20 h-full w-64 pointer-events-auto">
      <div className="relative flex h-full flex-col gap-4">
        <BackRouteButton url="/" className="w-full h-16" />
        <IngredientCategories />
        <IngredientBag />
      </div>
    </aside>
  );
}
