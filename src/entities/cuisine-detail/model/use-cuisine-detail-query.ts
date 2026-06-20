import type { CuisineDetail } from "@/entities/cuisine-detail/model/types";
import { useCuisineDetailsQuery } from "@/entities/cuisine-detail/model/use-cuisine-details-query";

type UseCuisineDetailQueryResult = Omit<
  ReturnType<typeof useCuisineDetailsQuery>,
  "data"
> & {
  data: CuisineDetail | null;
};

export function useCuisineDetailQuery(
  cuisineCode: string | null,
): UseCuisineDetailQueryResult {
  const query = useCuisineDetailsQuery();

  return {
    ...query,
    data: cuisineCode && query.data ? (query.data[cuisineCode] ?? null) : null,
  };
}
