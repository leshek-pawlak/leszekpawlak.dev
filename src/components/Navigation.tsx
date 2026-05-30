"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import { useState } from "react";

export function Navigation() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const params = useParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const locale = params.locale as string;
  const otherLocale = locale === "pl" ? "en" : "pl";

  const links = [
    { href: "/", label: t("home") },
    { href: "/about", label: t("about") },
    { href: "/services", label: t("services") },
    { href: "/experience", label: t("experience") },
    { href: "/workflow", label: t("workflow") },
    { href: "/contact", label: t("contact") },
  ] as const;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-surface-light/50">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold gradient-text">
          LP
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`text-sm font-medium transition-colors animated-underline ${
                  pathname === link.href
                    ? "text-primary"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href={pathname}
              locale={otherLocale}
              className="text-sm font-medium px-3 py-1.5 rounded-full border border-surface-light hover:border-primary transition-colors text-muted hover:text-primary"
            >
              {otherLocale.toUpperCase()}
            </Link>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-muted hover:text-foreground"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-surface/95 backdrop-blur-md border-b border-surface-light">
          <ul className="px-4 py-4 space-y-3">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block text-sm font-medium py-2 transition-colors ${
                    pathname === link.href
                      ? "text-primary"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={pathname}
                locale={otherLocale}
                onClick={() => setMobileOpen(false)}
                className="inline-block text-sm font-medium px-3 py-1.5 rounded-full border border-surface-light text-muted hover:text-primary"
              >
                {otherLocale.toUpperCase()}
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
