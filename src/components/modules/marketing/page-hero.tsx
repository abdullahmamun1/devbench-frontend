import type { ReactNode } from "react";

export default function PageHero({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <section className="border-b bg-muted/30">
      <div className="mx-auto max-w-4xl space-y-4 px-4 py-14 text-center sm:px-6 sm:py-20">
        <h1 className="font-heading text-4xl font-bold tracking-tight text-balance sm:text-5xl">
          {title}
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-pretty">
          {description}
        </p>
        {children}
      </div>
    </section>
  );
}
