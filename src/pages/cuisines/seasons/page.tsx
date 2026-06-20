import { useSeasonCuisineSelection } from "@/pages/cuisines/seasons/model/use-season-cuisine-selection";
import { CuisineNavigation } from "@/pages/cuisines/seasons/ui/cuisine-navigation";
import { ProgressStatus } from "@/pages/cuisines/seasons/ui/progress-status";
import { FoodDetail } from "@/widgets/cuisine-detail";

export function SeasonCuisinePage() {
  const {
    items,
    selectedIndex,
    selectedCuisineCode,
    selectPreviousCuisine,
    selectNextCuisine,
  } = useSeasonCuisineSelection();

  return (
    <>
      <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-auto">
        <ProgressStatus count={items.length} selectedIndex={selectedIndex} />
      </div>
      <div className="absolute right-2 top-2 h-[82%] w-[55%] pointer-events-auto">
        <FoodDetail cuisineCode={selectedCuisineCode} />
        <CuisineNavigation
          selectedIndex={selectedIndex}
          itemCount={items.length}
          onPrevious={selectPreviousCuisine}
          onNext={selectNextCuisine}
        />
      </div>
    </>
  );
}
