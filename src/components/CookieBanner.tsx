"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

const COOKIE_CONSENT_KEY = "cookie-consent-accepted";

export function CookieBanner() {
  const t = useTranslations("cookies");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      setVisible(!localStorage.getItem(COOKIE_CONSENT_KEY));
    } catch {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, "true");
    } finally {
      setVisible(false);
    }
  };

  if (!visible) return null;

  return (
    <section className="rpg-cookie" aria-label={t("message")}>
      <svg className="rpg-cookie-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3 4.5 6v5.4c0 4.6 3.2 8 7.5 9.6 4.3-1.6 7.5-5 7.5-9.6V6L12 3Z" />
        <path d="m9 12 2 2 4-5" />
      </svg>
      <p>{t("message")}</p>
      <button type="button" onClick={accept}>
        {t("accept")}
      </button>
    </section>
  );
}
