import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export type PageMetadataKey =
  | "home"
  | "about"
  | "services"
  | "experience"
  | "workflow"
  | "playground"
  | "contact";

const pagePaths: Record<PageMetadataKey, string> = {
  home: "",
  about: "/about",
  services: "/services",
  experience: "/experience",
  workflow: "/workflow",
  playground: "/playground",
  contact: "/contact",
};

export async function getPageMetadata(
  locale: string,
  page: PageMetadataKey,
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "metadata" });
  const title = t(`${page}.title`);
  const description = t(`${page}.description`);
  const pagePath = pagePaths[page];
  const canonical = `/${locale}${pagePath}`;
  const fullTitle = `${title} | Leszek Pawlak`;

  return {
    title: { absolute: fullTitle },
    description,
    alternates: {
      canonical,
      languages: {
        pl: `/pl${pagePath}`,
        en: `/en${pagePath}`,
        "x-default": `/en${pagePath}`,
      },
    },
    openGraph: {
      type: "website",
      url: canonical,
      title: fullTitle,
      description,
      locale: locale === "pl" ? "pl_PL" : "en_US",
      alternateLocale: locale === "pl" ? "en_US" : "pl_PL",
      siteName: "Leszek Pawlak",
    },
    twitter: {
      card: "summary",
      title: fullTitle,
      description,
    },
  };
}
