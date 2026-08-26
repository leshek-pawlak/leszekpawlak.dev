import { setRequestLocale } from "next-intl/server";
import { ServicesSection } from "@/components/ServicesSection";
import { getPageMetadata } from "@/lib/pageMetadata";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return getPageMetadata(locale, "services");
}

export default async function ServicesPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ServicesSection />;
}
