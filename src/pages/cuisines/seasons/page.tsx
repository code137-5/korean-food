import { useParams } from "react-router-dom";
import { SEASONS, type Season } from "@/entities/season";

function isSeason(value: string | undefined): value is Season {
  return !!value && SEASONS.includes(value as Season);
}

export function SeasonCuisinePage() {
  const { season } = useParams();
  const selectedSeason = isSeason(season) ? season : null;

  console.log(selectedSeason);

  return null;
}
