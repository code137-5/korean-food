import type { CuisineDetailMap } from "@/entities/cuisine-detail/model/types";

export async function getCuisineDetails(): Promise<CuisineDetailMap> {
  const response = await fetch(
    `${import.meta.env.BASE_URL}data/cuisine-detail.json`,
  );

  if (!response.ok) {
    throw new Error("Failed to load cuisine details.");
  }

  return response.json() as Promise<CuisineDetailMap>;
}
