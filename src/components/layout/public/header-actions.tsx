"use client";

import { ChevronDown, LayoutDashboard, LogOut } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { ROLE_HOME, ROLE_LABELS } from "@/constants/roles";
import { useGetMe, useLogout } from "@/hooks";
import { cn } from "@/lib/utils";
import type { User } from "@/types";
import { getInitials } from "@/utils/format";
import { filterRoutesByRole, getRoutesForRole } from "@/utils/sidebar";

// The signed-in user's dashboard pages, from the same config as the sidebar
const accountLinks = (user: User) =>
  filterRoutesByRole(getRoutesForRole(user.role), user.role).flatMap(
    (group) => group.items,
  );

function AccountMenu({ user }: { user: User }) {
  const { mutate: logout, isPending } = useLogout();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            className="gap-2 pr-3 pl-1.5"
            aria-label={`Account menu for ${user.name}`}
          />
        }
      >
        <Avatar className="size-7">
          <AvatarFallback className="bg-primary/12 text-xs font-semibold text-primary">
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>
        <span className="max-w-28 truncate">{user.name.split(" ")[0]}</span>
        <ChevronDown className="text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={8} className="min-w-60">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <span className="block truncate text-sm font-medium text-foreground">
              {user.name}
            </span>
            <span className="block truncate text-xs text-muted-foreground">
              {ROLE_LABELS[user.role]} · {user.email}
            </span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {accountLinks(user).map(({ title, url, icon: Icon }) => (
            <DropdownMenuItem key={url} render={<Link href={url} />}>
              {Icon && <Icon />}
              {title}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          disabled={isPending}
          onClick={() => logout()}
        >
          <LogOut />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function HeaderActions({
  onNavigate,
  className,
  variant = "menu",
}: {
  onNavigate?: () => void;
  className?: string;
  /** "menu" for the desktop header, "list" inside the mobile sheet */
  variant?: "menu" | "list";
}) {
  const { data, isLoading } = useGetMe();
  const { mutate: logout, isPending } = useLogout();
  const user = data?.data;

  if (isLoading) {
    return <Skeleton className={cn("h-10 w-44", className)} />;
  }

  if (user && variant === "list") {
    return (
      <div className={cn("space-y-3", className)}>
        <p className="text-sm">
          <span className="block font-semibold">{user.name}</span>
          <span className="text-muted-foreground">
            {ROLE_LABELS[user.role]}
          </span>
        </p>
        <ul className="grid grid-cols-2 gap-2">
          {accountLinks(user).map(({ title, url, icon: Icon }) => (
            <li key={url}>
              <Link
                href={url}
                onClick={onNavigate}
                className="flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium hover:bg-muted"
              >
                {Icon && (
                  <Icon className="size-4 text-primary" aria-hidden="true" />
                )}
                {title}
              </Link>
            </li>
          ))}
        </ul>
        <Button
          variant="destructive"
          className="w-full"
          disabled={isPending}
          onClick={() => {
            onNavigate?.();
            logout();
          }}
        >
          <LogOut />
          Logout
        </Button>
      </div>
    );
  }

  if (user) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Link
          href={ROLE_HOME[user.role]}
          onClick={onNavigate}
          className={buttonVariants()}
        >
          <LayoutDashboard />
          Dashboard
        </Link>
        <AccountMenu user={user} />
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
      <Link
        href="/register"
        onClick={onNavigate}
        className={buttonVariants({ variant: "brand" })}
      >
        Get started
      </Link>
    </div>
  );
}
