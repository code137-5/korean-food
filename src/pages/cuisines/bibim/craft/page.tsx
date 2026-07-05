import { DetailPanelHeader } from "@/shared/ui/detail-panel";
import {
  PaperTile,
  TexturedButton,
  TexturedPanel,
} from "@/shared/ui/textured-ui";
import { PieCharts } from "@/widgets/common/piecharts";
import DraggablePiecharts from "@/widgets/common/piecharts-draggable";
import { PieChartsTest } from "@/widgets/common/piecharts-test";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ButtonBackward() {
  const navigate = useNavigate();
  return (
    <TexturedButton
      size="md"
      variant="dark"
      onClick={() => navigate("/")}
      className="w-full h-16"
    >
      <ArrowLeft className="size-8 text-[#F1E1C3]" aria-hidden="true" />
      <div className="px-4">뒤로가기</div>
    </TexturedButton>
  );
}

function IngredientCategories() {
  return (
    <TexturedPanel
      className="w-full min-h-0 grow flex flex-col gap-1 p-4 overflow-y-scroll       [&::-webkit-scrollbar]:w-3
      [&::-webkit-scrollbar-track]:bg-transparent
      [&::-webkit-scrollbar-thumb]:bg-zinc-500
      [&::-webkit-scrollbar-thumb]:rounded-full"
      variant="golden"
    >
      <TexturedButton size="sm">{"나물"}</TexturedButton>
      <TexturedButton size="sm">{"나물"}</TexturedButton>
      <TexturedButton size="sm">{"나물"}</TexturedButton>
      <TexturedButton size="sm">{"나물"}</TexturedButton>
    </TexturedPanel>
  );
}

function IngredientBag() {
  return (
    <TexturedPanel variant="golden" className="w-full h-80"></TexturedPanel>
  );
}

function IngredientDiagram() {
  return (
    <div className="h-full w-full pointer-events-auto flex flex-col py-4">
      <DetailPanelHeader title="비빔밥 재료 선택" text="dark" />
      {/* <PieCharts /> */}
      {/* <PieChartsTest /> */}
      <DraggablePiecharts />
    </div>
  );
}

export function BibimCraftPage() {
  return (
    <div className="absolute inset-0 flex flex-row items-center gap-6 p-4 pointer-events-none">
      <div className="relative z-20 h-full w-64 pointer-events-auto">
        <div className="relative flex h-full flex-col gap-4">
          <ButtonBackward />
          <IngredientCategories />
          <IngredientBag />
        </div>
      </div>

      <TexturedPanel
        variant="felt"
        className="relative z-10 h-[95%] grow p-8 pointer-events-auto"
      >
        <IngredientDiagram />
      </TexturedPanel>

      <TexturedPanel className="relative z-20 h-[90%] p-4 grid grid-cols-4 content-start gap-1 pointer-events-auto">
        <PaperTile className="block w-28 aspect-2/3" />
        <PaperTile className="block w-28 aspect-2/3" />
        <PaperTile className="block w-28 aspect-2/3" />
        <PaperTile className="block w-28 aspect-2/3" />
        <PaperTile className="block w-28 aspect-2/3" />
        <PaperTile className="block w-28 aspect-2/3" />
        <PaperTile className="block w-28 aspect-2/3" />
      </TexturedPanel>
    </div>
  );
}
