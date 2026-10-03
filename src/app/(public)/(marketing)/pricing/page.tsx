import { Mail, ShieldCheck, Wallet } from "lucide-react";
import CreditCalculator from "@/components/modules/marketing/credit-calculator";
import CtaSection from "@/components/modules/marketing/cta-section";
import FeatureCard from "@/components/modules/marketing/feature-card";
import PageHero from "@/components/modules/marketing/page-hero";
import { buildMetadata } from "@/utils/metadata";

export const metadata = buildMetadata({
  title: "Pricing",
  description:
    "DevBench uses simple pay-as-you-go credits. Each invitation costs one credit. Calculate your total before you buy.",
  path: "/pricing",
});

export default function PricingPage() {
  const cents = Number(process.env.NEXT_PUBLIC_CREDIT_PRICE_CENTS) || 100;

  return (
    <>
      <PageHero
        title="Pay only for the candidates you invite"
        description={`One credit costs $${(cents / 100).toFixed(2)} and each invitation uses one credit. No subscription, no contract.`}
      />

      <section className="px-4 py-14 sm:px-6">
        <CreditCalculator />
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-16 sm:px-6 md:grid-cols-3">
        <FeatureCard
          icon={Mail}
          title="One credit per invitation"
          description="Sending an invitation uses a single credit. Candidates never pay anything."
        />
        <FeatureCard
          icon={Wallet}
          title="Buy 1 to 1,000 at a time"
          description="Pick any amount in a single purchase and top up whenever your balance runs low."
        />
        <FeatureCard
          icon={ShieldCheck}
          title="Secure Stripe checkout"
          description="Payments are handled by Stripe. Your purchases and credit history stay in your billing page."
        />
      </section>

      <CtaSection />
    </>
  );
}
