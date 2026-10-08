"use client";

import { LogOut, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ROLE_HOME, ROLE_LABELS } from "@/constants/roles";
import { useLogout } from "@/hooks";
import type { User } from "@/types";
import { getInitials } from "@/utils/format";

export default function UserMenu({ user }: { user: User }) {
  const { mutate: logout, isPending } = useLogout();
  // The admin portal has no profile page
  const profileUrl =
    user.role === "ADMIN" ? null : `${ROLE_HOME[user.role]}/profile`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            aria-label={`Account menu for ${user.name}`}
            className="h-auto gap-2 px-2 py-1.5"
          />
        }
      >
        <Avatar className="size-8">
          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        </Avatar>
        <span className="hidden text-left text-sm leading-tight sm:block">
          <span className="block font-medium">{user.name}</span>
          <span className="block text-xs font-normal text-muted-foreground">
            {ROLE_LABELS[user.role]}
          </span>
        </span>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        {/* Base UI requires a label to sit inside a group */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <span className="block truncate text-sm font-medium text-foreground">
              {user.name}
            </span>
            <span className="block truncate text-xs text-muted-foreground">
              {user.email}
            </span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {profileUrl && (
          <DropdownMenuItem render={<Link href={profileUrl} />}>
            <UserIcon />
            Profile
          </DropdownMenuItem>
        )}
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
