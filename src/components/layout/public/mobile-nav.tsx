"use client";

import { ArrowUpRight, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NAV_MENU, SITE_NAME } from "@/constants/site";
import { cn } from "@/lib/utils";
import { isNavActive } from "@/utils/nav";
import HeaderActions from "./header-actions";

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden"
            aria-label="Open menu"
          />
        }
      >
        <Menu />
      </SheetTrigger>
      <SheetContent side="right" className="w-[min(88vw,22rem)]">
        <SheetHeader>
          <SheetTitle className="font-heading text-xl">{SITE_NAME}</SheetTitle>
        </SheetHeader>

        <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-4">
          <Accordion className="rounded-none border-0">
            {NAV_MENU.map((entry) =>
              "href" in entry ? (
                <Link
                  key={entry.label}
                  href={entry.href}
                  onClick={close}
                  aria-current={
                    isNavActive(pathname, entry.href) ? "page" : undefined
                  }
                  className="block border-b px-1 py-4 text-base font-medium aria-[current=page]:text-primary"
                >
                  {entry.label}
                </Link>
              ) : (
                <AccordionItem
                  key={entry.label}
                  value={entry.label}
                  className="border-b data-open:bg-transparent"
                >
                  <AccordionTrigger className="px-1 py-4 text-base hover:no-underline">
                    {entry.label}
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 px-0 pb-4 [&_a]:no-underline">
                    {entry.sections.map((section) => (
                      <div key={section.title} className="space-y-1">
                        <p className="px-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                          {section.title}
                        </p>
                        <ul>
                          {section.links.map(
                            ({ label, href, icon: Icon, external }) => {
                              const active = isNavActive(pathname, href);
                              return (
                                <li key={href}>
                                  <Link
                                    href={href}
                                    onClick={close}
                                    {...(external && {
                                      target: "_blank",
                                      rel: "noreferrer",
                                    })}
                                    aria-current={active ? "page" : undefined}
                                    className={cn(
                                      "flex items-center gap-3 rounded-lg px-1 py-2.5 text-[0.95rem] hover:bg-muted",
                                      active && "text-primary",
                                    )}
                                  >
                                    <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                      <Icon className="size-4" />
                                    </span>
                                    {label}
                                    {external && (
                                      <ArrowUpRight
                                        className="size-3.5 text-muted-foreground"
                                        aria-label="(opens in a new tab)"
                                      />
                                    )}
                                  </Link>
                                </li>
                              );
                            },
                          )}
                        </ul>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              ),
            )}
          </Accordion>
        </nav>

        <div className="border-t p-4">
          <HeaderActions
            variant="list"
            onNavigate={close}
            className="flex-col items-stretch *:w-full"
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
