import {
  useIngredientCategoryCodesQuery,
  type IngredientCategoryCode,
} from "@/entities/ingredient";
import { useBibimCraftStore } from "../../model/bibim-craft-store";
import { TexturedButton, TexturedPanel } from "@/shared/ui/textured-ui";
import { useTranslation } from "react-i18next";

type IngredientCategoriesStatus = "idle" | "loading" | "error";

type IngredientCategoriesContentProps = {
  categoryCodes: IngredientCategoryCode[];
  selectedCategoryCode: IngredientCategoryCode | null;
  status: IngredientCategoriesStatus;
  onSelectCategory: (categoryCode: IngredientCategoryCode) => void;
};

function getIngredientCategoriesStatus(
  isLoading: boolean,
  isError: boolean,
): IngredientCategoriesStatus {
  if (isLoading) {
    return "loading";
  }

  if (isError) {
    return "error";
  }

  return "idle";
}

function IngredientCategoriesContent({
  categoryCodes,
  selectedCategoryCode,
  status,
  onSelectCategory,
}: IngredientCategoriesContentProps) {
  const { t } = useTranslation("ingredient");

  switch (status) {
    case "loading":
      return (
        <TexturedButton size="sm" disabled>
          {t("status.loading")}
        </TexturedButton>
      );
    case "error":
      return (
        <TexturedButton size="sm" disabled>
          {t("status.error")}
        </TexturedButton>
      );
    case "idle":
      return categoryCodes.map((categoryCode) => {
        const isSelected = selectedCategoryCode === categoryCode;

        return (
          <TexturedButton
            key={categoryCode}
            size="sm"
            variant={isSelected ? "dark" : "bright"}
            aria-pressed={isSelected}
            onClick={() => onSelectCategory(categoryCode)}
          >
            {t(`categories.${categoryCode}`, {
              defaultValue: categoryCode,
            })}
          </TexturedButton>
        );
      });
  }
}

export function IngredientCategories() {
  const { data: categoryCodes, isError, isLoading } =
    useIngredientCategoryCodesQuery();
  const selectedIngredientCategoryCode = useBibimCraftStore(
    (state) => state.selectedIngredientCategoryCode,
  );
  const setSelectedIngredientCategoryCode = useBibimCraftStore(
    (state) => state.setSelectedIngredientCategoryCode,
  );
  const status = getIngredientCategoriesStatus(isLoading, isError);

  return (
    <TexturedPanel
      className="w-full min-h-0 grow flex flex-col gap-1 p-4 overflow-y-scroll [&::-webkit-scrollbar]:w-3 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-zinc-500 [&::-webkit-scrollbar-thumb]:rounded-full"
      variant="golden"
    >
      <IngredientCategoriesContent
        categoryCodes={categoryCodes}
        selectedCategoryCode={selectedIngredientCategoryCode}
        status={status}
        onSelectCategory={setSelectedIngredientCategoryCode}
      />
    </TexturedPanel>
  );
}
