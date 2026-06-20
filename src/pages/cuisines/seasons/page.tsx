import { useParams } from "react-router-dom";
import {
  SEASONS,
  useSeasonCuisineItemsQuery,
  type Season,
} from "@/entities/season";
import { FoodDetail } from "@/widgets/cuisine-detail";

function isSeason(value: string | undefined): value is Season {
  return !!value && SEASONS.includes(value as Season);
}

function ProgressCircle() {
  return (
    <div className="relative z-10 h-4 w-4 rounded-full bg-black/70 border-2 border-stone-200/90 shadow-[0_0_8px_rgba(255,235,194,0.25)]" />
  );
}

function ProgressCircleGlow() {
  return (
    <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#f9d99c] bg-[#7a4f22] shadow-[0_0_20px_rgba(255,207,126,0.9)]">
      <div className="h-8 w-8 rounded-full border-2 border-[#fff3d1] bg-[#f6dba1] shadow-[inset_0_0_8px_rgba(92,54,19,0.35)]" />
    </div>
  );
}

function ProgressStatus() {
  return (
    <div className="relative  bg-[#3a2414]  w-16  py-8 ">
      <div className="absolute left-1/2 top-0 h-full w-[3px] -translate-x-1/2 rounded-full bg-stone-200/60 shadow-[0_0_10px_rgba(255,244,220,0.35)]" />
      <div className="flex flex-col items-center justify-between gap-8">
        <ProgressCircle />
        <ProgressCircle />
        <ProgressCircle />
        <ProgressCircleGlow />
        <ProgressCircle />
        <ProgressCircle />
        <ProgressCircle />
      </div>
    </div>
  );
}

export function SeasonCuisinePage() {
  const { season } = useParams();
  const selectedSeason = isSeason(season) ? season : null;
  const { data: cuisineItems } = useSeasonCuisineItemsQuery(selectedSeason);
  const selectedCuisineCode = cuisineItems[0]?.code ?? null;

  return (
    <>
      <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-auto">
        <ProgressStatus />
      </div>
      <div className="absolute right-2 top-2 h-[82%] w-[55%] pointer-events-auto">
        <FoodDetail cuisineCode={selectedCuisineCode} />
        <div className="w-full flex flex-row justify-between">
          <div className="w-30 h-20 bg-amber-500 cursor-pointer"></div>
          <div className="w-30 h-20 bg-amber-500 cursor-pointer"></div>
        </div>
      </div>
    </>
  );
}
