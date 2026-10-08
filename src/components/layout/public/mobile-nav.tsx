"use client";

import { Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SITE_NAME } from "@/constants/site";
import HeaderActions from "./header-actions";
import NavLinks from "./nav-links";

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            className="md:hidden"
            aria-label="Open menu"
          />
        }
      >
        <Menu />
      </SheetTrigger>
      <SheetContent side="right" className="w-72">
        <SheetHeader>
          <SheetTitle>{SITE_NAME}</SheetTitle>
        </SheetHeader>
        <nav aria-label="Mobile" className="px-4">
          <NavLinks variant="stacked" onNavigate={close} />
        </nav>
        <div className="mt-auto p-4">
          <HeaderActions
            onNavigate={close}
            className="flex-col items-stretch *:w-full"
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
