import { CREDIT_PRICE_CENTS } from "@/constants/billing";
import CreditCalculator from "../credit-calculator";
import SectionHeading from "../section-heading";

export default function PricingSection() {
  const price = (CREDIT_PRICE_CENTS / 100).toFixed(2);

  return (
    <section className="border-y bg-muted/30 py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
        <div className="space-y-6">
          <SectionHeading
            align="left"
            eyebrow="Simple pricing"
            title={`$${price} per credit, one credit per invitation`}
            description="No subscription and no seats. Buy from 1 to 1,000 credits at a time and use them whenever you invite a candidate. Revoking an unused invitation refunds its credit."
          />
        </div>
        <CreditCalculator />
      </div>
    </section>
  );
}
