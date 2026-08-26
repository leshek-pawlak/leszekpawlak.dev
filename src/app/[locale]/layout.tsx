import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { CookieBanner } from "@/components/CookieBanner";
import { TimeTheme } from "@/components/TimeTheme";
import { RpgAtmosphere } from "@/components/RpgAtmosphere";
import { Analytics } from "@vercel/analytics/next";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: {
    default: "Leszek Pawlak — Konsulting TypeScript & React",
    template: "%s | Leszek Pawlak",
  },
  description:
    "Doradztwo techniczne w zakresie TypeScript, React i JavaScript. 12+ lat doświadczenia. Konsulting architektoniczny, code review, wyceny projektów.",
  metadataBase: new URL("https://leszekpawlak.vercel.app"),
  openGraph: {
    type: "website",
    locale: "pl_PL",
    alternateLocale: "en_US",
    siteName: "Leszek Pawlak",
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className="h-full antialiased scroll-smooth"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <Analytics />
      </head>
      <body className="min-h-full bg-background text-foreground">
        <NextIntlClientProvider messages={messages}>
          <TimeTheme />
          <div className="rpg-app-shell">
            <RpgAtmosphere />
            <a className="rpg-skip-link" href="#main-content">
              {locale === "pl" ? "Przejdź do treści" : "Skip to content"}
            </a>
            <Navigation />
            <main className="rpg-page" id="main-content">
              {children}
            </main>
            <Footer />
            <CookieBanner />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
