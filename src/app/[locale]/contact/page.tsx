import { setRequestLocale } from "next-intl/server";
import { ContactSection } from "@/components/ContactSection";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ContactSection />;
}
