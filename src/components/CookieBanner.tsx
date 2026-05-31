"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

const COOKIE_CONSENT_KEY = "cookie-consent-accepted";

export function CookieBanner() {
  const t = useTranslations("cookies");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!accepted) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-surface-light/50 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-sm text-muted text-center sm:text-left">
          {t("message")}
        </p>
        <button
          onClick={accept}
          className="shrink-0 px-4 py-1.5 text-sm font-medium rounded-full bg-primary text-white hover:bg-primary-light transition-colors cursor-pointer"
        >
          {t("accept")}
        </button>
      </div>
    </div>
  );
}
