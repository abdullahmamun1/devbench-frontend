import type { Metadata } from "next";
import { ExamRunner } from "@/components/modules/exam/exam-runner";

export const metadata: Metadata = {
  title: "Assessment in progress",
  robots: { index: false, follow: false },
};

export default async function AttemptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ExamRunner id={id} />;
}
