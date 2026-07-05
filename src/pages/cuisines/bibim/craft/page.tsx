import { BibimCraftCenterPanel } from "./ui/center-panel/bibim-craft-center-panel";
import { BibimCraftLeftPanel } from "./ui/left-panel/bibim-craft-left-panel";
import { BibimCraftRightPanel } from "./ui/right-panel/bibim-craft-right-panel";

export function BibimCraftPage() {
  return (
    <div className="absolute inset-0 flex flex-row items-center gap-6 p-4 pointer-events-none">
      <BibimCraftLeftPanel />
      <BibimCraftCenterPanel />
      <BibimCraftRightPanel />
    </div>
  );
}
