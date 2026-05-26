"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";

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

  return (
    <section className="py-24 pt-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-5xl font-bold mb-8 gradient-text"
        >
          {t("title")}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg text-muted max-w-3xl mb-16 leading-relaxed"
        >
          {t("bio")}
        </motion.p>

        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-semibold mb-8 text-foreground"
        >
          {t("skills")}
        </motion.h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {(Object.keys(skills) as Array<keyof typeof skills>).map(
            (category, idx) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.1 * idx,
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="p-6 rounded-2xl bg-surface border border-surface-light hover-tilt"
              >
                <h4 className="text-sm font-semibold uppercase tracking-wider text-primary mb-4">
                  {t(`skillCategories.${category}`)}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {skills[category].map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 text-sm rounded-full bg-surface-light text-foreground/80 border border-surface-light hover:border-primary/50 hover:text-primary transition-all duration-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
