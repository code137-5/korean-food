import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { DetailPanelDivider } from "./detail-panel-divider";
import { cn } from "@/lib/utils";

type DetailPanelHeaderProps = {
  title: string;
  text?: TextColorVariant;
  subtitle?: string;
  eyebrow?: ReactNode;
  marker?: ReactNode;
};

type TextColorVariant = "bright" | "dark";

const TextColor = {
  bright: "text-[#f3ead7]",
  dark: "textd-[#000000]",
};

export function DetailPanelHeader({
  title,
  subtitle,
  eyebrow,
  text = "bright",
  marker,
}: DetailPanelHeaderProps) {
  return (
    <header className="text-center">
      {eyebrow ? (
        <Badge
          variant="outline"
          className="mb-5 border-[#9f793e]/80 bg-[#20160d]/70 px-3 py-1 text-[#d7ae67]"
        >
          {eyebrow}
        </Badge>
      ) : null}

      <h1
        className={cn(
          TextColor[text],
          "text-7xl font-semibold tracking-[0.08em]",
        )}
      >
        {title}
      </h1>

      {subtitle ? (
        <p className="mt-6 text-2xl text-[#d3a96b]">{subtitle}</p>
      ) : null}

      <DetailPanelDivider marker={marker} />
    </header>
  );
}
