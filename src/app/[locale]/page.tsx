import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/Hero";
import { getPageMetadata } from "@/lib/pageMetadata";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return getPageMetadata(locale, "home");
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <Hero />;
}
