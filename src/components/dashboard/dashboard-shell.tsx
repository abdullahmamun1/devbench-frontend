"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useGetMe } from "@/hooks";
import { findRouteTitle, getRoutesForRole } from "@/utils/sidebar";
import ThemeToggle from "../shared/theme-toggle";
import CreditBadge from "./credit-badge";
import { DashboardSidebar } from "./dashboard-sidebar";
import UserMenu from "./user-menu";

export default function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const user = useGetMe().data?.data;

  // AuthGuard in the parent layout guarantees the user is loaded
  if (!user) return null;

  const title = findRouteTitle(getRoutesForRole(user.role), pathname);

  return (
    <SidebarProvider>
      <DashboardSidebar user={user} />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mx-1 h-5" />
          <p className="font-semibold">{title}</p>

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <CreditBadge user={user} />
            <UserMenu user={user} />
          </div>
        </header>
        <div className="flex-1 p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
