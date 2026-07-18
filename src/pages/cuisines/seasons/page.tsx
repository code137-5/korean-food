import { useRouteTransitionNavigate } from "@/app/routes/use-route-transition-navigate";
import { ArrowLeft } from "lucide-react";
import { useSeasonCuisineSelection } from "@/pages/cuisines/seasons/model/use-season-cuisine-selection";
import { CuisineNavigation } from "@/pages/cuisines/seasons/ui/cuisine-navigation";
import { ProgressStatus } from "@/pages/cuisines/seasons/ui/progress-status";
import { FoodDetail } from "@/widgets/cuisine-detail";
import { TexturedButton, TexturedPanel } from "@/shared/ui/textured-ui";

export function SeasonCuisinePage() {
  const navigate = useRouteTransitionNavigate();
  const {
    items,
    selectedIndex,
    selectedCuisineCode,
    selectPreviousCuisine,
    selectNextCuisine,
  } = useSeasonCuisineSelection();

  return (
    <>
      <div className="absolute left-6 top-6 pointer-events-auto">
        <TexturedButton size="md" variant="dark" onClick={() => navigate("/")}>
          <ArrowLeft className="size-8 text-[#F1E1C3]" aria-hidden="true" />
          <div className="px-4">뒤로가기</div>
        </TexturedButton>
      </div>
      <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-auto">
        <ProgressStatus count={items.length} selectedIndex={selectedIndex} />
      </div>
      <TexturedPanel
        variant="ink"
        className="absolute -right-6 h-[95%] w-[60%] px-36 pt-16 pb-20 pointer-events-auto"
      >
        <FoodDetail cuisineCode={selectedCuisineCode} />
        <CuisineNavigation
          selectedIndex={selectedIndex}
          itemCount={items.length}
          onPrevious={selectPreviousCuisine}
          onNext={selectNextCuisine}
          className="relative z-40"
        />
      </TexturedPanel>
      {/* <div className="absolute flex flex-col justify-center items-center h-full w-full overflow-visible">
          <TexturedPanel
            variant="ink"
            className="absolute w-[130%] h-[130%] mt-32"
          />
        </div> */}
    </>
  );
}
