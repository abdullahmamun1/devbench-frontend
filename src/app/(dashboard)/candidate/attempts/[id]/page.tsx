import type { Metadata } from "next";
import { AttemptDetailView } from "@/components/modules/candidate/attempt-detail";

export const metadata: Metadata = { title: "Attempt" };

export default async function AttemptDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AttemptDetailView id={id} />;
}
