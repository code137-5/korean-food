import { useQuery } from "@tanstack/react-query";
import { getCuisineDetails } from "@/entities/cuisine-detail/api/get-cuisine-details";

export function useCuisineDetailsQuery() {
  return useQuery({
    queryKey: ["cuisine-details"],
    queryFn: getCuisineDetails,
    staleTime: Infinity,
  });
}
