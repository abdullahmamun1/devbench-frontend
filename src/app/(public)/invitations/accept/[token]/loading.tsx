import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <Skeleton className="mx-auto h-80 w-full max-w-lg rounded-xl" />
    </div>
  );
}
