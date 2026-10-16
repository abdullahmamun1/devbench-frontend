"use client";

import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "motion/react";
import { usePathname } from "next/navigation";
import { type ReactNode, useState } from "react";
import { cn } from "@/lib/utils";

// Sticky header that tightens once the page scrolls: shorter, more opaque,
// with a shadow. On the home page a thin bar shows how far down you are.
export default function HeaderShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { scrollY, scrollYProgress } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const progress = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 40,
    restDelta: 0.001,
  });

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 12));

  return (
    <header
      data-scrolled={scrolled}
      className={cn(
        "group/header sticky top-0 z-40 border-b transition-[background-color,border-color,box-shadow] duration-300",
        scrolled
          ? "border-border bg-background/85 shadow-sm backdrop-blur-xl"
          : "border-transparent bg-background/60 backdrop-blur",
      )}
    >
      {children}
      {pathname === "/" && (
        <motion.div
          aria-hidden="true"
          style={{ scaleX: progress }}
          className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-linear-to-r from-primary to-brand-2"
        />
      )}
    </header>
  );
}
