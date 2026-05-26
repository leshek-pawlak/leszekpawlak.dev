"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Link } from "@/i18n/navigation";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Animated background */}
      <div className="absolute inset-0 animated-gradient opacity-10" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-lg sm:text-xl text-muted mb-2"
        >
          {t("greeting")}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl sm:text-7xl lg:text-8xl font-bold mb-4 gradient-text"
        >
          {t("name")}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl sm:text-2xl lg:text-3xl font-medium text-foreground/80 mb-6"
        >
          {t("title")}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-base sm:text-lg text-muted max-w-2xl mx-auto mb-10"
        >
          {t("subtitle")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/contact"
            className="px-8 py-3.5 rounded-full bg-primary hover:bg-primary-light text-white font-medium transition-all glow-primary hover:scale-105"
          >
            {t("cta")}
          </Link>
          <Link
            href="/experience"
            className="px-8 py-3.5 rounded-full border border-surface-light hover:border-accent text-foreground font-medium transition-all hover:scale-105"
          >
            {t("ctaSecondary")}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
