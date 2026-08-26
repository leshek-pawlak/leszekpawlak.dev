import { setRequestLocale } from "next-intl/server";
import { ContactSection } from "@/components/ContactSection";
import { getPageMetadata } from "@/lib/pageMetadata";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return getPageMetadata(locale, "contact");
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ContactSection />;
}
