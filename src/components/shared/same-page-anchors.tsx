"use client";

import { useEffect } from "react";

// Links to a section of the page you're already on (/#tour while on /) do
// nothing in the browser or in Next's Link once the URL already has that hash,
// so a second click on "Product tour" wouldn't scroll. This handles those
// clicks for every anchor on the site: scroll to the section and update the URL.
// Next's Link skips its own navigation for clicks that were already handled.
export default function SamePageAnchors() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }
      const link = (e.target as Element | null)?.closest?.("a[href]");
      if (!(link instanceof HTMLAnchorElement) || link.target === "_blank") {
        return;
      }
      const url = new URL(link.href);
      if (
        url.origin !== window.location.origin ||
        url.pathname !== window.location.pathname ||
        !url.hash
      ) {
        return;
      }
      const target = document.getElementById(
        decodeURIComponent(url.hash.slice(1)),
      );
      if (!target) return;

      e.preventDefault();
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      // scrollIntoView honours the scroll-padding that clears the sticky header
      target.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "start",
      });
      if (window.location.hash !== url.hash) {
        window.history.pushState(window.history.state, "", url.hash);
      }
    };

    // Capture phase, so this runs before React's handlers (and Next's Link)
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
