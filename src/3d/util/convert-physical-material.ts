import * as THREE from "three";

type PhysicalMaterialOptions = Partial<{
  clearcoat: number;
  clearcoatRoughness: number;
  transmission: number;
  thickness: number;
  ior: number;
  sheen: number;
  sheenRoughness: number;
  iridescence: number;
  iridescenceIOR: number;
  specularIntensity: number;
  attenuationDistance: number;
  attenuationColor: THREE.ColorRepresentation;
}>;

/**
 * 기존 MeshStandardMaterial의 PBR 데이터를 MeshPhysicalMaterial로 이전한다.
 */
export function convertStandardToPhysical(
  source: THREE.MeshStandardMaterial,
  options: PhysicalMaterialOptions = {},
): THREE.MeshPhysicalMaterial {
  const physical = new THREE.MeshPhysicalMaterial({
    // 기본 Material 속성
    name: source.name,
    transparent: source.transparent,
    opacity: source.opacity,
    alphaTest: source.alphaTest,
    side: source.side,
    depthTest: source.depthTest,
    depthWrite: source.depthWrite,
    colorWrite: source.colorWrite,
    visible: source.visible,
    wireframe: source.wireframe,

    // GLTF metallic-roughness PBR 속성
    color: source.color.clone(),
    map: source.map,

    metalness: source.metalness,
    metalnessMap: source.metalnessMap,

    roughness: source.roughness,
    roughnessMap: source.roughnessMap,

    normalMap: source.normalMap,
    normalScale: source.normalScale.clone(),

    bumpMap: source.bumpMap,
    bumpScale: source.bumpScale,

    displacementMap: source.displacementMap,
    displacementScale: source.displacementScale,
    displacementBias: source.displacementBias,

    aoMap: source.aoMap,
    aoMapIntensity: source.aoMapIntensity,

    emissive: source.emissive.clone(),
    emissiveMap: source.emissiveMap,
    emissiveIntensity: source.emissiveIntensity,

    alphaMap: source.alphaMap,
    lightMap: source.lightMap,
    lightMapIntensity: source.lightMapIntensity,

    envMap: source.envMap,
    envMapIntensity: source.envMapIntensity,

    flatShading: source.flatShading,
    vertexColors: source.vertexColors,

    // MeshPhysicalMaterial 전용 속성
    clearcoat: options.clearcoat ?? 0,
    clearcoatRoughness: options.clearcoatRoughness ?? 0,
    transmission: options.transmission ?? 0,
    thickness: options.thickness ?? 0,
    ior: options.ior ?? 1.5,
    sheen: options.sheen ?? 0,
    sheenRoughness: options.sheenRoughness ?? 1,
    iridescence: options.iridescence ?? 0,
    iridescenceIOR: options.iridescenceIOR ?? 1.3,
    specularIntensity: options.specularIntensity ?? 1,
    attenuationDistance: options.attenuationDistance ?? Infinity,
    attenuationColor: options.attenuationColor ?? 0xffffff,
  });

  // Material constructor에서 직접 다루지 않은 렌더링 상태 복사
  physical.blending = source.blending;
  physical.blendSrc = source.blendSrc;
  physical.blendDst = source.blendDst;
  physical.blendEquation = source.blendEquation;
  physical.blendSrcAlpha = source.blendSrcAlpha;
  physical.blendDstAlpha = source.blendDstAlpha;
  physical.blendEquationAlpha = source.blendEquationAlpha;

  physical.polygonOffset = source.polygonOffset;
  physical.polygonOffsetFactor = source.polygonOffsetFactor;
  physical.polygonOffsetUnits = source.polygonOffsetUnits;

  physical.stencilWrite = source.stencilWrite;
  physical.stencilWriteMask = source.stencilWriteMask;
  physical.stencilFunc = source.stencilFunc;
  physical.stencilRef = source.stencilRef;
  physical.stencilFuncMask = source.stencilFuncMask;
  physical.stencilFail = source.stencilFail;
  physical.stencilZFail = source.stencilZFail;
  physical.stencilZPass = source.stencilZPass;

  physical.clippingPlanes = source.clippingPlanes;
  physical.clipIntersection = source.clipIntersection;
  physical.clipShadows = source.clipShadows;

  // 사용자 정의 데이터 보존
  physical.userData = structuredClone(source.userData);

  return physical;
}

function isMeshStandardMaterial(
  material: THREE.Material,
): material is THREE.MeshStandardMaterial {
  return material instanceof THREE.MeshStandardMaterial;
}

/**
 * scene 내부의 MeshStandardMaterial을 MeshPhysicalMaterial로 교체한다.
 *
 * 같은 원본 material을 사용하는 Mesh들은 동일한 변환 material을 공유한다.
 */
export function convertSceneMaterials(
  scene: THREE.Object3D,
  options: PhysicalMaterialOptions = {},
): Set<THREE.MeshPhysicalMaterial> {
  const materialCache = new Map<
    THREE.MeshStandardMaterial,
    THREE.MeshPhysicalMaterial
  >();

  const convertedMaterials = new Set<THREE.MeshPhysicalMaterial>();

  const convertMaterial = (material: THREE.Material): THREE.Material => {
    // 이미 PhysicalMaterial이라면 그대로 유지
    if (material instanceof THREE.MeshPhysicalMaterial) {
      return material;
    }

    // GLTF의 일반적인 MeshStandardMaterial만 변환
    if (!isMeshStandardMaterial(material)) {
      return material;
    }

    const cached = materialCache.get(material);

    if (cached) {
      return cached;
    }

    const physical = convertStandardToPhysical(material, options);

    materialCache.set(material, physical);
    convertedMaterials.add(physical);

    return physical;
  };

  scene.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) {
      return;
    }

    object.material = Array.isArray(object.material)
      ? object.material.map(convertMaterial)
      : convertMaterial(object.material);
  });

  return convertedMaterials;
}

/* 
export function Model({
  url,
  physicalOptions,
  ...groupProps
}: ModelProps) {
  const gltf = useGLTF(url) as GLTF

  const { scene, generatedMaterials } = useMemo(() => {
    
    //  * useGLTF는 URL별 결과를 캐시한다.
    //  * gltf.scene을 직접 수정하면 같은 모델을 사용하는 다른 컴포넌트에도
    //  * material 변경이 전파될 수 있으므로 scene graph를 복제한다.
    
    const clonedScene = gltf.scene.clone(true)

    const generatedMaterials = convertSceneMaterials(
      clonedScene,
      physicalOptions,
    )

    return {
      scene: clonedScene,
      generatedMaterials,
    }
  }, [gltf.scene, physicalOptions])

  useEffect(() => {
    return () => {
      
      //  * 새로 생성한 material만 정리한다.
      //  * map, normalMap 등의 Texture는 원본 GLTF와 공유하므로
      //  * 여기서 dispose하면 안 된다.
      
      generatedMaterials.forEach((material) => {
        material.dispose()
      })
    }
  }, [generatedMaterials])

  return (
    <group {...groupProps}>
      <primitive object={scene} />
    </group>
  )
}

useGLTF.preload('/models/example.glb') */
