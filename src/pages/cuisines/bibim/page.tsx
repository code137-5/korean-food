import { Button } from "@/components/ui/button";
import { FoodDetail } from "@/widgets/cuisine-detail";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function BibimCuisinePage() {
  const navigate = useNavigate();
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
      <div className="absolute right-2 top-2 h-[82%] w-[55%] pointer-events-auto">
        <FoodDetail cuisineCode={"bibimbap"} />
        <Button
          type="button"
          variant="secondary"
          size="lg"
          className="border border-[#9f793e]/70 bg-[#20160d]/80 text-[#e9dcc6] hover:bg-[#2a1d11]"
          onClick={() => navigate("/cuisines/bibim/craft")}
        >
          비빔밥 만들기
        </Button>
      </div>
    </>
  );
}
