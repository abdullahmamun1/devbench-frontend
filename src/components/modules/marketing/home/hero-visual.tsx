"use client";

import { useReducedMotion } from "motion/react";
import dynamic from "next/dynamic";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

// three.js only loads in the browser, and only when the scene will be shown
const HeroScene = dynamic(() => import("./hero-scene"), { ssr: false });

const DESKTOP = "(min-width: 1024px)";

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

// Renders the fallback (a real screenshot) first, so it's what loads fast and
// what phones, reduced-motion users and browsers without WebGL keep. On large
// screens the 3D scene loads afterwards and fades in on top of it.
export default function HeroVisual({ fallback }: { fallback: ReactNode }) {
  const reduce = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const [onScreen, setOnScreen] = useState(true);

  useEffect(() => {
    const query = window.matchMedia(DESKTOP);
    const decide = () =>
      setEnabled(query.matches && !reduce && supportsWebGL());
    decide();
    query.addEventListener("change", decide);
    return () => query.removeEventListener("change", decide);
  }, [reduce]);

  // Stop rendering frames while the hero is scrolled out of view
  useEffect(() => {
    if (!enabled || !box.current) return;
    const observer = new IntersectionObserver(([entry]) =>
      setOnScreen(entry.isIntersecting),
    );
    observer.observe(box.current);
    return () => observer.disconnect();
  }, [enabled]);

  const handleReady = useCallback(() => setReady(true), []);
  const showScene = enabled && ready;

  return (
    <div ref={box} className="relative">
      <div
        aria-hidden={showScene || undefined}
        className={cn(
          "transition-opacity duration-700",
          showScene && "pointer-events-none opacity-0",
        )}
      >
        {fallback}
      </div>

      {enabled && (
        <div
          role="img"
          aria-label="Three floating panels: a code editor with passing tests, a multiple choice question and a written answer"
          className={cn(
            "absolute -inset-x-16 -inset-y-16 transition-opacity duration-1000",
            showScene ? "opacity-100" : "opacity-0",
          )}
        >
          <HeroScene active={onScreen} onReady={handleReady} />
        </div>
      )}
    </div>
  );
}
