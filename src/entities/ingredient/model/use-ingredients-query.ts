import { useQuery } from "@tanstack/react-query";
import { getIngredients } from "@/entities/ingredient/api/get-ingredients";

export function useIngredientsQuery() {
  return useQuery({
    queryKey: ["ingredients"],
    queryFn: getIngredients,
    staleTime: Infinity,
  });
}
