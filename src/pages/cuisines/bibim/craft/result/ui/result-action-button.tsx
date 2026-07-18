import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import type { ComponentProps } from "react";

interface ResultActionButtonProps
  extends Omit<ComponentProps<"button">, "children"> {
  icon: LucideIcon;
  label: string;
  labelClassName?: string;
}

export function ResultActionButton({
  className,
  icon: Icon,
  label,
  labelClassName,
  ...buttonProps
}: ResultActionButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "flex h-16 items-center justify-center gap-5 rounded-[22px] border border-[#b6884b] bg-[#2a170b]/35 px-5 text-xl font-medium text-[#f4c77f] shadow-[inset_0_0_16px_rgba(255,194,112,0.08)] transition hover:bg-[#3a2110]/55 hover:text-[#ffe0a1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f4c77f] disabled:pointer-events-none disabled:opacity-45",
        className,
      )}
      {...buttonProps}
    >
      <Icon className="size-8 shrink-0" aria-hidden="true" />
      <span className={cn("text-lg", labelClassName)}>{label}</span>
    </button>
  );
}
