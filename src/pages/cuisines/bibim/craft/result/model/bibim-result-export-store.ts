import { create } from "zustand";

type BibimResultExportState = {
  downloadGlb: (() => Promise<void>) | null;
  setDownloadGlb: (downloadGlb: (() => Promise<void>) | null) => void;
};

export const useBibimResultExportStore = create<BibimResultExportState>(
  (set) => ({
    downloadGlb: null,
    setDownloadGlb: (downloadGlb) => set({ downloadGlb }),
  }),
);
