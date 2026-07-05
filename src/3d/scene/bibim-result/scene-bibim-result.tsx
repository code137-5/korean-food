import { useMemo } from "react";

export type BibimResultSceneSlice = {
  color: string;
  id: string;
  value: number;
};

type BibimResultSceneSliceMesh = {
  color: string;
  id: string;
  thetaLength: number;
  thetaStart: number;
};

type ThreeSceneBibimResultProps = {
  slices: BibimResultSceneSlice[];
};

const EMPTY_SLICE: BibimResultSceneSlice = {
  color: "#d8c8a8",
  id: "empty",
  value: 100,
};

function createSliceMeshes(
  slices: BibimResultSceneSlice[],
): BibimResultSceneSliceMesh[] {
  const visibleSlices = slices.length > 0 ? slices : [EMPTY_SLICE];
  const totalValue = visibleSlices.reduce((total, slice) => {
    return total + slice.value;
  }, 0);

  return visibleSlices.reduce<BibimResultSceneSliceMesh[]>(
    (sliceMeshes, slice) => {
      const previousSlice = sliceMeshes.at(-1);
      const thetaStart = previousSlice
        ? previousSlice.thetaStart + previousSlice.thetaLength
        : Math.PI / 2;

      return [
        ...sliceMeshes,
        {
          color: slice.color,
          id: slice.id,
          thetaLength: (slice.value / totalValue) * Math.PI * 2,
          thetaStart,
        },
      ];
    },
    [],
  );
}

export function ThreeSceneBibimResult({ slices }: ThreeSceneBibimResultProps) {
  const sliceMeshes = useMemo(() => createSliceMeshes(slices), [slices]);

  return (
    <group position={[0, 0.25, 0]}>
      {sliceMeshes.map((slice) => (
        <mesh key={slice.id} castShadow receiveShadow>
          <cylinderGeometry
            args={[
              0.95,
              0.95,
              0.22,
              64,
              1,
              false,
              slice.thetaStart,
              slice.thetaLength,
            ]}
          />
          <meshStandardMaterial color={slice.color} roughness={0.72} />
        </mesh>
      ))}
      <mesh position={[0, -0.14, 0]} receiveShadow>
        <cylinderGeometry args={[1.02, 1.02, 0.08, 96]} />
        <meshStandardMaterial color="#efe3c2" roughness={0.86} />
      </mesh>
    </group>
  );
}
