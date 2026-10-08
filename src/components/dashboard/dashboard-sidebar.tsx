"use client";

import { Code2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { ROLE_HOME } from "@/constants/roles";
import { usePendingEvaluationCount } from "@/hooks";
import type { User } from "@/types";
import { filterRoutesByRole, getRoutesForRole } from "@/utils/sidebar";

// Overview links must match exactly, otherwise they'd stay active on every subpage.
const ROOT_URLS = new Set<string>(Object.values(ROLE_HOME));

export function DashboardSidebar({ user }: { user: User }) {
  const pathname = usePathname();
  const groups = filterRoutesByRole(getRoutesForRole(user.role), user.role);
  const { isMobile, setOpenMobile } = useSidebar();

  const closeOnMobile = () => {
    if (isMobile) setOpenMobile(false);
  };

  const isActive = (url: string) =>
    pathname === url || (!ROOT_URLS.has(url) && pathname.startsWith(`${url}/`));

  const portalLabel =
    user.role === "ADMIN"
      ? "Admin portal"
      : user.role === "CANDIDATE"
        ? "Candidate portal"
        : (user.company?.companyName ?? "Company workspace");

  const canReview =
    user.role === "COMPANY_OWNER" ||
    user.role === "ASSESSMENT_CREATOR" ||
    user.role === "EVALUATOR";
  const { data: pendingCount } = usePendingEvaluationCount(canReview);

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <Link
          href="/"
          onClick={closeOnMobile}
          className="flex items-center gap-2 px-2 py-1.5"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Code2 className="size-5" />
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block font-bold">DevBench</span>
            <span className="block truncate text-xs text-muted-foreground">
              {portalLabel}
            </span>
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {groups.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map(({ title, url, icon: Icon }) => (
                  <SidebarMenuItem key={url}>
                    <SidebarMenuButton
                      render={
                        <Link
                          href={url}
                          onClick={closeOnMobile}
                          aria-current={isActive(url) ? "page" : undefined}
                        />
                      }
                      isActive={isActive(url)}
                    >
                      {Icon && <Icon />}
                      <span>{title}</span>
                    </SidebarMenuButton>
                    {url === "/company/evaluations" && pendingCount ? (
                      <SidebarMenuBadge>{pendingCount}</SidebarMenuBadge>
                    ) : null}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
