"use client";
import type { ReactNode } from "react";
import SamePageAnchors from "@/components/shared/same-page-anchors";
import ThemedToaster from "@/components/shared/themed-toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import QueryProvider from "./query.provider";
import ThemeProvider from "./theme-provider";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </QueryProvider>
      <ThemedToaster />
      <SamePageAnchors />
    </ThemeProvider>
  );
}
