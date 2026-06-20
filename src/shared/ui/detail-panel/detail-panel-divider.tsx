import type { ReactNode } from "react";
import { Separator } from "@/components/ui/separator";

type DetailPanelDividerProps = {
  marker?: ReactNode;
};

export function DetailPanelDivider({ marker }: DetailPanelDividerProps) {
  return (
    <div className="mt-8 flex items-center justify-center gap-4 text-[#a77a45]">
      <Separator className="flex-1 bg-[#6f4b27]" />
      {marker ? <span className="text-xl">{marker}</span> : null}
      <Separator className="flex-1 bg-[#6f4b27]" />
    </div>
  );
}
