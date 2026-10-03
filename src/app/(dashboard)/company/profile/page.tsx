import type { Metadata } from "next";
import CompanyProfile from "@/components/modules/company/company-profile";

export const metadata: Metadata = { title: "Profile" };

export default function CompanyProfilePage() {
  return <CompanyProfile />;
}
