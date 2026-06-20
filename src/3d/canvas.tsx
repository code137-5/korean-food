import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { ThreeSceneDispatcher } from "@/3d/scene/scene-dispatcher";

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
        <ThreeSceneDispatcher />
      </Canvas>
    </div>
  );
}
