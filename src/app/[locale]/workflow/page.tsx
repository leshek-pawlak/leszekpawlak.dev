import { setRequestLocale } from "next-intl/server";
import { WorkflowTimeline } from "@/components/WorkflowTimeline";

export default async function WorkflowPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <WorkflowTimeline />;
}
