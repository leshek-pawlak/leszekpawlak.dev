"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useParams } from "next/navigation";

type NavIcon =
  | "star"
  | "book"
  | "spark"
  | "compass"
  | "map"
  | "rune"
  | "letter";

const paths = [
  "star",
  "book",
  "spark",
  "compass",
  "map",
  "rune",
  "letter",
] as const;

function MenuIcon({ icon }: { icon: NavIcon }) {
  const drawings: Record<NavIcon, React.ReactNode> = {
    star: (
      <path d="m12 2 1.7 6.3L20 10l-6.3 1.7L12 18l-1.7-6.3L4 10l6.3-1.7L12 2Z" />
    ),
    book: (
      <path d="M4 5.2C6.8 5.2 9.1 6 12 8v11c-2.9-2-5.2-2.8-8-2.8v-11Zm16 0c-2.8 0-5.1.8-8 2.8v11c2.9-2 5.2-2.8 8-2.8v-11Z" />
    ),
    spark: <path d="m13 2-6 10h5l-1 10 6-11h-5l1-9Z" />,
    compass: (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
      </>
    ),
    map: <path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2V5Zm6-2v16m6-14v16" />,
    rune: (
      <>
        <path d="M12 2 20 7v10l-8 5-8-5V7l8-5Z" />
        <path d="m9 16 3-9 3 9-3-2-3 2Z" />
      </>
    ),
    letter: <path d="M3 6h18v13H3V6Zm0 1 9 7 9-7" />,
  };

  return (
    <svg className="rpg-nav-icon" viewBox="0 0 24 24" aria-hidden="true">
      {drawings[icon]}
    </svg>
  );
}

export function Navigation() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const params = useParams();
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const mobileMenu = useRef<HTMLElement>(null);

  const locale = params.locale === "pl" ? "pl" : "en";
  const labels = {
    pl: {
      heading: "POZNAJ SWOJEGO SOJUSZNIKA",
      subtitle: "KONSULTANT · TWÓJ SOJUSZNIK",
      menu: "Menu",
      open: "Otwórz menu",
      close: "Zamknij menu",
      elsewhere: "POZA TAWERNĄ",
      titles: [
        "Karta postaci",
        "Historia postaci",
        "Księga zaklęć",
        "Dziennik wypraw",
        "Wspólny quest",
        "Pracownia kształtów",
        "Zaproś do drużyny",
      ],
    },
    en: {
      heading: "MEET YOUR NEXT ALLY",
      subtitle: "CONSULTANT · YOUR ALLY",
      menu: "Menu",
      open: "Open menu",
      close: "Close menu",
      elsewhere: "BEYOND THE TAVERN",
      titles: [
        "Character sheet",
        "Origin story",
        "Spellbook",
        "Adventure log",
        "A shared quest",
        "Shape workshop",
        "Invite to your party",
      ],
    },
  } as const;
  const copy = labels[locale];
  const links = [
    { href: "/", label: t("home") },
    { href: "/about", label: t("about") },
    { href: "/services", label: t("services") },
    { href: "/experience", label: t("experience") },
    { href: "/workflow", label: t("workflow") },
    { href: "/playground", label: t("playground") },
    { href: "/contact", label: t("contact") },
  ] as const;

  useEffect(() => {
    if (!mobileOpen) return;

    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        menuButton.current?.focus();
        return;
      }

      if (event.key !== "Tab" || !mobileMenu.current) return;
      const focusable = Array.from(
        mobileMenu.current.querySelectorAll<HTMLElement>("a[href]"),
      );
      const first = focusable.at(0);
      const last = focusable.at(-1);

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener("keydown", closeWithEscape);
    mobileMenu.current?.querySelector<HTMLElement>("a[href]")?.focus();
    return () => document.removeEventListener("keydown", closeWithEscape);
  }, [mobileOpen]);

  const menu = (
    <>
      <p className="rpg-menu-heading">{copy.heading}</p>
      <nav
        aria-label={locale === "pl" ? "Nawigacja główna" : "Main navigation"}
      >
        <ul className="rpg-menu-list">
          {links.map((link, index) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rpg-menu-item"
                  aria-current={active ? "page" : undefined}
                  onClick={() => setMobileOpen(false)}
                >
                  <MenuIcon icon={paths[index]} />
                  <span>
                    <strong>{copy.titles[index]}</strong>
                    <small>{link.label}</small>
                  </span>
                  {active && (
                    <span className="rpg-menu-diamond" aria-hidden="true">
                      ◆
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="rpg-menu-external">
        <p>{copy.elsewhere}</p>
        <a
          href="https://github.com/leshek-pawlak"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub <span aria-hidden="true">↗</span>
        </a>
        <a
          href="https://linkedin.com/in/leszek-pawlak"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn <span aria-hidden="true">↗</span>
        </a>
      </div>
    </>
  );

  return (
    <>
      <header className="rpg-header">
        <Link href="/" className="rpg-brand" aria-label="Leszek Pawlak">
          <span className="rpg-brand-mark" aria-hidden="true">
            LP
          </span>
          <span>
            <strong>LESZEK PAWLAK</strong>
            <small>{copy.subtitle}</small>
          </span>
        </Link>

        <div className="rpg-header-actions">
          <div className="rpg-locales" aria-label="Język / Language">
            {(["pl", "en"] as const).map((targetLocale, index) => (
              <span key={targetLocale}>
                {index > 0 && <span aria-hidden="true">/</span>}
                <Link
                  href={pathname}
                  locale={targetLocale}
                  hrefLang={targetLocale}
                  aria-current={targetLocale === locale ? "page" : undefined}
                >
                  {targetLocale.toUpperCase()}
                </Link>
              </span>
            ))}
          </div>
          <button
            ref={menuButton}
            className="rpg-menu-toggle"
            type="button"
            aria-expanded={mobileOpen}
            aria-controls="rpg-mobile-menu"
            aria-label={mobileOpen ? copy.close : copy.open}
            onClick={() => setMobileOpen((open) => !open)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              {mobileOpen ? (
                <path d="M5 5l14 14M19 5 5 19" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
            <span>{copy.menu}</span>
          </button>
        </div>
      </header>

      <aside className="rpg-sidebar">{menu}</aside>

      {mobileOpen && (
        <>
          <button
            className="rpg-menu-backdrop"
            type="button"
            tabIndex={-1}
            aria-label={copy.close}
            onClick={() => setMobileOpen(false)}
          />
          <aside
            ref={mobileMenu}
            className="rpg-mobile-menu"
            id="rpg-mobile-menu"
          >
            {menu}
          </aside>
        </>
      )}
    </>
  );
}
