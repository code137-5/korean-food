import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { DetailPanelDivider } from "./detail-panel-divider";

type DetailPanelHeaderProps = {
  title: string;
  subtitle?: string;
  eyebrow?: ReactNode;
  marker?: ReactNode;
};

export function DetailPanelHeader({
  title,
  subtitle,
  eyebrow,
  marker,
}: DetailPanelHeaderProps) {
  return (
    <header className="text-center">
      {/* {eyebrow ? (
        <Badge
          variant="outline"
          className="mb-5 border-[#9f793e]/80 bg-[#20160d]/70 px-3 py-1 text-[#d7ae67]"
        >
          {eyebrow}
        </Badge>
      ) : null} */}

      <h1 className="text-7xl font-semibold tracking-[0.08em] text-[#f3ead7]">
        {title}
      </h1>

      {subtitle ? (
        <p className="mt-6 text-2xl text-[#d3a96b]">{subtitle}</p>
      ) : null}

      <DetailPanelDivider marker={marker} />
    </header>
  );
}
