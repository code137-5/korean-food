import i18n from "i18next";
import HttpBackend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

const defaultLanguage =
  typeof navigator !== "undefined" && navigator.language.startsWith("ko")
    ? "ko"
    : "en";

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: `${import.meta.env.BASE_URL}localization/{{lng}}/{{ns}}.json`,
    },
    defaultNS: "season",
    fallbackLng: "ko",
    interpolation: {
      escapeValue: false,
    },
    lng: defaultLanguage,
    ns: ["season"],
    supportedLngs: ["ko", "en"],
    react: {
      useSuspense: false,
    },
  });

export { i18n };
