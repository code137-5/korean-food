import { useEffect, useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import { SRGBColorSpace, TextureLoader, Vector2, type Texture } from "three";

import {
  createDisplaceableCylinderTopGeometry,
  getAverageDisplacedY,
} from "@/shared/3d/geometry";
import {
  DISPLACEMENT_WEIGHT_ATTRIBUTE,
  replaceDisplacementMapWithWeightedChunk,
} from "@/shared/3d/material";
import { resolvePublicAssetUrl } from "@/shared/lib/url";

type TextureMaps = {
  diffuse: Texture;
  displacement: Texture;
  normal: Texture;
};

type TexturedPieSliceProps = {
  diffuseMapUrl?: string;
  displacementMapUrl?: string;
  fallbackColor?: string;
  height?: number;
  normalMapUrl?: string;
  position?: [number, number, number];
  radius?: number;
  thetaLength: number;
  thetaStart: number;
};

const FULL_CIRCLE = Math.PI * 2;
const DEFAULT_COLOR = "#d8c8a8";
const DISPLACEMENT_SCALE = 0.2;
const DISPLACEMENT_WEIGHTED_PROGRAM_KEY =
  "displacement-weighted-displacement-map";

function useTextureMaps(
  diffuseMapUrl: string,
  displacementMapUrl: string,
  normalMapUrl: string,
): TextureMaps {
  const urls = useMemo(
    () => [
      resolvePublicAssetUrl(diffuseMapUrl),
      resolvePublicAssetUrl(displacementMapUrl),
      resolvePublicAssetUrl(normalMapUrl),
    ],
    [diffuseMapUrl, displacementMapUrl, normalMapUrl],
  );
  const [diffuse, displacement, normal] = useLoader(TextureLoader, urls);

  // eslint-disable-next-line
  diffuse.colorSpace = SRGBColorSpace;

  return {
    diffuse,
    displacement,
    normal,
  };
}

export function TexturedPieSlice({
  diffuseMapUrl,
  displacementMapUrl,
  fallbackColor = DEFAULT_COLOR,
  height = 0.22,
  normalMapUrl,
  position,
  radius = 0.95,
  thetaLength,
  thetaStart,
}: TexturedPieSliceProps) {
  if (!diffuseMapUrl || !displacementMapUrl || !normalMapUrl) {
    return (
      <PieSliceMesh
        fallbackColor={fallbackColor}
        height={height}
        position={position}
        radius={radius}
        thetaLength={thetaLength}
        thetaStart={thetaStart}
      />
    );
  }

  return (
    <TexturedPieSliceMesh
      diffuseMapUrl={diffuseMapUrl}
      displacementMapUrl={displacementMapUrl}
      fallbackColor={fallbackColor}
      height={height}
      normalMapUrl={normalMapUrl}
      position={position}
      radius={radius}
      thetaLength={thetaLength}
      thetaStart={thetaStart}
    />
  );
}

type RequiredTextureMapUrls = Required<
  Pick<
    TexturedPieSliceProps,
    "diffuseMapUrl" | "displacementMapUrl" | "normalMapUrl"
  >
>;

function TexturedPieSliceMesh({
  diffuseMapUrl,
  displacementMapUrl,
  normalMapUrl,
  ...props
}: RequiredTextureMapUrls &
  Omit<
    TexturedPieSliceProps,
    "diffuseMapUrl" | "displacementMapUrl" | "normalMapUrl"
  >) {
  const textureMaps = useTextureMaps(
    diffuseMapUrl,
    displacementMapUrl,
    normalMapUrl,
  );

  return <PieSliceMesh {...props} textureMaps={textureMaps} />;
}

function PieSliceMesh({
  fallbackColor = DEFAULT_COLOR,
  height = 0.22,
  position,
  radius = 0.95,
  textureMaps = null,
  thetaLength,
  thetaStart,
}: Omit<
  TexturedPieSliceProps,
  "diffuseMapUrl" | "displacementMapUrl" | "normalMapUrl"
> & {
  textureMaps?: TextureMaps | null;
}) {
  const normalScale = useMemo(() => new Vector2(0.3, 0.3), []);
  const geometry = useMemo(
    () =>
      createDisplaceableCylinderTopGeometry({
        height,
        radius,
        radialSegments: Math.round(128 * (thetaLength / FULL_CIRCLE)),
        thetaLength: thetaLength + Math.PI / 60,
        thetaSegments: Math.round(256 * (thetaLength / FULL_CIRCLE)),
        thetaStart,
      }),
    [height, radius, thetaLength, thetaStart],
  );
  const yBias = useMemo(() => {
    if (!textureMaps) {
      return 0;
    }

    return (
      height / 2 -
      getAverageDisplacedY(
        geometry,
        textureMaps.displacement,
        DISPLACEMENT_SCALE,
        {
          displacementWeightAttribute: DISPLACEMENT_WEIGHT_ATTRIBUTE,
        },
      )
    );
  }, [geometry, height, textureMaps]);
  const biasedPosition = useMemo<[number, number, number]>(
    () => [
      position?.[0] ?? 0,
      (position?.[1] ?? 0) + yBias,
      position?.[2] ?? 0,
    ],
    [position, yBias],
  );

  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  return (
    <mesh
      castShadow
      geometry={geometry}
      position={biasedPosition}
      receiveShadow
    >
      <meshStandardMaterial
        key={textureMaps ? "textured" : "fallback"}
        color={textureMaps ? "white" : fallbackColor}
        customProgramCacheKey={() =>
          textureMaps ? DISPLACEMENT_WEIGHTED_PROGRAM_KEY : "default"
        }
        displacementMap={textureMaps?.displacement ?? null}
        displacementScale={textureMaps ? DISPLACEMENT_SCALE : 0}
        map={textureMaps?.diffuse ?? null}
        normalMap={textureMaps?.normal ?? null}
        normalScale={normalScale}
        onBeforeCompile={
          textureMaps ? replaceDisplacementMapWithWeightedChunk : undefined
        }
        roughness={0.72}
      />
    </mesh>
  );
}
