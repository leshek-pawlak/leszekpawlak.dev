"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";
import { ContactSuccessModal } from "@/components/ContactSuccessModal";
import { rpgImages } from "@/lib/rpgImages";
import { submitContact } from "@/lib/contactSubmission";

const serviceKeys = ["consulting", "estimation", "development", "ai"] as const;

export function ContactSection() {
  const t = useTranslations("contact");
  const rpg = useTranslations("rpg");
  const services = useTranslations("services");
  const workflow = useTranslations("workflow");
  const reduceMotion = useReducedMotion();
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Honeypot check
    if (formData.get("website")) {
      setStatus("success");
      return;
    }

    try {
      const success = await submitContact({
        name: formData.get("name"),
        email: formData.get("email"),
        message: formData.get("message"),
      });

      if (success) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  function closeSuccessModal() {
    setStatus("idle");
    requestAnimationFrame(() => submitButtonRef.current?.focus());
  }

  return (
    <section className="rpg-content-section rpg-contact-section">
      <div className="rpg-content-inner">
        <motion.header
          initial={reduceMotion ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rpg-section-intro"
        >
          <p className="rpg-eyebrow">{rpg("contactKicker")}</p>
          <h1 className="rpg-section-title">{rpg("contactTitle")}</h1>
          <p className="rpg-section-summary">{t("subtitle")}</p>
          <div className="rpg-section-rule" aria-hidden="true" />
        </motion.header>

        <div className="rpg-contact-layout">
          <motion.form
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.6 }}
            onSubmit={handleSubmit}
            className="rpg-contact-form rpg-panel"
            aria-busy={status === "sending"}
          >
            <h2>{rpg("formTitle")}</h2>

            <input
              type="text"
              name="website"
              className="rpg-honeypot"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            <div className="rpg-field">
              <label htmlFor="name">{t("name")}</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                autoComplete="name"
              />
            </div>

            <div className="rpg-field">
              <label htmlFor="email">{t("email")}</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                autoComplete="email"
              />
            </div>

            <div className="rpg-field">
              <label htmlFor="message">{t("message")}</label>
              <textarea id="message" name="message" rows={6} required />
            </div>

            <button
              ref={submitButtonRef}
              type="submit"
              disabled={status === "sending"}
              className="rpg-primary-button"
            >
              <span>{status === "sending" ? t("sending") : t("send")}</span>
              <span aria-hidden="true">→</span>
            </button>

            <div
              className="rpg-form-status"
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              {status === "error" && (
                <p className="rpg-form-error">{t("error")}</p>
              )}
            </div>
          </motion.form>

          <motion.aside
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.6 }}
            className="rpg-support-panel rpg-panel"
          >
            <div className="rpg-runestone" aria-hidden="true">
              <Image
                src={rpgImages.runestone.src}
                alt=""
                width={rpgImages.runestone.width}
                height={rpgImages.runestone.height}
                sizes="(max-width: 720px) 54vw, 240px"
                placeholder="blur"
                blurDataURL={rpgImages.runestone.blurDataURL}
              />
            </div>
            <p className="rpg-eyebrow">{rpg("partySupport")}</p>
            <h2>{rpg("questTitle")}</h2>
            <ul>
              {serviceKeys.map((key) => (
                <li key={key}>
                  <span aria-hidden="true">✦</span>
                  {services(`${key}.title`)}
                </li>
              ))}
            </ul>

            <div className="rpg-contact-trust">
              <h3>{rpg("ndaTrust")}</h3>
              <p>{workflow("nda_section.description")}</p>
              <a
                href="/nda-leszek-pawlak.pdf"
                download="NDA-Leszek-Pawlak-PL-EN.pdf"
                className="rpg-secondary-link"
              >
                {workflow("nda_section.download")}
              </a>
            </div>
          </motion.aside>
        </div>
      </div>

      {status === "success" && (
        <ContactSuccessModal
          kicker={t("successKicker")}
          message={t("success")}
          mageDescription={t("successMageAlt")}
          closeLabel={t("successClose")}
          onClose={closeSuccessModal}
        />
      )}
    </section>
  );
}
