import { ShieldAlert } from "lucide-react";
import Link from "next/link";
import EmptyState from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";

interface RestrictedNoticeProps {
  title?: string;
  description?: string;
  backHref: string;
  backLabel: string;
}

export default function RestrictedNotice({
  title = "You do not have access to this page",
  description = "Your role can view this area but cannot make changes. Ask a company owner or an assessment creator if you need something added.",
  backHref,
  backLabel,
}: RestrictedNoticeProps) {
  return (
    <EmptyState
      icon={ShieldAlert}
      title={title}
      description={description}
      className="py-16"
      action={
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href={backHref} />}
        >
          {backLabel}
        </Button>
      }
    />
  );
}
