import { useQuery } from "@tanstack/react-query";
import { getSeasonCuisines } from "../api/get-season-cuisines";

export function useSeasonCuisinesQuery() {
  return useQuery({
    queryKey: ["season-cuisines"],
    queryFn: getSeasonCuisines,
    staleTime: Infinity,
  });
}
