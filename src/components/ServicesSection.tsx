"use client";

import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "motion/react";

const services = [
  {
    key: "consulting",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
    ),
  },
  {
    key: "estimation",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    key: "development",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
        />
      </svg>
    ),
  },
  {
    key: "ai",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
] as const;

export function ServicesSection() {
  const t = useTranslations("services");
  const rpg = useTranslations("rpg");
  const reduceMotion = useReducedMotion();

  return (
    <section className="rpg-content-section">
      <div className="rpg-content-inner">
        <motion.header
          initial={
            reduceMotion ? false : { opacity: 0, y: 30, filter: "blur(8px)" }
          }
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="rpg-section-intro"
        >
          <p className="rpg-eyebrow">{rpg("servicesKicker")}</p>
          <h1 className="rpg-section-title">{t("title")}</h1>
          <p className="rpg-section-summary">{t("subtitle")}</p>
          <div className="rpg-section-rule" aria-hidden="true" />
        </motion.header>

        <div className="rpg-spell-grid">
          {services.map((service, idx) => (
            <motion.article
              key={service.key}
              initial={reduceMotion ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: 0.1 * idx,
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="rpg-spell-card rpg-panel"
            >
              <div className="rpg-spell-heading">
                <span className="rpg-spell-index">
                  {rpg("spell")} {String(idx + 1).padStart(2, "0")}
                </span>
                <div className="rpg-spell-icon" aria-hidden="true">
                  {service.icon}
                </div>
              </div>
              <h2>{t(`${service.key}.title`)}</h2>
              <p>{t(`${service.key}.description`)}</p>
              <i aria-hidden="true">✦</i>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
