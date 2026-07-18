import type { Object3D } from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

import { saveExportedGlb } from "./save-exported-glb";

export function exportObjectAsGlb(object: Object3D): Promise<void> {
  const exporter = new GLTFExporter();

  return new Promise((resolve, reject) => {
    exporter.parse(
      object,
      (result) => {
        saveExportedGlb(result);
        resolve();
      },
      (error) => {
        reject(error);
      },
      { binary: true },
    );
  });
}
