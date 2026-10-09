import {
  Building2,
  CreditCard,
  LayoutDashboard,
  ScrollText,
  Users,
} from "lucide-react";
import type { SidebarGroup } from "@/types";

export const adminRoutes: SidebarGroup[] = [
  {
    title: "Platform",
    items: [
      { title: "Overview", url: "/admin", icon: LayoutDashboard },
      { title: "Companies", url: "/admin/companies", icon: Building2 },
      { title: "Candidates", url: "/admin/candidates", icon: Users },
      { title: "Payments", url: "/admin/payments", icon: CreditCard },
      { title: "Audit Logs", url: "/admin/audit-logs", icon: ScrollText },
    ],
  },
];
