import type {
  BibimResultSceneSlice,
  BibimResultSceneSliceMesh,
} from "./bibim-result-scene.types";

const EMPTY_SLICE: BibimResultSceneSlice = {
  color: "#d8c8a8",
  id: "empty",
  value: 100,
};

export function createSliceMeshes(
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
          diffuseMapUrl: slice.diffuseMapUrl,
          displacementMapUrl: slice.displacementMapUrl,
          id: slice.id,
          normalMapUrl: slice.normalMapUrl,
          thetaLength: (slice.value / totalValue) * Math.PI * 2,
          thetaStart,
        },
      ];
    },
    [],
  );
}
