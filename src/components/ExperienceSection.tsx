"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";

const experiences = [
  {
    company: "Equiem",
    role: { pl: "Senior Fullstack Engineer", en: "Senior Fullstack Engineer" },
    period: { start: "2024-02", end: null },
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

  return (
    <section className="py-24 pt-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-5xl font-bold mb-16 gradient-text"
        >
          {t("title")}
        </motion.h2>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-0 md:left-8 top-0 bottom-0 w-px bg-surface-light" />

          <div className="space-y-12">
            {experiences.map((exp, idx) => (
              <motion.div
                key={`${exp.company}-${exp.period.start}`}
                initial={{ opacity: 0, x: -30, filter: "blur(6px)" }}
                whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.05 * idx,
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative pl-8 md:pl-20"
              >
                {/* Timeline dot */}
                <div className="absolute left-0 md:left-8 top-2 w-3 h-3 -translate-x-1.5 rounded-full bg-primary animate-pulse-ring" />

                <div className="p-6 rounded-2xl bg-surface border border-surface-light hover:border-primary/30 transition-all hover-tilt">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                    <h3 className="text-xl font-semibold text-foreground">
                      {exp.company}
                    </h3>
                    <span className="text-sm text-muted whitespace-nowrap">
                      {formatDate(exp.period.start, "en")} —{" "}
                      {exp.period.end
                        ? formatDate(exp.period.end, "en")
                        : t("present")}
                    </span>
                  </div>

                  <p className="text-primary font-medium text-sm mb-3">
                    {exp.role.en}
                  </p>

                  <p className="text-muted text-sm leading-relaxed mb-4">
                    {exp.description.en}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {exp.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
