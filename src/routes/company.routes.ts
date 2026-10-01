import type { SidebarGroup } from "@/types";
export const companyRoutes: SidebarGroup[] = [
  {
    title: "Workspace",
    items: [
      { title: "Overview", url: "/company" },
      {
        title: "Problems",
        url: "/company/problems",
        roles: ["COMPANY_OWNER", "ASSESSMENT_CREATOR"],
      },
      {
        title: "Assessments",
        url: "/company/assessments",
        roles: ["COMPANY_OWNER", "ASSESSMENT_CREATOR"],
      },
      {
        title: "Evaluations",
        url: "/company/evaluations",
        roles: ["COMPANY_OWNER", "EVALUATOR"],
      },
    ],
  },
  {
    title: "Manage",
    items: [
      { title: "Team", url: "/company/team", roles: ["COMPANY_OWNER"] },
      { title: "Billing", url: "/company/billing", roles: ["COMPANY_OWNER"] },
      { title: "Profile", url: "/company/profile" },
    ],
  },
];
