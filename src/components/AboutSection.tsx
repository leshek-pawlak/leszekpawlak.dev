"use client";

import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "motion/react";

const skills = {
  languages: [
    "TypeScript",
    "JavaScript",
    "React",
    "Next.js",
    "Node.js",
    "Fastify",
    "GraphQL",
    "Vue",
    "HTML/CSS",
  ],
  databases: ["PostgreSQL", "MongoDB", "OpenSearch/Elasticsearch", "MySQL"],
  cloud: ["AWS", "Docker", "CI/CD", "Vercel", "Lambda"],
  other: [
    "Architecture Design",
    "Code Review",
    "OpenAI GPT",
    "D3.js",
    "Agile/Scrum",
  ],
};

export function AboutSection() {
  const t = useTranslations("about");
  const rpg = useTranslations("rpg");
  const reduceMotion = useReducedMotion();
  const skillCount = Object.values(skills).flat().length;

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
          <p className="rpg-eyebrow">{rpg("aboutKicker")}</p>
          <h1 className="rpg-section-title">{t("title")}</h1>
          <div className="rpg-section-rule" aria-hidden="true" />
        </motion.header>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="rpg-about-summary rpg-panel"
        >
          <p>{t("bio")}</p>
          <strong>{rpg("skillsCount", { count: skillCount })}</strong>
        </motion.div>

        <h2 className="rpg-subsection-title">{t("skills")}</h2>

        <div className="rpg-dossier-grid">
          {(Object.keys(skills) as Array<keyof typeof skills>).map(
            (category, idx) => (
              <motion.article
                key={category}
                initial={
                  reduceMotion
                    ? false
                    : { opacity: 0, y: 30, filter: "blur(8px)" }
                }
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.1 * idx,
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="rpg-dossier-panel rpg-panel"
              >
                <span className="rpg-panel-index">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <h3>{t(`skillCategories.${category}`)}</h3>
                <div className="rpg-tag-list">
                  {skills[category].map((skill) => (
                    <span key={skill} className="rpg-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.article>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
