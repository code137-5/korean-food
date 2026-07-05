import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type TexturedButtonVariant = "bright" | "dark";
type TexturedButtonSize = "sm" | "lg" | "md";

interface TexturedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  size?: TexturedButtonSize;
  variant?: TexturedButtonVariant;
}

const variantClassName: Record<TexturedButtonVariant, string> = {
  bright: "ui-textured-button-bright text-[#B39879]",
  dark: "ui-textured-panel-dark text-white",
};

const sizeClassName: Record<TexturedButtonSize, string> = {
  sm: "ui-textured-button-sm py-6 px-3 text-xl",
  md: "ui-textured-button-md py-8 px-6 text-xl",
  lg: "ui-textured-button-lg py-10 px-28 text-4xl",
};

const fontColor: Record<TexturedButtonVariant, string> = {
  bright: "text-black",
  dark: "text-[#B79D7D]",
};

export function TexturedButton({
  children,
  className,
  size = "sm",
  type = "button",
  variant = "bright",
  ...props
}: React.ComponentProps<"button"> & TexturedButtonProps) {
  return (
    <Button
      className={cn(
        "ui-textured-button text-align border-0 bg-transparent",
        variantClassName[variant],
        sizeClassName[size],
        fontColor[variant],
        className,
      )}
      type={type}
      {...props}
    >
      {children}
    </Button>
  );
}
