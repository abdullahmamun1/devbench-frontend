"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// Sticky tabs for the features page that highlight the section in view
export default function FeaturesNav({
  sections,
}: {
  sections: { id: string; label: string }[];
}) {
  const [active, setActive] = useState(sections[0]?.id);

  // The current section is the last one whose top has passed 35% of the
  // viewport. Checked on scroll (once per frame), so jumps and fast scrolls
  // land on the right tab too.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.35;
      let current = sections[0]?.id;
      for (const { id } of sections) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [sections]);

  return (
    <nav
      aria-label="Features by role"
      className="sticky top-16 z-30 border-b bg-background/85 backdrop-blur-xl"
    >
      <ul className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-2.5 sm:justify-center sm:px-6">
        {sections.map(({ id, label }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              aria-current={active === id ? "location" : undefined}
              className={cn(
                "block rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors",
                active === id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
