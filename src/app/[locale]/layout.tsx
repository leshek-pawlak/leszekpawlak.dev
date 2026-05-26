import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { TimeTheme } from "@/components/TimeTheme";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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

const timeThemeScript = `
(function() {
  var h = new Date().getHours();
  var t = (h >= 6 && h < 18) ? 'day' : (h >= 18 && h < 22) ? 'evening' : 'night';
  document.documentElement.setAttribute('data-time', t);
})();
`;

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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: timeThemeScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <NextIntlClientProvider messages={messages}>
          <TimeTheme />
          <Navigation />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
