import { useIngredientCategoryCodesQuery } from "@/entities/ingredient";
import { TexturedButton, TexturedPanel } from "@/shared/ui/textured-ui";
import { useTranslation } from "react-i18next";

export function IngredientCategories() {
  const { t } = useTranslation("ingredient");
  const { data: categoryCodes, isError, isLoading } =
    useIngredientCategoryCodesQuery();

  return (
    <TexturedPanel
      className="w-full min-h-0 grow flex flex-col gap-1 p-4 overflow-y-scroll [&::-webkit-scrollbar]:w-3 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-zinc-500 [&::-webkit-scrollbar-thumb]:rounded-full"
      variant="golden"
    >
      {isLoading ? (
        <TexturedButton size="sm" disabled>
          {t("status.loading")}
        </TexturedButton>
      ) : null}

      {isError ? (
        <TexturedButton size="sm" disabled>
          {t("status.error")}
        </TexturedButton>
      ) : null}

      {!isLoading && !isError
        ? categoryCodes.map((categoryCode) => (
            <TexturedButton key={categoryCode} size="sm">
              {t(`categories.${categoryCode}`, {
                defaultValue: categoryCode,
              })}
            </TexturedButton>
          ))
        : null}
    </TexturedPanel>
  );
}
