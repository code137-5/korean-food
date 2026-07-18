import { Download } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ResultActionButton } from "./result-action-button";

export function DownloadGlbButton() {
  const { t } = useTranslation("bibim-craft-result");

  return <ResultActionButton icon={Download} label={t("actions.downloadGlb")} />;
}
