import { useRouteTransitionNavigate } from "@/app/routes/use-route-transition-navigate";
import { Button } from "@/components/ui/button";
import { TexturedPanel } from "@/shared/ui/textured-ui";
import { FoodDetail } from "@/widgets/cuisine-detail";
import { ArrowLeft } from "lucide-react";

export function BibimCuisinePage() {
  const navigate = useRouteTransitionNavigate();
  return (
    <>
      <div className="absolute left-6 top-6 pointer-events-auto">
        <Button
          type="button"
          variant="secondary"
          size="lg"
          className="border border-[#9f793e]/70 bg-[#20160d]/80 text-[#e9dcc6] hover:bg-[#2a1d11]"
          onClick={() => navigate("/")}
        >
          <ArrowLeft aria-hidden="true" />
          홈으로
        </Button>
      </div>
      <TexturedPanel
        variant="ink"
        className="absolute -right-6 h-[95%] w-[60%] px-36 pt-16 pb-20 pointer-events-auto"
      >
        <FoodDetail cuisineCode={"bibimbap"} />
        <Button
          type="button"
          variant="secondary"
          size="lg"
          className="border pointer-events-auto border-[#9f793e]/70 bg-[#20160d]/80 text-[#e9dcc6] hover:bg-[#2a1d11]"
          onClick={() => navigate("/cuisines/bibim/craft")}
        >
          비빔밥 만들기
        </Button>
      </TexturedPanel>
    </>
  );
}
