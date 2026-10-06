import { FileQuestion } from "lucide-react";
import Link from "next/link";
import EmptyState from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";

export default function DashboardNotFound() {
  return (
    <EmptyState
      icon={FileQuestion}
      title="We could not find that page"
      description="The item you are looking for may have been removed, or you may not have access to it."
      action={
        <Button render={<Link href="/" />} nativeButton={false}>
          Back to home
        </Button>
      }
    />
  );
}
