import { useRouteTransitionNavigate } from "@/app/routes/use-route-transition-navigate";
import { TexturedButton } from "@/shared/ui/textured-ui";
import { ArrowLeft } from "lucide-react";

interface BackRouteButtonProps {
  url: string;
  className?: string;
  label?: string;
}

export function BackRouteButton({
  url,
  className,
  label = "뒤로가기",
}: BackRouteButtonProps) {
  const navigate = useRouteTransitionNavigate();

  return (
    <TexturedButton
      size="md"
      variant="dark"
      onClick={() => navigate(url)}
      className={className}
    >
      <ArrowLeft className="size-8 text-[#F1E1C3]" aria-hidden="true" />
      <div className="px-4">{label}</div>
    </TexturedButton>
  );
}
