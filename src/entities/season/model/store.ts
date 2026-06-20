// src/entities/season/model/store.ts
import { create } from "zustand";
import type { Season } from "@/entities/season/model/types";

type SeasonState = {
  selectedSeason: Season | null;
  setSelectedSeason: (season: Season) => void;
};

export const useSeasonStore = create<SeasonState>((set) => ({
  selectedSeason: null,
  setSelectedSeason: (season) => set({ selectedSeason: season }),
}));
