import type { Ingredient } from "@/entities/ingredient";
import { useBibimCraftStore } from "../../model/bibim-craft-store";
import { cn } from "@/lib/utils";
import { FillImage } from "@/shared/ui/fill-image";
import { PaperTile } from "@/shared/ui/textured-ui";
import { useTranslation } from "react-i18next";

type IngredientTileProps = {
  ingredient: Ingredient;
};

export function IngredientTile({ ingredient }: IngredientTileProps) {
  const { t } = useTranslation("ingredient");
  const isSelected = useBibimCraftStore(
    (state) => state.ingredientFlags[ingredient.id] ?? false,
  );
  const toggleIngredientSelection = useBibimCraftStore(
    (state) => state.toggleIngredientSelection,
  );

  return (
    <PaperTile
      className={cn(
        "block w-28 aspect-2/3 cursor-pointer",
        isSelected && "ui-paper-tile-frame-selected",
      )}
      contentClassName={cn(
        "flex flex-col items-center justify-between gap-2 px-2 py-3 text-center text-sm font-semibold leading-5 text-[#3f2f1f] transition",
        isSelected && "bg-[#4a3322]/20 text-[#21170f]",
      )}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      onClick={() => toggleIngredientSelection(ingredient)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          toggleIngredientSelection(ingredient);
        }
      }}
    >
      <div className="min-h-0 w-full flex-1">
        <FillImage
          alt=""
          className="object-contain"
          draggable={false}
          src={ingredient.thumbnailImageUrl}
        />
      </div>
      <span className="w-full shrink-0 break-keep">{t(ingredient.nameKey)}</span>
    </PaperTile>
  );
}
