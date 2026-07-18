import type { LucideIcon } from "lucide-react";

interface ResultActionButtonProps {
  icon: LucideIcon;
  label: string;
}

export function ResultActionButton({
  icon: Icon,
  label,
}: ResultActionButtonProps) {
  return (
    <button
      type="button"
      className="flex h-16 items-center justify-center gap-5 rounded-[22px] border border-[#b6884b] bg-[#2a170b]/35 px-5 text-xl font-medium text-[#f4c77f] shadow-[inset_0_0_16px_rgba(255,194,112,0.08)] transition hover:bg-[#3a2110]/55 hover:text-[#ffe0a1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f4c77f]"
    >
      <Icon className="size-8 shrink-0" aria-hidden="true" />
      <span className="text-lg">{label}</span>
    </button>
  );
}
