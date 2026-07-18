export type IngredientCategoryCode =
  | "meat"
  | "fish"
  | "namul"
  | "mushroom"
  | "vegetable"
  | "fruit"
  | "sauce"
  | "etc";

export type IngredientId = string;

export type Ingredient = {
  id: IngredientId;
  categoryCode: IngredientCategoryCode;
  nameKey: string;
  descriptionKey?: string;
  imageUrl?: string;
  iconName?: string;
  color?: string;
  tags?: string[];
  allergenCodes?: string[];
  dietaryFlags?: string[];
  aliases?: string[];
  sortOrder?: number;
};

export type IngredientMap = Record<IngredientId, Ingredient>;
