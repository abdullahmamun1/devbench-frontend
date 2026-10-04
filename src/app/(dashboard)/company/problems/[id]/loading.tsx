import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  );
}
