import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type TexturedButtonVariant = "bright" | "dark";
type TexturedButtonSize = "sm" | "lg";

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
  sm: "ui-textured-button-sm p-3 text-xl",
  lg: "ui-textured-button-lg py-5 px-28 text-4xl",
};

export function TexturedButton({
  children,
  className,
  size = "sm",
  type = "button",
  variant = "bright",
  ...props
}: TexturedButtonProps) {
  return (
    <button
      className={cn(
        "ui-textured-button text-align border-0 bg-transparent",
        variantClassName[variant],
        sizeClassName[size],
        className,
      )}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
