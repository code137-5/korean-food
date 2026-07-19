import { Pause, Play } from "lucide-react";

import { Button } from "@/components/ui/button";

type BgmToggleButtonProps = {
  isDisabled?: boolean;
  isPlaying: boolean;
  onToggle: () => void;
};

export function BgmToggleButton({
  isDisabled = false,
  isPlaying,
  onToggle,
}: BgmToggleButtonProps) {
  const Icon = isPlaying ? Pause : Play;

  return (
    <Button
      type="button"
      variant="secondary"
      size="lg"
      className="pointer-events-auto border border-stone-300/40 bg-black/65 text-stone-100 shadow-lg backdrop-blur hover:bg-black/80 disabled:opacity-50"
      aria-label={isPlaying ? "Pause background music" : "Play background music"}
      disabled={isDisabled}
      onClick={onToggle}
    >
      <Icon aria-hidden="true" />
      BGM
    </Button>
  );
}
