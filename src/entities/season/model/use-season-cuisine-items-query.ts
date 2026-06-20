import type { FoodItem, Season, SeasonCuisine } from "@/entities/season";
import { useSeasonCuisinesQuery } from "@/entities/season/model/use-season-cuisines-query";

type UseSeasonCuisineItemsQueryResult = Omit<
  ReturnType<typeof useSeasonCuisinesQuery>,
  "data"
> & {
  data: FoodItem[];
  seasonCuisine: SeasonCuisine | null;
};

export function useSeasonCuisineItemsQuery(
  season: Season | null,
): UseSeasonCuisineItemsQueryResult {
  const query = useSeasonCuisinesQuery();
  const seasonCuisine = season && query.data ? query.data[season] : null;

  return {
    ...query,
    data: seasonCuisine?.items ?? [],
    seasonCuisine,
  };
}
