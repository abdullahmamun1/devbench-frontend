import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// Full-page message for 404 and error routes: brand glow, a faint dot grid,
// a big gradient code and room for actions and helpful links.
export default function StatusPage({
  code,
  icon: Icon,
  eyebrow,
  title,
  description,
  actions,
  children,
  className,
}: {
  code?: string;
  icon?: LucideIcon;
  eyebrow: string;
  title: string;
  description: ReactNode;
  actions: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative isolate flex flex-1 flex-col items-center justify-center overflow-hidden px-4 py-20 text-center sm:px-6",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_70%)] [background-size:22px_22px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/4 left-1/2 -z-10 h-80 w-[min(48rem,100%)] -translate-x-1/2 rounded-full bg-linear-to-r from-primary/20 via-brand-2/15 to-brand-3/10 blur-3xl"
      />

      <div className="flex max-w-2xl flex-col items-center gap-6 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-500">
        {code ? (
          <p
            aria-hidden="true"
            className="font-heading text-[clamp(6rem,22vw,11rem)] leading-none font-bold tracking-tighter text-gradient-brand"
          >
            {code}
          </p>
        ) : Icon ? (
          <div className="flex size-20 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <Icon className="size-10" aria-hidden="true" />
          </div>
        ) : null}

        <div className="space-y-3">
          <p className="inline-flex rounded-full border border-primary/20 bg-primary/8 px-4 py-1.5 text-sm font-semibold text-primary">
            {eyebrow}
          </p>
          <h1 className="text-h2 font-bold text-balance">{title}</h1>
          <div className="mx-auto max-w-xl text-lg text-muted-foreground text-pretty">
            {description}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3">{actions}</div>
      </div>

      {children}
    </section>
  );
}
