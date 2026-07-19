import { BibimBowl } from "@/3d/scene/bibim-result/ui/bibim-bowl";
import { useDefaultBibimSlices } from "./model/use-default-bibim-slices";

export function ThreeSceneBibim() {
  const { data: slices, isLoading } = useDefaultBibimSlices();

  if (isLoading) {
    return null;
  }

  return <BibimBowl slices={slices} />;
}
