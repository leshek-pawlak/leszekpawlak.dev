import { setRequestLocale } from "next-intl/server";
import { ExperienceSection } from "@/components/ExperienceSection";
import { getPageMetadata } from "@/lib/pageMetadata";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return getPageMetadata(locale, "experience");
}

export default async function ExperiencePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ExperienceSection />;
}
