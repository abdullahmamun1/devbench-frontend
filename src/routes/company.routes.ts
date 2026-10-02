import {
  ClipboardCheck,
  ClipboardList,
  Code2,
  CreditCard,
  LayoutDashboard,
  User,
  UsersRound,
} from "lucide-react";
import type { SidebarGroup } from "@/types";

export const companyRoutes: SidebarGroup[] = [
  {
    title: "Workspace",
    items: [
      { title: "Overview", url: "/company", icon: LayoutDashboard },
      {
        title: "Problems",
        url: "/company/problems",
        icon: Code2,
        roles: ["COMPANY_OWNER", "ASSESSMENT_CREATOR"],
      },
      {
        title: "Assessments",
        url: "/company/assessments",
        icon: ClipboardList,
        roles: ["COMPANY_OWNER", "ASSESSMENT_CREATOR"],
      },
      {
        title: "Evaluations",
        url: "/company/evaluations",
        icon: ClipboardCheck,
        roles: ["COMPANY_OWNER", "EVALUATOR"],
      },
    ],
  },
  {
    title: "Manage",
    items: [
      {
        title: "Team",
        url: "/company/team",
        icon: UsersRound,
        roles: ["COMPANY_OWNER"],
      },
      {
        title: "Billing",
        url: "/company/billing",
        icon: CreditCard,
        roles: ["COMPANY_OWNER"],
      },
      { title: "Profile", url: "/company/profile", icon: User },
    ],
  },
];
