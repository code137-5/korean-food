import { RotateCw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ResultActionButton } from "./result-action-button";

export function RemakeButton() {
  const { t } = useTranslation("bibim-craft-result");

  return <ResultActionButton icon={RotateCw} label={t("actions.remake")} />;
}
