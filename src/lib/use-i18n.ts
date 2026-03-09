"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export function useI18n() {
  const { t, i18n } = useTranslation("common");

  const changeLanguage = async (locale: string) => {
    await i18n.changeLanguage(locale);
  };

  useEffect(() => {
    if (i18n.language) {
      document.documentElement.setAttribute("lang", i18n.language);
      document.documentElement.setAttribute(
        "dir",
        i18n.language === "ar" ? "rtl" : "ltr",
      );
    }
  }, [i18n.language]);

  return {
    t,
    locale: i18n.language,
    changeLanguage,
    isRTL: i18n.language === "ar",
  };
}
