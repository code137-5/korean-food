import { BackHomeButton } from "./back-home-button";
import { IngredientBag } from "./ingredient-bag";
import { IngredientCategories } from "./ingredient-categories";

export function BibimCraftLeftPanel() {
  return (
    <aside className="relative z-20 h-full w-64 pointer-events-auto">
      <div className="relative flex h-full flex-col gap-4">
        <BackHomeButton />
        <IngredientCategories />
        <IngredientBag />
      </div>
    </aside>
  );
}
