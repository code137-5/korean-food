import type { ComponentProps } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type DetailPanelProps = ComponentProps<typeof Card>;

export function DetailPanel({ className, children, ...props }: DetailPanelProps) {
  return (
    <Card
      className={cn(
        "relative h-full w-full overflow-hidden rounded-sm border-[#6e5134]/50 bg-[#090806]/95 px-14 py-8 text-[#e9dcc6] shadow-[0_24px_80px_rgba(0,0,0,0.65)]",
        className
      )}
      {...props}
    >
      <CardContent className="relative z-10 mx-auto flex h-full max-w-3xl flex-col px-0">
        {children}
      </CardContent>
    </Card>
  );
}
