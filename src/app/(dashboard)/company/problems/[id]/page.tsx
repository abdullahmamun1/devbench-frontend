import { ProblemDetail } from "@/components/modules/problems/problem-detail";

export default async function ProblemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-3xl">
      <ProblemDetail id={id} />
    </div>
  );
}
