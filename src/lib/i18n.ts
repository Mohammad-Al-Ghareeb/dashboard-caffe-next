import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import translation files
import enCommon from "../../public/locales/en/common.json";
import arCommon from "../../public/locales/ar/common.json";

// Initialize i18next
i18n.use(initReactI18next).init({
  resources: {
    en: { common: enCommon },
    ar: { common: arCommon },
  },
  lng: "en",
  fallbackLng: "en",
  defaultNS: "common",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
