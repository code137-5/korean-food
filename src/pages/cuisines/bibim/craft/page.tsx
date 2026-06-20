import { DetailPanelHeader } from "@/shared/ui/detail-panel";
import { PieCharts } from "@/widgets/common/piecharts";

function ButtonBackward() {
  return <div className="w-full h-16 bg-amber-600"></div>;
}

function IngredientCategories() {
  return (
    <div
      className="w-full min-h-0 grow bg-blue-600 flex flex-col gap-1 p-4 overflow-y-scroll       [&::-webkit-scrollbar]:w-3
      [&::-webkit-scrollbar-track]:bg-transparent
      [&::-webkit-scrollbar-thumb]:bg-zinc-500
      [&::-webkit-scrollbar-thumb]:rounded-full"
    >
      <div className="bg-sky-400 h-8 shrink-0" />
      <div className="bg-sky-400 h-8 shrink-0" />
      <div className="bg-sky-400 h-8 shrink-0" />
      <div className="bg-sky-400 h-8 shrink-0" />
      <div className="bg-sky-400 h-8 shrink-0" />
      <div className="bg-sky-400 h-8 shrink-0" />
      <div className="bg-sky-400 h-8 shrink-0" />
      <div className="bg-sky-400 h-8 shrink-0" />
      <div className="bg-sky-400 h-8 shrink-0" />
      <div className="bg-sky-400 h-8 shrink-0" />
      <div className="bg-sky-400 h-8 shrink-0" />
      <div className="bg-sky-400 h-8 shrink-0" />
    </div>
  );
}

function IngredientBag() {
  return <div className="w-full h-80 bg-green-600"></div>;
}

function IngredientDiagram() {
  return (
    <div className="h-full w-full pointer-events-auto flex flex-col py-4">
      <DetailPanelHeader title="비빔밥 재료 선택" />
      <PieCharts />
    </div>
  );
}

export function BibimCraftPage() {
  return (
    <>
      <div className="absolute left-0 h-full pointer-events-auto">
        <div className="relative w-60 h-full bg-amber-300 flex flex-col">
          <ButtonBackward />
          <IngredientCategories />
          <IngredientBag />
        </div>
      </div>

      <div className="absolute w-[45%] h-[95%] bg-amber-800 left-1/2 translate-x-[-50%] top-1/2 translate-y-[-50%]">
        <IngredientDiagram />
      </div>

      <div className="absolute right-2 top-1/2 translate-y-[-50%] h-[90%] w-[25%] bg-amber-500"></div>
    </>
  );
}
