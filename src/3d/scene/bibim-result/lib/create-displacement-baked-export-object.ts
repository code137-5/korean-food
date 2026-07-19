import {
  BufferGeometry,
  Group,
  Material,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  Vector2,
  Vector3,
  type BufferAttribute,
  type Texture,
} from "three";

import { DISPLACEMENT_WEIGHT_ATTRIBUTE } from "@/shared/3d/material";

type TextureDataImage = {
  data: ArrayLike<number>;
  height: number;
  width: number;
};

function isTextureDataImage(image: unknown): image is TextureDataImage {
  if (!image || typeof image !== "object") {
    return false;
  }

  const candidate = image as Partial<TextureDataImage>;

  return (
    typeof candidate.width === "number" &&
    typeof candidate.height === "number" &&
    candidate.data !== undefined
  );
}

function isImageData(image: unknown): image is ImageData {
  return typeof ImageData !== "undefined" && image instanceof ImageData;
}

function isCanvasImageSource(image: unknown): image is CanvasImageSource {
  if (!image || typeof image !== "object") {
    return false;
  }

  return (
    (typeof HTMLImageElement !== "undefined" &&
      image instanceof HTMLImageElement) ||
    (typeof HTMLCanvasElement !== "undefined" &&
      image instanceof HTMLCanvasElement) ||
    (typeof OffscreenCanvas !== "undefined" &&
      image instanceof OffscreenCanvas) ||
    (typeof ImageBitmap !== "undefined" && image instanceof ImageBitmap) ||
    (typeof HTMLVideoElement !== "undefined" &&
      image instanceof HTMLVideoElement) ||
    (typeof VideoFrame !== "undefined" && image instanceof VideoFrame)
  );
}

function getCanvasImageSourceSize(image: CanvasImageSource): {
  height: number;
  width: number;
} {
  if (
    typeof HTMLImageElement !== "undefined" &&
    image instanceof HTMLImageElement
  ) {
    return {
      height: image.naturalHeight,
      width: image.naturalWidth,
    };
  }

  if (
    typeof HTMLVideoElement !== "undefined" &&
    image instanceof HTMLVideoElement
  ) {
    return {
      height: image.videoHeight,
      width: image.videoWidth,
    };
  }

  if (
    (typeof HTMLCanvasElement !== "undefined" &&
      image instanceof HTMLCanvasElement) ||
    (typeof OffscreenCanvas !== "undefined" &&
      image instanceof OffscreenCanvas) ||
    (typeof ImageBitmap !== "undefined" && image instanceof ImageBitmap)
  ) {
    return {
      height: image.height,
      width: image.width,
    };
  }

  if (typeof VideoFrame !== "undefined" && image instanceof VideoFrame) {
    return {
      height: image.displayHeight,
      width: image.displayWidth,
    };
  }

  throw new Error("Unsupported displacement texture image source.");
}

function getTextureImageData(texture: Texture): ImageData {
  const image = texture.image as unknown;

  if (isImageData(image)) {
    return image;
  }

  if (isTextureDataImage(image)) {
    const data =
      ArrayBuffer.isView(image.data) &&
      (image.data instanceof Float32Array || image.data instanceof Float64Array)
        ? Uint8ClampedArray.from(image.data, (value) => value * 255)
        : Uint8ClampedArray.from(image.data);

    return new ImageData(data, image.width, image.height);
  }

  if (!isCanvasImageSource(image)) {
    throw new Error("Unsupported displacement texture image source.");
  }

  const { height, width } = getCanvasImageSourceSize(image);

  if (width <= 0 || height <= 0) {
    throw new Error("Displacement texture image is not loaded.");
  }

  const canvas = document.createElement("canvas");

  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Failed to create a 2D canvas context.");
  }

  context.drawImage(image, 0, 0, width, height);

  return context.getImageData(0, 0, width, height);
}

function sampleDisplacementRedChannel(
  imageData: ImageData,
  u: number,
  v: number,
): number {
  const { data, height, width } = imageData;
  const x = Math.min(Math.max(u * (width - 1), 0), width - 1);
  const y = Math.min(Math.max(v * (height - 1), 0), height - 1);
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const x1 = Math.min(x0 + 1, width - 1);
  const y1 = Math.min(y0 + 1, height - 1);
  const xFactor = x - x0;
  const yFactor = y - y0;
  const topLeft = data[(y0 * width + x0) * 4] / 255;
  const topRight = data[(y0 * width + x1) * 4] / 255;
  const bottomLeft = data[(y1 * width + x0) * 4] / 255;
  const bottomRight = data[(y1 * width + x1) * 4] / 255;
  const top = topLeft + (topRight - topLeft) * xFactor;
  const bottom = bottomLeft + (bottomRight - bottomLeft) * xFactor;

  return top + (bottom - top) * yFactor;
}

function isMeshStandardMaterial(
  material: Material,
): material is MeshStandardMaterial {
  return material instanceof MeshStandardMaterial;
}

function cloneMaterial(material: Material | Material[]): Material | Material[] {
  return Array.isArray(material)
    ? material.map((item) => item.clone())
    : material.clone();
}

function getPrimaryMeshStandardMaterial(
  material: Material | Material[],
): MeshStandardMaterial | null {
  const primaryMaterial = Array.isArray(material) ? material[0] : material;

  return isMeshStandardMaterial(primaryMaterial) ? primaryMaterial : null;
}

function clearMaterialDisplacement(material: Material | Material[]): void {
  const materials = Array.isArray(material) ? material : [material];

  materials.forEach((item) => {
    if (!isMeshStandardMaterial(item)) {
      return;
    }

    item.displacementMap = null;
    item.displacementScale = 0;
    item.displacementBias = 0;
    item.onBeforeCompile = () => {};
    item.needsUpdate = true;
  });
}

function bakeGeometryDisplacement(
  geometry: BufferGeometry,
  material: MeshStandardMaterial,
): void {
  const displacementMap = material.displacementMap;
  const position = geometry.getAttribute("position") as
    | BufferAttribute
    | undefined;
  const normal = geometry.getAttribute("normal") as BufferAttribute | undefined;
  const uv = geometry.getAttribute("uv") as BufferAttribute | undefined;

  if (!displacementMap || !position || !normal || !uv) {
    return;
  }

  const displacementWeight = geometry.getAttribute(
    DISPLACEMENT_WEIGHT_ATTRIBUTE,
  ) as BufferAttribute | undefined;

  if (displacementMap.matrixAutoUpdate) {
    displacementMap.updateMatrix();
  }

  const imageData = getTextureImageData(displacementMap);
  const textureUv = new Vector2();
  const normalVector = new Vector3();
  const displacementScale = material.displacementScale;
  const displacementBias = material.displacementBias;

  for (let index = 0; index < position.count; index += 1) {
    textureUv.set(uv.getX(index), uv.getY(index));
    displacementMap.transformUv(textureUv);

    const displacementHeight =
      sampleDisplacementRedChannel(imageData, textureUv.x, textureUv.y) *
        displacementScale +
      displacementBias;
    const weight = displacementWeight?.getX(index) ?? 1;

    normalVector
      .set(normal.getX(index), normal.getY(index), normal.getZ(index))
      .normalize()
      .multiplyScalar(displacementHeight * weight);

    position.setXYZ(
      index,
      position.getX(index) + normalVector.x,
      position.getY(index) + normalVector.y,
      position.getZ(index) + normalVector.z,
    );
  }

  position.needsUpdate = true;
  geometry.deleteAttribute(DISPLACEMENT_WEIGHT_ATTRIBUTE);
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
}

function cloneMeshForExport(source: Mesh): Mesh {
  const geometry = source.geometry.clone();
  const material = cloneMaterial(source.material);
  const mesh = new Mesh(geometry, material);
  const primaryMaterial = getPrimaryMeshStandardMaterial(material);

  mesh.name = source.name;
  mesh.castShadow = source.castShadow;
  mesh.receiveShadow = source.receiveShadow;
  mesh.renderOrder = source.renderOrder;
  mesh.frustumCulled = source.frustumCulled;
  mesh.matrix.copy(source.matrix);
  mesh.matrixAutoUpdate = source.matrixAutoUpdate;

  if (primaryMaterial) {
    bakeGeometryDisplacement(geometry, primaryMaterial);
  }

  clearMaterialDisplacement(material);

  return mesh;
}

function copyObjectTransform(source: Object3D, target: Object3D): void {
  target.name = source.name;
  target.matrix.copy(source.matrix);
  target.matrixWorld.copy(source.matrixWorld);
  target.matrixAutoUpdate = source.matrixAutoUpdate;
  target.position.copy(source.position);
  target.quaternion.copy(source.quaternion);
  target.scale.copy(source.scale);
  target.rotation.copy(source.rotation);
  target.up.copy(source.up);
  target.visible = source.visible;
  target.castShadow = source.castShadow;
  target.receiveShadow = source.receiveShadow;
  target.renderOrder = source.renderOrder;
  target.frustumCulled = source.frustumCulled;
  target.userData = { ...source.userData };
}

function cloneObjectForExport(source: Object3D): Object3D {
  const target = source instanceof Mesh ? cloneMeshForExport(source) : new Group();

  copyObjectTransform(source, target);

  source.children.forEach((child) => {
    target.add(cloneObjectForExport(child));
  });

  return target;
}

export function createDisplacementBakedExportObject(object: Object3D): Object3D {
  object.updateMatrixWorld(true);

  return cloneObjectForExport(object);
}
