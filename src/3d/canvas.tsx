import { Canvas } from "@react-three/fiber";
import { Box, OrbitControls } from "@react-three/drei";

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
        <Box />
      </Canvas>
    </div>
  );
}
