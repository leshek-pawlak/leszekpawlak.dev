import { getTranslations, setRequestLocale } from "next-intl/server";
import { MagePlaygroundEntry } from "@/components/rpg/playground/MagePlaygroundEntry";
import { getPageMetadata } from "@/lib/pageMetadata";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return getPageMetadata(locale, "playground");
}

export default async function PlaygroundPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "playground" });

  return (
    <section className="rpg-content-section rpg-playground-page">
      <div className="rpg-content-inner rpg-playground-inner">
        <header className="rpg-section-intro rpg-playground-intro">
          <p className="rpg-eyebrow">{t("kicker")}</p>
          <h1 className="rpg-section-title">{t("title")}</h1>
          <p className="rpg-section-summary">{t("intro")}</p>
          <div className="rpg-section-rule" aria-hidden="true" />
        </header>
        <MagePlaygroundEntry />
      </div>
    </section>
  );
}
