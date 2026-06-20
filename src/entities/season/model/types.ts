// src/entities/season/model/types.ts
export type Season = "spring" | "summer" | "autumn" | "winter";
export const SEASONS: Season[] = ["spring", "summer", "autumn", "winter"];

export type FoodItem = {
  title: string;
  description: string;
};

export type SeasonCuisine = {
  label: string;
  title: string;
  subtitle: string;
  items: FoodItem[];
};

export type SeasonCuisineMap = Record<Season, SeasonCuisine>;
