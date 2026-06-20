import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage ?? i18n.language;
  const isKorean = language.startsWith("ko");
  const nextLanguage = isKorean ? "en" : "ko";

  return (
    <Button
      type="button"
      variant="secondary"
      size="lg"
      className="pointer-events-auto border border-stone-300/40 bg-black/65 text-stone-100 shadow-lg backdrop-blur hover:bg-black/80"
      aria-label={isKorean ? "Switch language to English" : "언어를 한국어로 변경"}
      onClick={() => void i18n.changeLanguage(nextLanguage)}
    >
      <Languages aria-hidden="true" />
      {isKorean ? "EN" : "KO"}
    </Button>
  );
}
