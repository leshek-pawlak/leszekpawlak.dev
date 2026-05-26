import { setRequestLocale } from "next-intl/server";
import { AboutSection } from "@/components/AboutSection";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AboutSection />;
}
