"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

const CuttingPlayground = dynamic(
  () =>
    import("./CuttingPlayground").then((module) => module.CuttingPlayground),
  {
    ssr: false,
    loading: () => <PlaygroundLoading />,
  },
);

function PlaygroundLoading() {
  const t = useTranslations("playground");
  return (
    <div className="rpg-panel rpg-playground-loading" role="status">
      <span aria-hidden="true">✦</span>
      <p>{t("loading")}</p>
    </div>
  );
}

export function PlaygroundEntry({ homeHref }: { homeHref: string }) {
  return <CuttingPlayground homeHref={homeHref} />;
}
