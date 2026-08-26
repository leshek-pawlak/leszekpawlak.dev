"use client";

import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="rpg-footer">
      <div className="rpg-footer-inner">
        <p>
          © {new Date().getFullYear()} Leszek Pawlak. {t("rights")}
        </p>
        <span className="rpg-footer-rule" aria-hidden="true" />
        <div className="rpg-footer-links">
          <a
            href="https://github.com/leshek-pawlak"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            GitHub <span aria-hidden="true">↗</span>
          </a>
          <a
            href="https://linkedin.com/in/leszek-pawlak"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            LinkedIn <span aria-hidden="true">↗</span>
          </a>
        </div>
        <span className="rpg-footer-star" aria-hidden="true">
          ✦
        </span>
      </div>
    </footer>
  );
}
