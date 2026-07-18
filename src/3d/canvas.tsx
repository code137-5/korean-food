import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import {
  ContactShadows,
  Grid,
  OrbitControls,
  useGLTF,
} from "@react-three/drei";
import { ThreeSceneDispatcher } from "@/3d/scene/scene-dispatcher";
import {
  ACESFilmicToneMapping,
  NeutralToneMapping,
  PCFSoftShadowMap,
  SRGBColorSpace,
} from "three";
import { TexturedScreen } from "@/shared/ui/textured-ui";
import { useBibimCraftResultIngredientsQuery } from "@/pages/cuisines/bibim/craft/result/model/use-bibim-craft-result-ingredients-query";
import { ThreeSceneCamera } from "./scene/scene-camera";
import { useCurrentThreeScene } from "./scene/model";
import { createDisplaceableCylinderTopGeometry } from "@/shared/3d/geometry";
import * as THREE from "three";
import { textureLoader } from "@/shared/3d/loader/texture-loader";
import { replaceDisplacementMapWithWeightedChunk } from "@/shared/3d/material";

function ThreeFood() {
  const model = useGLTF("/3d/foods/Pressed Flower Coasters.glb");

  return <primitive object={model.scene.clone()} />;
}

interface ThreePieProp {
  startAngle: number;
  diffAngle: number;
  order: number;
}

function ThreePie({ startAngle, diffAngle, order }: ThreePieProp) {
  const { scene } = useThree();

  useEffect(() => {
    const geometry = createDisplaceableCylinderTopGeometry({
      thetaStart: startAngle,
      thetaLength: diffAngle,
      radialSegments: Math.round(128 * (diffAngle / (Math.PI * 2))),
      thetaSegments: Math.round(256 * (diffAngle / (Math.PI * 2))),
      height: 0.3,
    });
    const material = new THREE.MeshStandardMaterial();
    const mesh = new THREE.Mesh(geometry, material);

    const ingredient = order % 2 === 0 ? "tuna" : "tofu";
    Promise.all([
      textureLoader.loadAsync(
        `3d/maps/cuisines/ingredients/${ingredient}-diffuse.png`,
      ),
      textureLoader.loadAsync(
        `3d/maps/cuisines/ingredients/${ingredient}-displacement.png`,
      ),
      textureLoader.loadAsync(
        `3d/maps/cuisines/ingredients/${ingredient}-normal.png`,
      ),
    ]).then((res) => {
      res[0].colorSpace = THREE.SRGBColorSpace;
      const mat = new THREE.MeshStandardMaterial({
        // wireframe: true,
        map: res[0],
        displacementMap: res[1],
        displacementScale: 0.2,
        normalMap: res[2],
        normalScale: new THREE.Vector2(0.3, 0.3),
        // roughness: 0.2,
      });

      mat.onBeforeCompile = replaceDisplacementMapWithWeightedChunk;
      mat.customProgramCacheKey = () =>
        "displacement-weighted-displacement-map";

      mesh.material = mat;
    });

    scene.add(mesh);
    mesh.position.set(0, 0.5, 0);

    return () => {
      scene.remove(mesh);
      geometry.dispose();
      material.dispose();
    };
  }, [scene, startAngle, diffAngle, order]);

  return null;
}

export function ThreeCanvas() {
  const scene = useCurrentThreeScene();
  const bibimCraftResultIngredientsQuery =
    useBibimCraftResultIngredientsQuery();
  const bibimResultSlices = useMemo(
    () =>
      bibimCraftResultIngredientsQuery.data.map(
        ({ ingredient, ingredientId, value }) => ({
          color: ingredient.color ?? "#7fb069",
          id: ingredientId,
          value,
        }),
      ),
    [bibimCraftResultIngredientsQuery.data],
  );

  const arr = useMemo(() => Array.from({ length: 6 }, (_, i) => i), []);

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
          position: [0, 1.49, 2.3],
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
        <OrbitControls />
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
        <Grid infiniteGrid />
        {/* <ThreeFood /> */}
        {arr.map((i) => (
          <ThreePie
            key={`ThreePie-${i}`}
            order={i}
            startAngle={i * (Math.PI / 3)}
            diffAngle={Math.PI / 3}
          />
        ))}
        {/* {Array([])} */}
        {/* <ThreePie order={0} startAngle={0} diffAngle={Math.PI / 3} /> */}
      </Canvas>
    </div>
  );
}
