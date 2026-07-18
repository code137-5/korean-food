import { useRouteTransitionNavigate } from "@/app/routes/use-route-transition-navigate";
import { TexturedButton } from "@/shared/ui/textured-ui";
import { ArrowLeft } from "lucide-react";

export function BackHomeButton() {
  const navigate = useRouteTransitionNavigate();

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
