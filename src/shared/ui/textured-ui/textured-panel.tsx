import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type TexturedPanelVariant = "golden" | "dark" | "felt" | "ink" | "beige";

interface TexturedPanelProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  variant?: TexturedPanelVariant;
}

const variantClassName: Record<TexturedPanelVariant, string> = {
  golden: "ui-textured-panel-golden",
  dark: "ui-textured-panel-dark",
  felt: "ui-textured-panel-felt",
  ink: "ui-textured-panel-ink",
  beige: "ui-textured-panel-beige",
};

export function TexturedPanel({
  children,
  className,
  variant = "golden",
  ...props
}: TexturedPanelProps) {
  return (
    <div className={cn(variantClassName[variant], className)} {...props}>
      {children}
    </div>
  );
}
