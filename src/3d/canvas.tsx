import { Canvas } from "@react-three/fiber";
import { ContactShadows, Grid, OrbitControls } from "@react-three/drei";
import { useMemo } from "react";
import { NeutralToneMapping, PCFSoftShadowMap, SRGBColorSpace } from "three";

import { ThreeSceneDispatcher } from "@/3d/scene/scene-dispatcher";
import { useBibimCraftResultIngredientsQuery } from "@/pages/cuisines/bibim/craft/result/model/use-bibim-craft-result-ingredients-query";
import { TexturedScreen } from "@/shared/ui/textured-ui";

import { ThreeSceneCamera } from "./scene/scene-camera";
import { useCurrentThreeScene } from "./scene/model";

export function ThreeCanvas() {
  const scene = useCurrentThreeScene();
  const bibimCraftResultIngredientsQuery =
    useBibimCraftResultIngredientsQuery();
  const bibimResultSlices = useMemo(
    () =>
      bibimCraftResultIngredientsQuery.data.map(
        ({ ingredient, ingredientId, value }) => ({
          color: ingredient.color ?? "#7fb069",
          diffuseMapUrl: ingredient.diffuseMapUrl,
          displacementMapUrl: ingredient.displacementMapUrl,
          id: ingredientId,
          normalMapUrl: ingredient.normalMapUrl,
          value,
        }),
      ),
    [bibimCraftResultIngredientsQuery.data],
  );

  return (
    <div className="relative block w-full h-full">
      <TexturedScreen className="absolute p-4 left-0 right-0 w-full h-full flex flex-row gap-6 justify-start" />

      <Canvas
        className="relative block w-full h-full"
        shadows={{
          enabled: true,
          type: PCFSoftShadowMap,
        }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          toneMapping: NeutralToneMapping,
          toneMappingExposure: 1.05,
          outputColorSpace: SRGBColorSpace,
        }}
        camera={{
          fov: 30,
          near: 0.01,
          far: 100,
          position: [0, 5, 5],
        }}
      >
        <directionalLight
          color={"#fff2cc"}
          intensity={4.5}
          position={[-3.464, 4.0, 6.0]}
          lookAt={[0, 0, 0]}
          castShadow
          shadow-mapSize={[4096, 4096]}
          shadow-camera-left={-6}
          shadow-camera-right={6}
          shadow-camera-top={6}
          shadow-camera-bottom={-6}
          shadow-camera-near={0.1}
          shadow-camera-far={50}
          shadow-bias={0}
          shadow-normalBias={0.005}
          shadow-radius={4}
          shadow-blurSamples={8}
        />
        {/*         <Environment resolution={512}>
          <Lightformer
            intensity={3}
            color="#fff4d8"
            position={[-3, 4, 5]}
            scale={[4, 4, 1]}
          />
          <Lightformer
            intensity={1.8}
            color="#b9d6ff"
            position={[4, 2, -3]}
            scale={[5, 3, 1]}
          />
          <Lightformer
            intensity={0.8}
            color="#ffffff"
            position={[0, -2, 4]}
            scale={[8, 2, 1]}
          />
        </Environment> */}
        <ambientLight intensity={2} color={"#bad8ff"} />
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          maxPolarAngle={Math.PI / 4}
          minPolarAngle={Math.PI / 4}
        />
        <ThreeSceneDispatcher
          bibimResultSlices={bibimResultSlices}
          scene={scene}
        />
        <ThreeSceneCamera scene={scene} />

        <ContactShadows
          position={[0, -0.01, 0]}
          opacity={0.42}
          scale={8}
          blur={2.4}
          far={4}
          resolution={1024}
          color="#24170f"
        />
        {/* <Grid infiniteGrid /> */}
      </Canvas>
    </div>
  );
}
