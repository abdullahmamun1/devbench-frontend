import type { Metadata } from "next";
import AdminProfile from "@/components/modules/admin/admin-profile";

export const metadata: Metadata = { title: "Profile" };

export default function AdminProfilePage() {
  return <AdminProfile />;
}
