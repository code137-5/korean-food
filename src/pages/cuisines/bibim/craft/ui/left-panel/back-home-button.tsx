import { TexturedButton } from "@/shared/ui/textured-ui";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function BackHomeButton() {
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
