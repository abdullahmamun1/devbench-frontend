"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ROLE_HOME } from "@/constants/roles";
import { useGetMe, useLogout } from "@/hooks";
import { cn } from "@/lib/utils";

export default function HeaderActions({
  onNavigate,
  className,
}: {
  onNavigate?: () => void;
  className?: string;
}) {
  const { data, isLoading } = useGetMe();
  const { mutate: logout, isPending } = useLogout();
  const user = data?.data;

  if (isLoading) {
    return <Skeleton className={cn("h-9 w-40", className)} />;
  }

  if (user) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Link
          href={ROLE_HOME[user.role]}
          onClick={onNavigate}
          className={buttonVariants()}
        >
          Dashboard
        </Link>
        <Button
          variant="outline"
          disabled={isPending}
          onClick={() => {
            onNavigate?.();
            logout();
          }}
        >
          Logout
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Link
        href="/login"
        onClick={onNavigate}
        className={buttonVariants({ variant: "outline" })}
      >
        Login
      </Link>
      <Link href="/register" onClick={onNavigate} className={buttonVariants()}>
        Get started
      </Link>
    </div>
  );
}
