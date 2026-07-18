import { Share2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ResultActionButton } from "./result-action-button";

export function SnsShareButton() {
  const { t } = useTranslation("bibim-craft-result");

  return <ResultActionButton icon={Share2} label={t("actions.snsShare")} />;
}
