// src/entities/season/model/types.ts
export type Season = "spring" | "summer" | "autumn" | "winter";
export const SEASONS: Season[] = ["spring", "summer", "autumn", "winter"];

export type FoodItem = {
  code: string;
};

export type SeasonCuisine = {
  code: Season;
  items: FoodItem[];
};

export type SeasonCuisineMap = Record<Season, SeasonCuisine>;
