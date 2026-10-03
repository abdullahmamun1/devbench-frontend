import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function CtaSection({
  title = "Ready to run your first assessment?",
  description = "Create a free account, buy credits when you need them and invite your first candidate in minutes.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-5xl space-y-6 rounded-2xl bg-primary px-6 py-14 text-center text-primary-foreground">
        <h2 className="font-heading text-3xl font-bold text-balance">
          {title}
        </h2>
        <p className="mx-auto max-w-xl text-primary-foreground/80">
          {description}
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/register"
            className={buttonVariants({ variant: "secondary", size: "lg" })}
          >
            Create an account
          </Link>
          <Link
            href="/login"
            className={buttonVariants({
              variant: "outline",
              size: "lg",
              className:
                "border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10",
            })}
          >
            Try the demo
          </Link>
        </div>
      </div>
    </section>
  );
}
