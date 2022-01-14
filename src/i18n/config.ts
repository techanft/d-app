import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { Language } from "../shared/enumeration/language";
import translationEn from "./en/translation.json";
import translationVi from "./vi/translation.json";

export const resources = {
  en: {
    translation: translationEn,
  },
  vi: {
    translation: translationVi,
  },
} as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: Language.en,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });
export default i18n;
