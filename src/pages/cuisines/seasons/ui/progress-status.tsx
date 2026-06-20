function ProgressCircle() {
  return (
    <div className="relative z-10 h-4 w-4 rounded-full bg-black/70 border-2 border-stone-200/90 shadow-[0_0_8px_rgba(255,235,194,0.25)]" />
  );
}

function ProgressCircleGlow() {
  return (
    <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#f9d99c] bg-[#7a4f22] shadow-[0_0_20px_rgba(255,207,126,0.9)]">
      <div className="h-8 w-8 rounded-full border-2 border-[#fff3d1] bg-[#f6dba1] shadow-[inset_0_0_8px_rgba(92,54,19,0.35)]" />
    </div>
  );
}

type ProgressStatusProps = {
  count: number;
  selectedIndex: number;
};

export function ProgressStatus({ count, selectedIndex }: ProgressStatusProps) {
  return (
    <div className="relative  bg-[#3a2414]  w-16  py-8 ">
      <div className="absolute left-1/2 top-0 h-full w-[3px] -translate-x-1/2 rounded-full bg-stone-200/60 shadow-[0_0_10px_rgba(255,244,220,0.35)]" />
      <div className="flex flex-col items-center justify-between gap-8">
        {Array.from({ length: count }).map((_, index) =>
          index === selectedIndex ? (
            <ProgressCircleGlow key={index} />
          ) : (
            <ProgressCircle key={index} />
          ),
        )}
      </div>
    </div>
  );
}
