import type { ReactNode } from "react";
import Footer from "@/components/layout/public/footer";
import Header from "@/components/layout/public/header";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main
        id="main-content"
        tabIndex={-1}
        // Clip sideways reveal animations so they never widen the page on phones
        className="flex-1 overflow-x-clip text-[1.0625rem] outline-none"
      >
        {children}
      </main>
      <Footer />
    </>
  );
}
