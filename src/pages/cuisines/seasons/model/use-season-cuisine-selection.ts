import { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  SEASONS,
  useCuisineSelectionStore,
  useSeasonCuisineItemsQuery,
  type Season,
} from "@/entities/season";

function isSeason(value: string | undefined): value is Season {
  return !!value && SEASONS.includes(value as Season);
}

export function useSeasonCuisineSelection() {
  const { season } = useParams();
  const selectedSeason = isSeason(season) ? season : null;
  const { data: cuisineItems } = useSeasonCuisineItemsQuery(selectedSeason);
  const items = useCuisineSelectionStore((state) => state.items);
  const selectedIndex = useCuisineSelectionStore((state) => state.selectedIndex);
  const registerCuisineItems = useCuisineSelectionStore(
    (state) => state.registerCuisineItems,
  );
  const clearCuisineItems = useCuisineSelectionStore(
    (state) => state.clearCuisineItems,
  );
  const selectPreviousCuisine = useCuisineSelectionStore(
    (state) => state.selectPreviousCuisine,
  );
  const selectNextCuisine = useCuisineSelectionStore(
    (state) => state.selectNextCuisine,
  );

  useEffect(() => {
    if (!selectedSeason) {
      clearCuisineItems();
      return;
    }

    registerCuisineItems(cuisineItems);
  }, [clearCuisineItems, cuisineItems, registerCuisineItems, selectedSeason]);

  return {
    items,
    selectedIndex,
    selectedCuisineCode: items[selectedIndex]?.code ?? null,
    selectPreviousCuisine,
    selectNextCuisine,
  };
}
