import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function PricingTeaser() {
  const cents = Number(process.env.NEXT_PUBLIC_CREDIT_PRICE_CENTS) || 100;
  const price = (cents / 100).toFixed(2);

  return (
    <section className="border-y bg-muted/30">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 py-14 text-center sm:px-6">
        <p className="text-sm font-semibold tracking-wide text-primary uppercase">
          Simple pricing
        </p>
        <h2 className="font-heading text-3xl font-bold text-balance">
          ${price} per credit, one credit per invitation
        </h2>
        <p className="max-w-xl text-muted-foreground">
          There is no subscription. Buy as many credits as you need, from 1 to
          1,000 per purchase, and use them whenever you invite a candidate.
        </p>
        <Link
          href="/pricing"
          className={buttonVariants({ variant: "outline" })}
        >
          See the credit calculator
        </Link>
      </div>
    </section>
  );
}
