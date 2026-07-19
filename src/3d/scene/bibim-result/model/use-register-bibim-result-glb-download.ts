import { useCallback, useEffect, type RefObject } from "react";
import type { Group } from "three";

import { useBibimResultExportStore } from "@/pages/cuisines/bibim/craft/result/model/bibim-result-export-store";
import { createDisplacementBakedExportObject } from "../lib/create-displacement-baked-export-object";
import { exportObjectAsGlb } from "../lib/export-object-as-glb";

export function useRegisterBibimResultGlbDownload(
  groupRef: RefObject<Group | null>,
) {
  const setDownloadGlb = useBibimResultExportStore(
    (state) => state.setDownloadGlb,
  );
  const downloadGlb = useCallback(async () => {
    if (!groupRef.current) {
      return;
    }

    const exportObject = createDisplacementBakedExportObject(groupRef.current);

    await exportObjectAsGlb(exportObject);
  }, [groupRef]);

  useEffect(() => {
    setDownloadGlb(downloadGlb);

    return () => {
      setDownloadGlb(null);
    };
  }, [downloadGlb, setDownloadGlb]);
}
