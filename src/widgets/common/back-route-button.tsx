import { useRouteTransitionNavigate } from "@/app/routes/use-route-transition-navigate";
import { TexturedButton } from "@/shared/ui/textured-ui";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

interface BackRouteButtonProps {
  url: string;
  className?: string;
  label?: string;
}

export function BackRouteButton({
  url,
  className,
  label,
}: BackRouteButtonProps) {
  const navigate = useRouteTransitionNavigate();
  const { t } = useTranslation("bibim-cuisine");
  const buttonLabel = label ?? t("navigation.back");

  return (
    <TexturedButton
      size="md"
      variant="dark"
      onClick={() => navigate(url)}
      className={className}
    >
      <ArrowLeft className="size-8 text-[#F1E1C3]" aria-hidden="true" />
      <div className="px-4">{buttonLabel}</div>
    </TexturedButton>
  );
}
