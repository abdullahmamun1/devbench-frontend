import type { SidebarGroup } from "@/types";
export const adminRoutes: SidebarGroup[] = [
  {
    title: "Platform",
    items: [
      { title: "Overview", url: "/admin" },
      { title: "Companies", url: "/admin/companies" },
      { title: "Candidates", url: "/admin/candidates" },
      { title: "Audit Logs", url: "/admin/audit-logs" },
    ],
  },
];
