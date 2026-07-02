import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

interface TexturedScreenProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function TexturedScreen({
  children,
  className,
  ...props
}: TexturedScreenProps) {
  return (
    <div className={cn("ui-textured-screen", className)} {...props}>
      {children}
    </div>
  );
}
