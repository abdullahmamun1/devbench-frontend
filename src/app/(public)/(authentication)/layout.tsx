import Link from "next/link";
import type { ReactNode } from "react";
import Logo from "@/components/layout/public/logo";
import AuthBrandPanel from "@/components/modules/auth/auth-brand-panel";
import ThemeToggle from "@/components/shared/theme-toggle";
import { getPublicStats } from "@/lib/public-stats";
import GoogleAuthProvider from "@/providers/google-auth.provider";

export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const stats = await getPublicStats();

  return (
    <GoogleAuthProvider>
      <div className="grid min-h-svh lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* Brand panel, large screens only */}
        <aside className="relative hidden lg:block">
          <div className="sticky top-0">
            <AuthBrandPanel stats={stats} />
          </div>
        </aside>

        <main
          id="main-content"
          tabIndex={-1}
          className="flex min-h-svh flex-col outline-none"
        >
          {/* Phones and tablets: compact gradient header instead of the panel */}
          <div className="relative overflow-hidden bg-linear-to-br from-[oklch(0.27_0.12_277)] to-[oklch(0.35_0.1_220)] px-6 py-5 lg:hidden">
            <Link
              href="/"
              aria-label="DevBench home"
              className="relative mx-auto flex w-fit rounded-xl bg-background/95 px-3 py-2 text-foreground shadow-lg"
            >
              <Logo asSpan />
            </Link>
          </div>

          <div className="flex justify-end px-6 pt-4">
            <ThemeToggle />
          </div>

          {/* Auth forms get taller inputs than the dashboards */}
          <div className="flex flex-1 items-center justify-center px-6 pb-10 sm:px-10 **:data-[slot=input]:h-11">
            <div className="w-full max-w-xl motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-500">
              {children}
            </div>
          </div>
        </main>
      </div>
    </GoogleAuthProvider>
  );
}
