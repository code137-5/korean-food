export type IngredientCategoryCode =
  | "meat"
  | "fish"
  | "namul"
  | "mushroom"
  | "vegetable"
  | "sauce"
  | "etc";

export type MeatIngredientCode = "pork" | "beef" | "chicken";

export type FishIngredientCode = "mackerel" | "salmon" | "tuna";

export type NamulIngredientCode =
  | "gosari"
  | "spinach"
  | "bean_sprout"
  | "mung_bean_sprout";

export type MushroomIngredientCode = "shiitake" | "oyster_mushroom" | "enoki";

export type VegetableIngredientCode = "carrot" | "zucchini" | "cucumber";

export type SauceIngredientCode =
  | "gochujang"
  | "soysauce"
  | "soybean"
  | "ssamjang"
  | "sesame_oil";

export type EtcIngredientCode = "egg" | "avocado";

export type IngredientCode =
  | MeatIngredientCode
  | FishIngredientCode
  | NamulIngredientCode
  | MushroomIngredientCode
  | VegetableIngredientCode
  | SauceIngredientCode
  | EtcIngredientCode;

export type IngredientCategoryMap = {
  [K in IngredientCategoryCode]: IngredientCode;
};

export type IngredientCodeOf<TCategory extends IngredientCategoryCode> =
  IngredientCategoryMap[TCategory];
