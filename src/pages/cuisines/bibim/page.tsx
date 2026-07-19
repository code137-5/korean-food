import { useRouteTransitionNavigate } from "@/app/routes/use-route-transition-navigate";
import { TexturedButton, TexturedPanel } from "@/shared/ui/textured-ui";
import { FoodDetail } from "@/widgets/cuisine-detail";
import { useTranslation } from "react-i18next";

export function BibimCuisinePage() {
  const navigate = useRouteTransitionNavigate();
  const { t } = useTranslation("bibim-cuisine");

  return (
    <>
      <TexturedPanel
        variant="ink"
        className="absolute -right-6 h-[95%] w-[60%] px-36 pt-16 pb-20 pointer-events-auto flex flex-col"
      >
        <FoodDetail cuisineCode="bibimbap" />
        <div className="flex justify-center pt-8">
          <TexturedButton
            size="lg"
            variant="dark"
            className="h-20 min-w-96 justify-center px-12 text-2xl text-[#f4e4c7]"
            onClick={() => navigate("/cuisines/bibim/craft")}
          >
            {t("actions.makeBibimbap")}
          </TexturedButton>
        </div>
      </TexturedPanel>
    </>
  );
}
