import { useCallback, useMemo } from "react";
import type { Season } from "@/entities/season";
import { useSeasonStore } from "@/entities/season";
import { useShallow } from "zustand/shallow";

type SeasonButtonProp = {
  focused: boolean;
  season: Season;
  position: [number, number, number];
  onClick?: (season: Season) => void;
};

function SeasonButton({
  focused,
  season,
  position,
  onClick,
}: SeasonButtonProp) {
  const color = useMemo(() => {
    if (focused) {
      return "white";
    }

    switch (season) {
      case "spring":
        return "pink";
      case "summer":
        return "skyblue";
      case "autumn":
        return "orange";
      case "winter":
        return "gray";
    }
  }, [focused, season]);

  return (
    <mesh
      position={position}
      onClick={() => {
        if (onClick) onClick(season);
      }}
    >
      <cylinderGeometry />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function SeasonButtonGroup() {
  const { selectedSeason, setSeason } = useSeasonStore(
    useShallow((s) => ({
      selectedSeason: s.selectedSeason,
      setSeason: s.setSelectedSeason,
    })),
  );

  const onClick = useCallback(
    (season: Season) => {
      setSeason(season);
    },
    [setSeason],
  );

  return (
    <group>
      <SeasonButton
        focused={selectedSeason === "spring"}
        season="spring"
        position={[-2, 0.5, -2]}
        onClick={onClick}
      />
      <SeasonButton
        focused={selectedSeason === "summer"}
        season="summer"
        position={[2, 0.5, -2]}
        onClick={onClick}
      />
      <SeasonButton
        focused={selectedSeason === "autumn"}
        season="autumn"
        position={[-2, 0.5, 2]}
        onClick={onClick}
      />
      <SeasonButton
        focused={selectedSeason === "winter"}
        season="winter"
        position={[2, 0.5, 2]}
        onClick={onClick}
      />
    </group>
  );
}

export function ThreeSceneHome() {
  return (
    <>
      <SeasonButtonGroup />
    </>
  );
}
