"use client";

import { ChevronsUpDown, LogOut, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ROLE_HOME, ROLE_LABELS } from "@/constants/roles";
import { useLogout } from "@/hooks";
import type { User } from "@/types";
import { getInitials } from "@/utils/format";

// Account menu in the sidebar footer. Opens upward, as wide as the sidebar.
export default function UserMenu({
  user,
  onNavigate,
}: {
  user: User;
  onNavigate?: () => void;
}) {
  const { mutate: logout, isPending } = useLogout();
  const profileUrl = `${ROLE_HOME[user.role]}/profile`;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                aria-label={`Account menu for ${user.name}`}
                className="data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground"
              />
            }
          >
            <Avatar className="size-10">
              <AvatarFallback className="bg-primary/12 font-semibold text-primary">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <span className="grid min-w-0 flex-1 text-left leading-tight">
              <span className="truncate font-semibold">{user.name}</span>
              <span className="truncate text-xs text-muted-foreground">
                {ROLE_LABELS[user.role]}
              </span>
            </span>
            <ChevronsUpDown className="ml-auto text-muted-foreground" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side="top"
            align="start"
            sideOffset={8}
            className="w-(--anchor-width) min-w-60"
          >
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
            <DropdownMenuItem
              render={<Link href={profileUrl} onClick={onNavigate} />}
            >
              <UserIcon />
              Profile
            </DropdownMenuItem>
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
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
