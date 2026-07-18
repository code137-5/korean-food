import { Vector2, type BufferGeometry, type Texture } from "three";

type TextureDataImage = {
  data: ArrayLike<number>;
  height: number;
  width: number;
};

type GetAverageDisplacedYOptions = {
  displacementBias?: number;
  displacementWeightAttribute?: string;
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

    return new ImageData(
      data,
      image.width,
      image.height,
    );
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

export function getAverageDisplacedY(
  geometry: BufferGeometry,
  displacementMap: Texture,
  displacementScale: number,
  {
    displacementBias = 0,
    displacementWeightAttribute,
  }: GetAverageDisplacedYOptions = {},
): number {
  const position = geometry.getAttribute("position");
  const uv = geometry.getAttribute("uv");
  const displacementWeight = displacementWeightAttribute
    ? geometry.getAttribute(displacementWeightAttribute)
    : null;

  if (!position) {
    throw new Error("Geometry position attribute is required.");
  }

  if (!uv) {
    throw new Error("Geometry uv attribute is required.");
  }

  if (position.count === 0) {
    return 0;
  }

  if (displacementWeight && displacementWeight.count !== position.count) {
    throw new Error("Displacement weight attribute count does not match.");
  }

  if (displacementMap.matrixAutoUpdate) {
    displacementMap.updateMatrix();
  }

  const imageData = getTextureImageData(displacementMap);
  const textureUv = new Vector2();
  let totalY = 0;

  for (let index = 0; index < position.count; index += 1) {
    textureUv.set(uv.getX(index), uv.getY(index));
    displacementMap.transformUv(textureUv);

    const displacement =
      sampleDisplacementRedChannel(imageData, textureUv.x, textureUv.y) *
        displacementScale +
      displacementBias;
    const weight = displacementWeight?.getX(index) ?? 1;

    totalY += position.getY(index) + displacement * weight;
  }

  return totalY / position.count;
}
