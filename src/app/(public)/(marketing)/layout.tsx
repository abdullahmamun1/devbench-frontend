import type { ReactNode } from "react";
import Footer from "@/components/layout/public/footer";
import Header from "@/components/layout/public/header";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
