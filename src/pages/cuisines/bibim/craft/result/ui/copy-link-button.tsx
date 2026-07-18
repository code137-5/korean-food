import { Link } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ResultActionButton } from "./result-action-button";

export function CopyLinkButton() {
  const { t } = useTranslation("bibim-craft-result");

  return <ResultActionButton icon={Link} label={t("actions.copyLink")} />;
}
