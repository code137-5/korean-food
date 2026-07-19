import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import type { PerspectiveCamera } from "three";
import type { ThreeSceneType } from "@/3d/scene/model";

function argsSetViewOffset(
  scene: ThreeSceneType | undefined,
  width: number,
  height: number,
) {
  switch (scene) {
    case "cuisine":
    case "bibim":
      return [width, height, width / 4, -height / 7, width, height];
  }

  return [width, height, 0, -height / 7, width, height];
}

type ThreeSceneCameraProps = {
  scene?: ThreeSceneType;
};

export function ThreeSceneCamera({ scene }: ThreeSceneCameraProps) {
  const { camera, size } = useThree();
  useEffect(() => {
    if (!camera || camera.type !== "PerspectiveCamera") return;
    const persCamera = camera as PerspectiveCamera;

    const [fullWidth, fullHeight, x, y, width, height] = argsSetViewOffset(
      scene,
      size.width,
      size.height,
    );

    persCamera.setViewOffset(fullWidth, fullHeight, x, y, width, height);
  }, [camera, size, scene]);

  return null;
}
