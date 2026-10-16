import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Reveal from "@/components/shared/reveal";
import { buttonVariants } from "@/components/ui/button";

export default function CtaSection({
  title = "Run your first assessment in five minutes",
  description = "Create a free account, buy credits when you need them and invite your first candidate today.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="px-4 py-20 sm:px-6">
      <Reveal className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-primary px-6 py-20 text-center text-primary-foreground shadow-2xl shadow-primary/25">
        {/* Slow-drifting colour mesh */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute -top-1/3 -left-1/4 size-[28rem] rounded-full bg-brand-2/50 blur-3xl motion-safe:animate-drift" />
          <div className="absolute -right-1/4 -bottom-1/2 size-[30rem] rounded-full bg-brand-3/35 blur-3xl motion-safe:animate-drift [animation-delay:-9s]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,var(--primary)_85%)] opacity-60" />
        </div>

        <div className="relative space-y-6">
          <h2 className="text-h2 font-bold">{title}</h2>
          <p className="mx-auto max-w-xl text-lg text-primary-foreground/90">
            {description}
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className={buttonVariants({
                variant: "secondary",
                size: "xl",
                className: "shadow-lg",
              })}
            >
              Create an account
              <ArrowRight />
            </Link>
            <Link
              href="/login"
              className={buttonVariants({
                variant: "outline",
                size: "xl",
                className:
                  "border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground",
              })}
            >
              Try the live demo
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
