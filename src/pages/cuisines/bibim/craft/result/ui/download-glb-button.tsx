import { Download } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useBibimResultExportStore } from "../model/bibim-result-export-store";
import { ResultActionButton } from "./result-action-button";

export function DownloadGlbButton() {
  const { t } = useTranslation("bibim-craft-result");
  const downloadGlb = useBibimResultExportStore((state) => state.downloadGlb);

  return (
    <ResultActionButton
      disabled={!downloadGlb}
      icon={Download}
      label={t("actions.downloadGlb")}
      onClick={() => void downloadGlb?.()}
    />
  );
}
