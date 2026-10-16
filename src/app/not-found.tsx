import {
  ArrowRight,
  CircleHelp,
  CreditCard,
  LayoutGrid,
  type LucideIcon,
  Mail,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/layout/public/footer";
import Header from "@/components/layout/public/header";
import StatusPage from "@/components/shared/status-page";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

const SUGGESTIONS: {
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
}[] = [
  {
    label: "Features",
    description: "The full product",
    href: "/features",
    icon: LayoutGrid,
  },
  {
    label: "Pricing",
    description: "Credits, not seats",
    href: "/pricing",
    icon: CreditCard,
  },
  {
    label: "FAQ",
    description: "Common questions",
    href: "/faq",
    icon: CircleHelp,
  },
  {
    label: "Contact",
    description: "Talk to a person",
    href: "/contact",
    icon: Mail,
  },
];

export default function NotFound() {
  return (
    <>
      <Header />
      <main
        id="main-content"
        tabIndex={-1}
        className="flex flex-1 flex-col outline-none"
      >
        <StatusPage
          code="404"
          eyebrow="Page not found"
          title="This page took a wrong turn"
          description="The link may be broken, or the page may have moved. Check the address, or pick up from one of these."
          actions={
            <>
              <Button
                variant="brand"
                size="lg"
                render={<Link href="/" />}
                nativeButton={false}
              >
                Back to home
              </Button>
              <Button
                variant="outline"
                size="lg"
                render={<Link href="/login" />}
                nativeButton={false}
              >
                Go to login
              </Button>
            </>
          }
        >
          <nav
            aria-label="Suggested pages"
            className="mt-14 grid w-full max-w-5xl gap-3 sm:grid-cols-2 lg:grid-cols-4"
          >
            {SUGGESTIONS.map(({ label, description, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="group flex items-center gap-3 rounded-2xl border bg-card/80 p-4 text-left backdrop-blur transition-[border-color,translate,box-shadow] hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">{label}</span>
                  <span className="block text-sm text-muted-foreground">
                    {description}
                  </span>
                </span>
                <ArrowRight
                  className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </nav>
        </StatusPage>
      </main>
      <Footer />
    </>
  );
}
