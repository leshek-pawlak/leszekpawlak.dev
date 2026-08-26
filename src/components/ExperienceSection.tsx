"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion, useReducedMotion } from "motion/react";

const experiences = [
  {
    company: "Fungies.io",
    role: { pl: "Senior Fullstack Engineer", en: "Senior Fullstack Engineer" },
    period: { start: "2026-07", end: null },
    description: {
      pl: "Senior Fullstack Engineer w Fungies, platformie do monetyzacji i płatności dla produktów cyfrowych, gier i SaaS. Praca w monorepo TypeScript (pnpm + Turborepo) obejmująca dashboard dla merchantów w Next.js oraz sklep i checkout dla klientów po stronie frontendu, a także backend oparty o tRPC i TypeORM/PostgreSQL działający na AWS (ECS, RDS, Lambda). Skupienie na architekturze multi-tenant, integracjach z dostawcami płatności oraz embeddable checkout SDK, a także na CI/CD i observability utrzymujących całość w gotowości do wdrożeń.",
      en: "Senior Fullstack Engineer at Fungies, a monetization and payments platform for digital products, games and SaaS. Working across a TypeScript monorepo (pnpm + Turborepo): a Next.js merchant dashboard and customer-facing store/checkout on the frontend, and a tRPC + TypeORM/PostgreSQL backend running on AWS (ECS, RDS, Lambda). Focused on multi-tenant architecture, payment provider integrations, and the embeddable checkout SDK, plus the CI/CD and observability that keep it all shippable.",
    },
    tech: ["TypeScript", "Next.js", "tRPC", "TypeORM", "PostgreSQL", "AWS"],
  },
  {
    company: "Equiem",
    role: { pl: "Senior Fullstack Engineer", en: "Senior Fullstack Engineer" },
    period: { start: "2024-02", end: "2026-06" },
    description: {
      pl: "Praca nad najbardziej wydajnościowo wymagającą częścią aplikacji, obsługującą największy wolumen zapytań do bazy danych. Rozwój i optymalizacja mutacji GraphQL, zapytań i integracji API. Budowa i utrzymanie aplikacji React połączonych z serwisami Node.js.",
      en: "Collaborating on the most performance-sensitive part of the application, handling the highest volume of database queries. Developing and optimizing GraphQL mutations, queries, and API integrations. Building and maintaining React front-end applications connected to Node.js services.",
    },
    tech: ["React", "Node.js", "GraphQL", "TypeScript", "PostgreSQL"],
  },
  {
    company: "Gratified.io",
    role: { pl: "Tech Lead", en: "Tech Lead" },
    period: { start: "2020-10", end: "2024-01" },
    description: {
      pl: "Kluczowa rola w kształtowaniu strategii technologicznej firmy. Kierowanie rozwojem systemu czatu opartego na GPT-OpenAI. Budowa skalowalnych systemów backendowych z użyciem Node.js i OpenSearch.",
      en: "Played a key role in shaping the company's technology strategy. Led the development of a GPT-OpenAI-based chat system. Built scalable, efficient backend systems using Node.js and OpenSearch.",
    },
    tech: [
      "React",
      "Node.js",
      "TypeScript",
      "OpenSearch",
      "MongoDB",
      "Fastify",
    ],
  },
  {
    company: "Artifact - Human Experience Agency",
    role: { pl: "Senior Frontend Engineer", en: "Senior Frontend Engineer" },
    period: { start: "2020-04", end: "2020-09" },
    description: {
      pl: "Rozwój frontendu, poprawa UX i aspektów designu z użyciem React i TypeScript.",
      en: "Focused on frontend development, enhancing user experience and design aspects using React and TypeScript.",
    },
    tech: ["React", "TypeScript"],
  },
  {
    company: "PizzaPortal (Glovo)",
    role: { pl: "Senior Frontend Developer", en: "Senior Frontend Developer" },
    period: { start: "2018-04", end: "2020-03" },
    description: {
      pl: "Rozwój frontendu, poprawa UX i aspektów designu z użyciem React, Redux i TypeScript.",
      en: "Focused on frontend development, enhancing user experience and design aspects using React, Redux and TypeScript.",
    },
    tech: ["React", "Redux", "TypeScript"],
  },
  {
    company: "Uptowork",
    role: { pl: "Frontend Web Developer", en: "Frontend Web Developer" },
    period: { start: "2017-07", end: "2018-03" },
    description: {
      pl: "Rozwój i optymalizacja frontendu platformy do tworzenia CV z użyciem React i GraphQL.",
      en: "Developed and optimized frontend aspects of the resume builder platform using React and GraphQL.",
    },
    tech: ["React", "GraphQL"],
  },
  {
    company: "IT Kontrakt (Roche)",
    role: { pl: "Frontend Developer", en: "Frontend Developer" },
    period: { start: "2017-02", end: "2017-06" },
    description: {
      pl: "Praca nad projektem Roche, rozwój aplikacji z użyciem D3.js.",
      en: "Worked on a Roche project, developing applications using D3.js.",
    },
    tech: ["D3.js", "JavaScript"],
  },
  {
    company: "Bitnoise",
    role: { pl: "Web Developer", en: "Web Developer" },
    period: { start: "2014-03", end: "2017-01" },
    description: {
      pl: "Tworzenie i rozwój aplikacji webowych z użyciem React, AngularJS i Symfony2.",
      en: "Created and developed web applications using React, AngularJs, and Symfony2.",
    },
    tech: ["React", "AngularJS", "Symfony2", "PHP"],
  },
  {
    company: "Hive Sports & Media",
    role: { pl: "Web Developer", en: "Web Developer" },
    period: { start: "2013-04", end: "2014-02" },
    description: {
      pl: "Zdobycie fundamentalnych umiejętności w PHP, WordPress, CakePHP, JavaScript, CSS, HTML.",
      en: "Gained foundational skills in PHP, WordPress, CakePHP, JavaScript, CSS, HTML.",
    },
    tech: ["PHP", "WordPress", "JavaScript", "CSS", "HTML"],
  },
];

function formatDate(dateStr: string, locale: string): string {
  const [year, month] = dateStr.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString(locale, { year: "numeric", month: "short" });
}

export function ExperienceSection() {
  const t = useTranslations("experience");
  const rpg = useTranslations("rpg");
  const reduceMotion = useReducedMotion();
  const locale = useLocale() as "pl" | "en";

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
          <p className="rpg-eyebrow">{rpg("experienceKicker")}</p>
          <h1 className="rpg-section-title">{t("title")}</h1>
          <div className="rpg-section-rule" aria-hidden="true" />
        </motion.header>

        <div className="rpg-journal">
          {experiences.map((exp, idx) => (
            <motion.article
              key={`${exp.company}-${exp.period.start}`}
              initial={reduceMotion ? false : { opacity: 0, x: -26 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                delay: 0.04 * idx,
                duration: 0.55,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="rpg-journal-entry"
            >
              <div className="rpg-journal-index" aria-hidden="true">
                <span>{String(experiences.length - idx).padStart(2, "0")}</span>
                <i />
              </div>
              <div className="rpg-journal-card rpg-panel">
                <header>
                  <p>
                    {rpg("quest")}{" "}
                    {String(experiences.length - idx).padStart(2, "0")}
                  </p>
                  <time>
                    {formatDate(exp.period.start, locale)} —{" "}
                    {exp.period.end
                      ? formatDate(exp.period.end, locale)
                      : t("present")}
                  </time>
                </header>
                <h2>{exp.company}</h2>
                <p className="rpg-journal-role">{exp.role[locale]}</p>
                <p className="rpg-journal-description">
                  {exp.description[locale]}
                </p>
                <div className="rpg-tag-list">
                  {exp.tech.map((tech) => (
                    <span key={tech} className="rpg-tag">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
