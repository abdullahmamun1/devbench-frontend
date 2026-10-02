import { adminRoutes, candidateRoutes, companyRoutes } from "@/routes";
import type { SidebarGroup, UserRole } from "@/types";

export function getRoutesForRole(role: UserRole): SidebarGroup[] {
  if (role === "ADMIN") return adminRoutes;
  if (role === "CANDIDATE") return candidateRoutes;
  return companyRoutes; // owner, creator and evaluator share the company portal
}

// Hide items the role isn't allowed to see, then drop empty groups.
export function filterRoutesByRole(
  groups: SidebarGroup[],
  role: UserRole,
): SidebarGroup[] {
  return groups
    .map((group) => ({
      ...group,
      items: group.items.filter(
        (item) => !item.roles || item.roles.includes(role),
      ),
    }))
    .filter((group) => group.items.length > 0);
}

// Longest matching url wins, so /company/problems/new still says "Problems".
export function findRouteTitle(
  groups: SidebarGroup[],
  pathname: string,
): string {
  const match = groups
    .flatMap((group) => group.items)
    .filter(
      (item) => pathname === item.url || pathname.startsWith(`${item.url}/`),
    )
    .sort((a, b) => b.url.length - a.url.length)[0];

  return match?.title ?? "Dashboard";
}
