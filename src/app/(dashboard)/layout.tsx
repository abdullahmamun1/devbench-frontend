import type { Metadata } from "next";
import type { ReactNode } from "react";
import AuthGuard from "@/components/auth/auth-guard";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s | DevBench" },
  robots: { index: false, follow: false },
};

export default function layout({ children }: { children: ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
