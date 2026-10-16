"use client";

import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { NAV_MENU } from "@/constants/site";
import { cn } from "@/lib/utils";
import type { NavMenuFeature, NavMenuLink } from "@/types";
import { isNavActive } from "@/utils/nav";

const TRIGGER =
  "h-10 px-4 text-[0.95rem] text-muted-foreground hover:text-foreground data-popup-open:text-foreground";

export default function DesktopNav() {
  const pathname = usePathname();

  return (
    <NavigationMenu align="center">
      <NavigationMenuList className="gap-1">
        {NAV_MENU.map((entry) => {
          if ("href" in entry) {
            const active = isNavActive(pathname, entry.href);
            return (
              <NavigationMenuItem key={entry.label}>
                <NavigationMenuLink
                  active={active}
                  render={<Link href={entry.href} />}
                  className={cn(
                    navigationMenuTriggerStyle(),
                    TRIGGER,
                    active && "text-foreground",
                  )}
                >
                  {entry.label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            );
          }

          const active = entry.sections.some((section) =>
            section.links.some((link) => isNavActive(pathname, link.href)),
          );

          return (
            <NavigationMenuItem key={entry.label}>
              <NavigationMenuTrigger
                className={cn(TRIGGER, active && "text-foreground")}
              >
                {entry.label}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div
                  className={cn(
                    "grid gap-3 p-1",
                    entry.feature
                      ? entry.sections.length > 1
                        ? "w-[min(94vw,62rem)] md:grid-cols-[1fr_15rem]"
                        : "w-[min(92vw,46rem)] md:grid-cols-[1fr_16rem]"
                      : entry.sections.length > 1
                        ? "w-[min(92vw,48rem)]"
                        : "w-[min(92vw,26rem)]",
                  )}
                >
                  {/* Link sections sit side by side; the feature card gets its own column */}
                  <div
                    className={cn(
                      "grid gap-2",
                      entry.sections.length > 1 && "md:grid-cols-2",
                    )}
                  >
                    {entry.sections.map((section) => (
                      <div key={section.title} className="space-y-1">
                        <p className="px-3 pt-2 pb-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                          {section.title}
                        </p>
                        <ul>
                          {section.links.map((link) => (
                            <li key={link.href}>
                              <MenuLink link={link} />
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  {entry.feature && <FeatureCard feature={entry.feature} />}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function MenuLink({ link }: { link: NavMenuLink }) {
  const { icon: Icon } = link;
  const body = (
    <>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover/menu-link:bg-primary group-hover/menu-link:text-primary-foreground">
        <Icon className="size-5" />
      </span>
      <span className="min-w-0 space-y-0.5">
        <span className="flex items-center gap-1 font-medium text-foreground">
          {link.label}
          {link.external && (
            <ArrowUpRight
              className="size-3.5 text-muted-foreground"
              aria-label="(opens in a new tab)"
            />
          )}
        </span>
        <span className="block text-sm leading-snug text-muted-foreground">
          {link.description}
        </span>
      </span>
    </>
  );

  return (
    <NavigationMenuLink
      className="group/menu-link items-start gap-3 p-3"
      render={
        <Link
          href={link.href}
          {...(link.external && { target: "_blank", rel: "noreferrer" })}
        />
      }
    >
      {body}
    </NavigationMenuLink>
  );
}

function FeatureCard({ feature }: { feature: NavMenuFeature }) {
  return (
    <NavigationMenuLink
      render={<Link href={feature.href} />}
      className="group/feature relative flex-col items-start justify-end gap-2 overflow-hidden rounded-xl bg-linear-to-br from-primary to-[color-mix(in_oklch,var(--primary),var(--brand-2)_55%)] p-5 text-primary-foreground hover:bg-transparent focus:bg-transparent"
    >
      <span
        aria-hidden="true"
        className="absolute -top-10 -right-10 size-36 rounded-full bg-brand-3/35 blur-2xl transition-transform duration-500 group-hover/feature:scale-125 motion-reduce:transition-none"
      />
      <span className="relative rounded-full bg-primary-foreground/15 px-2.5 py-0.5 text-xs font-semibold tracking-wide uppercase">
        {feature.eyebrow}
      </span>
      <span className="relative font-heading text-lg leading-tight font-semibold">
        {feature.title}
      </span>
      <span className="relative text-sm text-primary-foreground/90">
        {feature.description}
      </span>
      <span className="relative mt-1 inline-flex items-center gap-1.5 text-sm font-semibold">
        {feature.cta}
        <ArrowRight className="size-4 transition-transform group-hover/feature:translate-x-1 motion-reduce:transition-none" />
      </span>
    </NavigationMenuLink>
  );
}
