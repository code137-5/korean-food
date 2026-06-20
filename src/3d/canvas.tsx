import { Canvas } from "@react-three/fiber";
import { Grid, OrbitControls } from "@react-three/drei";
import { useCallback, useMemo } from "react";
import type { Season } from "../entities/season/model/types";
import { useSeasonStore } from "../entities/season/model/store";
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
  }, [season]);

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
  const { season, setSeason } = useSeasonStore(
    useShallow((s) => ({
      season: s.selectedSeason,
      setSeason: s.setSelectedSeason,
    })),
  );

  const onClick = useCallback(
    (season: Season) => {
      // 전역 저장소에 season 할당
      setSeason(season);
    },
    [setSeason],
  );

  return (
    <group>
      <SeasonButton
        focused={false}
        season="spring"
        position={[-2, 0.5, -2]}
        onClick={onClick}
      />
      <SeasonButton
        focused={false}
        season="summer"
        position={[2, 0.5, -2]}
        onClick={onClick}
      />
      <SeasonButton
        focused={false}
        season="autumn"
        position={[-2, 0.5, 2]}
        onClick={onClick}
      />
      <SeasonButton
        focused={false}
        season="winter"
        position={[2, 0.5, 2]}
        onClick={onClick}
      />
    </group>
  );
}

export function ThreeCanvas() {
  return (
    <div className="relative block w-full h-full">
      <Canvas className="relative block w-full h-full">
        <directionalLight
          intensity={1.5}
          position={[1, 1, 0.5]}
          lookAt={[0, 0, 0]}
        />

        <OrbitControls />
        <ambientLight intensity={0.5} />
        {/* <Box /> */}
        <Grid infiniteGrid />
        <SeasonButtonGroup />
      </Canvas>
    </div>
  );
}
