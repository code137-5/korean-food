import type { SeasonCuisineMap } from "@/entities/season/model/types";

export async function getSeasonCuisines(): Promise<SeasonCuisineMap> {
  const response = await fetch(
    `${import.meta.env.BASE_URL}data/season-cuisines.json`,
  );

  if (!response.ok) {
    throw new Error("Failed to load season cuisines.");
  }

  return response.json() as Promise<SeasonCuisineMap>;
}
