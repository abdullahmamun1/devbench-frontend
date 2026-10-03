import type { Metadata } from "next";
import CompanyOverview from "@/components/modules/company/company-overview";

export const metadata: Metadata = { title: "Overview" };

export default function CompanyPage() {
  return <CompanyOverview />;
}
