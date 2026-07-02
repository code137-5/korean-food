import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type DetailPanelProps = HTMLAttributes<HTMLDivElement>;

export function DetailPanel({
  className,
  children,
  ...props
}: DetailPanelProps) {
  return (
    <div
      className={cn(
        "relative h-full w-full px-14 py-8 text-[#e9dcc6]",
        className,
      )}
      {...props}
    >
      <div className="relative z-10 mx-auto flex h-full max-w-3xl flex-col px-0">
        {children}
      </div>
    </div>
  );
}
