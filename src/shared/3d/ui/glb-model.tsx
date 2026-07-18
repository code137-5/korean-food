import { useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { Mesh } from "three";
import type { ThreeElements } from "@react-three/fiber";

import { resolvePublicAssetUrl } from "@/shared/lib/url";

type GlbModelProps = Omit<ThreeElements["group"], "children"> & {
  castShadow?: boolean;
  receiveShadow?: boolean;
  url: string;
};

export function GlbModel({
  castShadow = true,
  receiveShadow = true,
  url,
  ...groupProps
}: GlbModelProps) {
  const gltf = useGLTF(resolvePublicAssetUrl(url));
  const scene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);

  useEffect(() => {
    scene.traverse((object) => {
      if (!(object instanceof Mesh)) {
        return;
      }

      object.castShadow = castShadow;
      object.receiveShadow = receiveShadow;
    });
  }, [castShadow, receiveShadow, scene]);

  return (
    <group {...groupProps}>
      <primitive object={scene} />
    </group>
  );
}
