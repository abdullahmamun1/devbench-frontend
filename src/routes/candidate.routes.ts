import { History, LayoutDashboard, Mail, User } from "lucide-react";
import type { SidebarGroup } from "@/types";

export const candidateRoutes: SidebarGroup[] = [
  {
    title: "Assessments",
    items: [
      { title: "Overview", url: "/candidate", icon: LayoutDashboard },
      { title: "Invitations", url: "/candidate/invitations", icon: Mail },
      { title: "My Attempts", url: "/candidate/attempts", icon: History },
    ],
  },
  {
    title: "Account",
    items: [{ title: "Profile", url: "/candidate/profile", icon: User }],
  },
];
