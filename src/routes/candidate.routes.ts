import type { SidebarGroup } from "@/types";
export const candidateRoutes: SidebarGroup[] = [
  {
    title: "Platform",
    items: [
      { title: "Overview", url: "/candidate" },
      { title: "Invitations", url: "/candidate/invitations" },
      { title: "Attempts", url: "/candidate/attempts" },
      { title: "Profile", url: "/candidate/profile" },
    ],
  },
];
