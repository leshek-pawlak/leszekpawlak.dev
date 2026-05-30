"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";

const steps = [
  {
    key: "inquiry",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    ),
  },
  {
    key: "nda",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
  },
  {
    key: "scope",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
        />
      </svg>
    ),
  },
  {
    key: "estimate",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    key: "delivery",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        />
      </svg>
    ),
  },
  {
    key: "success",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
] as const;

export function WorkflowTimeline() {
  const t = useTranslations("workflow");

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h1 className="text-4xl sm:text-5xl font-bold gradient-text mb-4">
            {t("title")}
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-px bg-linear-to-b from-primary via-accent to-primary/20 sm:-translate-x-px" />

          {steps.map((step, index) => {
            const isEven = index % 2 === 0;
            return (
              <motion.div
                key={step.key}
                initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative flex items-start mb-12 last:mb-0 ${
                  isEven ? "sm:flex-row" : "sm:flex-row-reverse"
                }`}
              >
                {/* Content card */}
                <div
                  className={`ml-16 sm:ml-0 sm:w-[calc(50%-2rem)] ${
                    isEven ? "sm:pr-0 sm:text-right" : "sm:pl-0 sm:text-left"
                  }`}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-surface border border-surface-light rounded-xl p-6 hover-tilt"
                  >
                    <span className="inline-block text-xs font-mono text-primary mb-2">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {t(`steps.${step.key}.title`)}
                    </h3>
                    <p className="text-sm text-muted leading-relaxed">
                      {t(`steps.${step.key}.description`)}
                    </p>
                  </motion.div>
                </div>

                {/* Center dot */}
                <div className="absolute left-6 sm:left-1/2 -translate-x-1/2 flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                      delay: index * 0.1 + 0.2,
                    }}
                    className="w-12 h-12 rounded-full bg-surface border-2 border-primary flex items-center justify-center text-primary shadow-lg glow-primary"
                  >
                    {step.icon}
                  </motion.div>
                </div>

                {/* Spacer for the other side */}
                <div className="hidden sm:block sm:w-[calc(50%-2rem)]" />
              </motion.div>
            );
          })}
        </div>

        {/* NDA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-24 bg-surface border border-surface-light rounded-2xl p-8 sm:p-10"
        >
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-4">
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {t("nda_section.title")}
            </h2>
            <p className="text-muted max-w-lg mx-auto">
              {t("nda_section.description")}
            </p>
          </div>

          <div className="flex justify-center">
            <a
              href="/nda-leszek-pawlak.pdf"
              download="NDA-Leszek-Pawlak-PL-EN.pdf"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-medium hover:bg-primary-light transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              {t("nda_section.download")}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
