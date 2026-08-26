"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Link } from "@/i18n/navigation";
import magePortrait from "../../docs/design/rpg/leszek-mage-card-v3.png";

const tools = ["TypeScript", "React", "Node.js"];

export function Hero() {
  const t = useTranslations("hero");
  const rpg = useTranslations("rpg");
  const [firstName, ...lastNameParts] = t("name").split(" ");

  return (
    <section className="rpg-hero">
      <div className="rpg-hero-layout">
        <motion.header
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="rpg-hero-identity"
        >
          <p className="rpg-eyebrow">{rpg("characterKicker")}</p>
          <h1 className="rpg-hero-name">
            <span>{firstName}</span>
            <strong>{lastNameParts.join(" ")}</strong>
          </h1>
          <p className="rpg-professional-title">{t("title")}</p>
        </motion.header>

        <motion.figure
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.75, delay: 0.08 }}
          className="rpg-portrait-card"
        >
          <div className="rpg-portrait-frame">
            <Image
              src={magePortrait}
              alt={`${t("name")} — ${rpg("className")}`}
              className="rpg-portrait-image"
              sizes="(max-width: 720px) 88vw, (max-width: 1099px) 42vw, 29vw"
              placeholder="blur"
              preload
            />
            <i className="rpg-frame-corner rpg-frame-corner-tl" />
            <i className="rpg-frame-corner rpg-frame-corner-tr" />
            <i className="rpg-frame-corner rpg-frame-corner-bl" />
            <i className="rpg-frame-corner rpg-frame-corner-br" />
          </div>
          <figcaption>
            <span>{rpg("classLabel")}</span>
            <strong>{rpg("className")}</strong>
            <small>{rpg("classCaption")}</small>
          </figcaption>
        </motion.figure>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.18 }}
          className="rpg-character-story"
        >
          <p className="rpg-story-line">{rpg("storyLine")}</p>
          <p className="rpg-hero-summary">{t("subtitle")}</p>

          <dl className="rpg-character-facts">
            <div>
              <dt>12+</dt>
              <dd>{rpg("years")}</dd>
            </div>
            <div>
              <dt>✦</dt>
              <dd>{rpg("specialty")}</dd>
            </div>
          </dl>

          <div className="rpg-hero-actions">
            <Link href="/contact" className="rpg-primary-button">
              <span>{t("cta")}</span>
              <span aria-hidden="true">→</span>
            </Link>
            <Link href="/services" className="rpg-secondary-link">
              {t("ctaSecondary")}
            </Link>
          </div>
          <p className="rpg-estimate-note">{rpg("estimateNote")}</p>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.32 }}
          className="rpg-equipment"
          aria-label={rpg("equipment")}
        >
          <span>{rpg("equipment")}</span>
          <div>
            {tools.map((tool) => (
              <strong key={tool}>{tool}</strong>
            ))}
          </div>
        </motion.aside>
      </div>
    </section>
  );
}
