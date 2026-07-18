import { useEffect, useMemo, useState } from "react";
import { SRGBColorSpace, Vector2, type Texture } from "three";

import {
  createDisplaceableCylinderTopGeometry,
  getAverageDisplacedY,
} from "@/shared/3d/geometry";
import { textureLoader } from "@/shared/3d/loader/texture-loader";
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
  const [textureMaps, setTextureMaps] = useState<TextureMaps | null>(null);
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

  useEffect(() => {
    if (!diffuseMapUrl || !displacementMapUrl || !normalMapUrl) {
      setTextureMaps(null);
      return;
    }

    setTextureMaps(null);

    let disposed = false;
    let loadedTextureMaps: TextureMaps | null = null;

    Promise.all([
      textureLoader.loadAsync(resolvePublicAssetUrl(diffuseMapUrl)),
      textureLoader.loadAsync(resolvePublicAssetUrl(displacementMapUrl)),
      textureLoader.loadAsync(resolvePublicAssetUrl(normalMapUrl)),
    ])
      .then(([diffuse, displacement, normal]) => {
        diffuse.colorSpace = SRGBColorSpace;
        loadedTextureMaps = { diffuse, displacement, normal };

        if (disposed) {
          diffuse.dispose();
          displacement.dispose();
          normal.dispose();
          return;
        }

        setTextureMaps(loadedTextureMaps);
      })
      .catch((error: unknown) => {
        console.error("Failed to load pie slice textures.", {
          diffuseMapUrl,
          displacementMapUrl,
          error,
          normalMapUrl,
        });

        if (!disposed) {
          setTextureMaps(null);
        }
      });

    return () => {
      disposed = true;

      if (loadedTextureMaps) {
        loadedTextureMaps.diffuse.dispose();
        loadedTextureMaps.displacement.dispose();
        loadedTextureMaps.normal.dispose();
      }
    };
  }, [diffuseMapUrl, displacementMapUrl, normalMapUrl]);

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
