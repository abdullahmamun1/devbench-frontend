"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import {
  fadeOnly,
  type RevealDirection,
  revealVariants,
  staggerContainer,
  VIEWPORT,
} from "@/lib/motion";

interface IRevealProps {
  children: ReactNode;
  className?: string;
  direction?: RevealDirection;
  delay?: number;
}

// Fades and slides its children in once they scroll into view.
export default function Reveal({
  children,
  className,
  direction = "up",
  delay = 0,
}: IRevealProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={reduce ? fadeOnly : revealVariants(direction, delay)}
    >
      {children}
    </motion.div>
  );
}

// Lets a stagger group be a real list, so <ol>/<li> semantics survive
type StaggerTag = "div" | "dl" | "ol" | "ul" | "li";

interface IStaggerProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  as?: StaggerTag;
}

// Reveals each <StaggerItem> inside it one after another.
export function Stagger({
  children,
  className,
  stagger = 0.08,
  delay = 0,
  as = "div",
}: IStaggerProps) {
  const Tag = motion[as];

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={staggerContainer(stagger, delay)}
    >
      {children}
    </Tag>
  );
}

export function StaggerItem({
  children,
  className,
  direction = "up",
  as = "div",
}: Omit<IRevealProps, "delay"> & { as?: StaggerTag }) {
  const reduce = useReducedMotion();
  const Tag = motion[as];

  return (
    <Tag
      className={className}
      variants={reduce ? fadeOnly : revealVariants(direction)}
    >
      {children}
    </Tag>
  );
}
