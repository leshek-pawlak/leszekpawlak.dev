"use client";

import { useEffect, useId, useRef, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import styles from "./ContactSuccessModal.module.css";

type ContactSuccessModalProps = {
  closeLabel: string;
  kicker: string;
  mageDescription: string;
  message: string;
  onClose: () => void;
};

export function ContactSuccessModal({
  closeLabel,
  kicker,
  mageDescription,
  message,
  onClose,
}: ContactSuccessModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const mageDescriptionId = useId();

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusFrame = requestAnimationFrame(() =>
      closeButtonRef.current?.focus(),
    );
    return () => {
      cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }
    if (event.key === "Tab") {
      event.preventDefault();
      closeButtonRef.current?.focus();
    }
  };

  return createPortal(
    <div className={styles.overlay} onKeyDown={handleKeyDown}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={mageDescriptionId}
      >
        <div className={styles.mage} aria-hidden="true">
          <img
            src="/images/rpg/results/mage-excellent.webp"
            alt=""
            width={585}
            height={1200}
            decoding="async"
          />
        </div>

        <div className={styles.content}>
          <span className={styles.kicker}>{kicker}</span>
          <h2 id={titleId}>{message}</h2>
          <p id={mageDescriptionId} className={styles.mageDescription}>
            {mageDescription}
          </p>
          <button ref={closeButtonRef} type="button" onClick={onClose}>
            {closeLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
