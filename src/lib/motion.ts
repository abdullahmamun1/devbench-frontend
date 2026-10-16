import type { Transition, Variants } from "motion/react";

// One easing curve for the whole site: quick start, soft landing.
export const EASE_OUT: Transition["ease"] = [0.22, 1, 0.36, 1];

export const DURATION = {
  fast: 0.2,
  base: 0.5,
  slow: 0.8,
} as const;

// Animate once, when the element is a little way into the viewport.
export const VIEWPORT = { once: true, margin: "0px 0px -80px 0px" } as const;

export type RevealDirection = "up" | "down" | "left" | "right" | "none";

const OFFSET = 24;

const offsetFor = (direction: RevealDirection) => {
  switch (direction) {
    case "up":
      return { y: OFFSET };
    case "down":
      return { y: -OFFSET };
    case "left":
      return { x: OFFSET };
    case "right":
      return { x: -OFFSET };
    default:
      return {};
  }
};

export const revealVariants = (
  direction: RevealDirection = "up",
  delay = 0,
): Variants => ({
  hidden: { opacity: 0, ...offsetFor(direction) },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE_OUT, delay },
  },
});

export const staggerContainer = (stagger = 0.08, delay = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

// Reduced motion: keep a short fade so content still appears, but no movement.
export const fadeOnly: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DURATION.fast } },
};
