import { SeasonMenu } from "@/widgets/menu";

export function LayoutMenu() {
  return (
    <div className="absolute right-0 top-0 w-[30%] h-full pointer-events-auto">
      <SeasonMenu />
    </div>
  );
}
