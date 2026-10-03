import type { Metadata } from "next";
import TeamManagement from "@/components/modules/company/team-management";

export const metadata: Metadata = { title: "Team" };

export default function TeamPage() {
  return <TeamManagement />;
}
