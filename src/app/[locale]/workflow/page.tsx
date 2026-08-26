import { setRequestLocale } from "next-intl/server";
import { WorkflowTimeline } from "@/components/WorkflowTimeline";
import { getPageMetadata } from "@/lib/pageMetadata";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return getPageMetadata(locale, "workflow");
}

export default async function WorkflowPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <WorkflowTimeline />;
}
