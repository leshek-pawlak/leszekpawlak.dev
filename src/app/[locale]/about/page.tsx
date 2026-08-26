import { setRequestLocale } from "next-intl/server";
import { AboutSection } from "@/components/AboutSection";
import { getPageMetadata } from "@/lib/pageMetadata";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return getPageMetadata(locale, "about");
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AboutSection />;
}
