import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

interface PaperTileProps extends HTMLAttributes<HTMLDivElement> {
  contentClassName?: string;
}

export function PaperTile({
  className,
  contentClassName,
  ...props
}: PaperTileProps) {
  return (
    <div className={cn("ui-paper-tile-frame h-30 p-1", className)} {...props}>
      <div className={cn("ui-paper-tile h-full w-full", contentClassName)} />
    </div>
  );
}
