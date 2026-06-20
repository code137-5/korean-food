import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type CuisineNavigationProps = {
  selectedIndex: number;
  itemCount: number;
  onPrevious: () => void;
  onNext: () => void;
};

export function CuisineNavigation({
  selectedIndex,
  itemCount,
  onPrevious,
  onNext,
}: CuisineNavigationProps) {
  return (
    <div className="w-full flex flex-row justify-between">
      <Button
        type="button"
        variant="secondary"
        size="lg"
        className="h-20 w-30 border border-[#9f793e]/70 bg-[#20160d]/80 text-[#e9dcc6] hover:bg-[#2a1d11]"
        disabled={selectedIndex <= 0}
        onClick={onPrevious}
      >
        <ChevronLeft aria-hidden="true" />
        이전
      </Button>
      <Button
        type="button"
        variant="secondary"
        size="lg"
        className="h-20 w-30 border border-[#9f793e]/70 bg-[#20160d]/80 text-[#e9dcc6] hover:bg-[#2a1d11]"
        disabled={selectedIndex >= itemCount - 1}
        onClick={onNext}
      >
        다음
        <ChevronRight aria-hidden="true" />
      </Button>
    </div>
  );
}
