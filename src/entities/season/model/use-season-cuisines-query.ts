import { useQuery } from "@tanstack/react-query";
import { getSeasonCuisines } from "@/entities/season/api/get-season-cuisines";

export function useSeasonCuisinesQuery() {
  return useQuery({
    queryKey: ["season-cuisines"],
    queryFn: getSeasonCuisines,
    staleTime: Infinity,
  });
}
