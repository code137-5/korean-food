import { BackRouteButton } from "@/widgets/common/back-route-button";

export function BibimCraftResultPage() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute left-5 top-5 pointer-events-auto">
        <BackRouteButton url="/cuisines/bibim/craft" />
      </div>
      <div className="absolute right-5 bottom-5 ui-textured-rounded-wood w-[min(480px,calc(100vw-40px))]"></div>
    </div>
  );
}
