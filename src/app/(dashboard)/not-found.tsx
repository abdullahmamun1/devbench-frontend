import Link from "next/link";
import StatusPage from "@/components/shared/status-page";
import { Button } from "@/components/ui/button";

export default function DashboardNotFound() {
  return (
    <StatusPage
      code="404"
      eyebrow="Not found"
      title="We couldn't find that page"
      description="It may have been removed, or your account may not have access to it."
      className="min-h-[60vh] py-12"
      actions={
        <Button
          variant="brand"
          size="lg"
          // The proxy sends signed-in users from /login to their role's home
          render={<Link href="/login" />}
          nativeButton={false}
        >
          Back to my dashboard
        </Button>
      }
    />
  );
}
