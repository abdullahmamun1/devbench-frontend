import type { ReactNode } from "react";
import Reveal from "@/components/shared/reveal";

// Hero for the inner marketing pages: brand glow, a faint dot grid and the
// same reveal as the home page.
export default function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  description: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)] [background-size:22px_22px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-96 w-[48rem] -translate-x-1/2 rounded-full bg-linear-to-r from-primary/20 via-brand-2/15 to-brand-3/10 blur-3xl"
      />
      <Reveal className="mx-auto max-w-4xl space-y-5 px-4 py-20 text-center sm:px-6 sm:py-24">
        {eyebrow && (
          <p className="inline-flex rounded-full border border-primary/20 bg-primary/8 px-4 py-1.5 text-sm font-semibold text-primary">
            {eyebrow}
          </p>
        )}
        <h1 className="text-h1 font-bold">{title}</h1>
        <p className="mx-auto max-w-2xl text-xl text-muted-foreground text-pretty">
          {description}
        </p>
        {children}
      </Reveal>
    </section>
  );
}
