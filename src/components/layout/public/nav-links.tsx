"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/constants/site";
import { cn } from "@/lib/utils";

export default function NavLinks({
  variant = "inline",
  onNavigate,
}: {
  variant?: "inline" | "stacked";
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <ul
      className={cn(
        variant === "inline"
          ? "flex items-center gap-6"
          : "flex flex-col gap-1",
      )}
    >
      {NAV_LINKS.map((link) => {
        const active = pathname === link.href;

        return (
          <li key={link.href}>
            <Link
              href={link.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "text-sm font-medium transition-colors",
                variant === "inline"
                  ? "text-muted-foreground hover:text-foreground"
                  : "block rounded-md px-3 py-2 hover:bg-muted",
                active && "text-foreground",
                active && variant === "stacked" && "bg-muted",
              )}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
