import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-4 p-4">
      <Skeleton className="h-14 w-full" />
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    </div>
  );
}
