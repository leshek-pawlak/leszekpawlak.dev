"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { useState } from "react";

export function ContactSection() {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          message: formData.get("message"),
        }),
      });

      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="py-24 pt-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl sm:text-5xl font-bold mb-4 gradient-text"
        >
          {t("title")}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-lg text-muted mb-12"
        >
          {t("subtitle")}
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="max-w-xl space-y-6"
        >
          {/* Honeypot */}
          <input
            type="text"
            name="website"
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
          />

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-foreground mb-2"
            >
              {t("name")}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-4 py-3 rounded-xl bg-surface border border-surface-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors text-foreground placeholder:text-muted"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-foreground mb-2"
            >
              {t("email")}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-4 py-3 rounded-xl bg-surface border border-surface-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors text-foreground placeholder:text-muted"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-foreground mb-2"
            >
              {t("message")}
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              className="w-full px-4 py-3 rounded-xl bg-surface border border-surface-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors text-foreground placeholder:text-muted resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="px-8 py-3.5 rounded-full bg-primary hover:bg-primary-light text-white font-medium transition-all glow-primary hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {status === "sending" ? t("sending") : t("send")}
          </button>

          {status === "success" && (
            <p className="text-accent font-medium">{t("success")}</p>
          )}
          {status === "error" && (
            <p className="text-red-400 font-medium">{t("error")}</p>
          )}
        </motion.form>
      </div>
    </section>
  );
}
