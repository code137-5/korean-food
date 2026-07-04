import { cn } from "@/lib/utils";

type ProgressCircleVariant = "active" | "inactive";

type ProgressCircleProps = {
  variant: ProgressCircleVariant;
};

const classTransition =
  "transition-[width,height,background-color,border-color,box-shadow, border] duration-300 ease-out";

const outerBase =
  "relative flex items-center justify-center rounded-full border-2";

const innerBase = "rounded-full";

const variantClassName: Record<ProgressCircleVariant, string> = {
  inactive:
    "h-4 w-4 bg-[#7a4f22]/70 border-[#FFFAE6]/90 shadow-[0_0_8px_rgba(255,235,194,0.25)]",
  active:
    "h-12 w-12 border-[#f9d99c] bg-[#7a4f22] shadow-[0_0_20px_rgba(255,207,126,0.9)]",
};

const variantInnerClassName: Record<ProgressCircleVariant, string> = {
  inactive: "h-0 w-0 rounded-full",
  active:
    "h-8 w-8 rounded-full border-2 border-[#fff3d1] bg-[#f6dba1] shadow-[inset_0_0_8px_rgba(92,54,19,0.35)]",
};

function ProgressCircle({ variant }: ProgressCircleProps) {
  return (
    <div className={cn(outerBase, classTransition, variantClassName[variant])}>
      <div
        className={cn(
          innerBase,
          classTransition,
          variantInnerClassName[variant],
        )}
      />
    </div>
  );
}

type ProgressStatusProps = {
  count: number;
  selectedIndex: number;
};

export function ProgressStatus({ count, selectedIndex }: ProgressStatusProps) {
  return (
    <div className="relative w-16 py-8 ">
      <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 rounded-full bg-[#f9d99c]/60 shadow-[0_0_10px_rgba(255,244,220,0.35)]" />
      <div className="flex flex-col items-center justify-between gap-14">
        {Array.from({ length: count }).map((_, index) =>
          index === selectedIndex ? (
            <ProgressCircle key={index} variant="active" />
          ) : (
            <ProgressCircle key={index} variant="inactive" />
          ),
        )}
      </div>
    </div>
  );
}
