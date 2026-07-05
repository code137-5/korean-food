import { TexturedButton, TexturedPanel } from "@/shared/ui/textured-ui";

const INGREDIENT_CATEGORY_LABELS = ["밥", "나물", "고명", "양념"];

export function IngredientCategories() {
  return (
    <TexturedPanel
      className="w-full min-h-0 grow flex flex-col gap-1 p-4 overflow-y-scroll [&::-webkit-scrollbar]:w-3 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-zinc-500 [&::-webkit-scrollbar-thumb]:rounded-full"
      variant="golden"
    >
      {INGREDIENT_CATEGORY_LABELS.map((label) => (
        <TexturedButton key={label} size="sm">
          {label}
        </TexturedButton>
      ))}
    </TexturedPanel>
  );
}
