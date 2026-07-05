import { useCallback, useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";

import * as THREE from "three";
import { convertSceneMaterials } from "@/3d/util/convert-physical-material";
import { useSeasonStore, type Season } from "@/entities/season";

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

function MenuBoard() {
  const gltf = useGLTF("/3d/items/menu_board.glb");

  useEffect(() => {
    /* convertSceneMaterials(gltf.scene, {
      clearcoat: 0.18,
      clearcoatRoughness: 0.55,
      sheen: 0.2,
      sheenRoughness: 0.8,
      specularIntensity: 1.15,
    });

    gltf.scene.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) {
        return;
      }

      object.castShadow = true;
      object.receiveShadow = true;

      const materials = Array.isArray(object.material)
        ? object.material
        : [object.material];

      materials.forEach((material) => {
        material.needsUpdate = true;

        if (material instanceof THREE.MeshPhysicalMaterial) {
          material.envMapIntensity = Math.max(material.envMapIntensity, 1.35);
        }
      });
    }); */
  }, [gltf]);

  return <primitive object={gltf.scene} />;
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
      <MenuBoard />
    </>
  );
}
