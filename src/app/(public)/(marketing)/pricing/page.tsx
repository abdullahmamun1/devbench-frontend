import {
  BadgeCheck,
  CalendarOff,
  CreditCard,
  Gift,
  ReceiptText,
  RotateCcw,
  UserRound,
} from "lucide-react";
import CreditCalculator from "@/components/modules/marketing/credit-calculator";
import CtaSection from "@/components/modules/marketing/cta-section";
import FaqAccordion from "@/components/modules/marketing/faq-accordion";
import PageHero from "@/components/modules/marketing/page-hero";
import SectionHeading from "@/components/modules/marketing/section-heading";
import Reveal, { Stagger, StaggerItem } from "@/components/shared/reveal";
import { CREDIT_PRICE_CENTS } from "@/constants/billing";
import { FAQ_GROUPS } from "@/constants/faqs";
import { buildMetadata } from "@/utils/metadata";

export const metadata = buildMetadata({
  title: "Pricing",
  description:
    "DevBench uses simple pay-as-you-go credits. Each invitation costs one credit. Calculate your total before you buy.",
  path: "/pricing",
});

const price = (cents: number) =>
  `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

// Each fact here is enforced by the backend, not just promised
const FACTS = [
  {
    icon: Gift,
    title: "10 credits to start",
    text: "Sign up as a company and your workspace starts with 10 credits, enough to try a real round.",
  },
  {
    icon: CalendarOff,
    title: "Credits don't expire",
    text: "Buy when you hire and keep the rest for the next round. There's no monthly reset.",
  },
  {
    icon: RotateCcw,
    title: "Revoke and get it back",
    text: "Revoking an invitation that hasn't been accepted refunds its credit straight away.",
  },
  {
    icon: UserRound,
    title: "Free for candidates",
    text: "Candidates never pay or enter a card. They accept an invitation and start.",
  },
  {
    icon: CreditCard,
    title: "Stripe Checkout",
    text: "Card details go to Stripe, never to DevBench. Credits land once Stripe confirms the payment.",
  },
  {
    icon: ReceiptText,
    title: "A ledger for every credit",
    text: "Purchases, invitations, refunds and adjustments each appear in your billing history.",
  },
];

const ROUNDS = [
  { label: "A single hire", candidates: 5 },
  { label: "A busy month", candidates: 20 },
  { label: "A graduate intake", candidates: 100 },
];

const BILLING_FAQ =
  FAQ_GROUPS.find((group) => group.title === "Billing")?.items ?? [];

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title={
          <>
            <span className="text-gradient-brand">
              {price(CREDIT_PRICE_CENTS)}
            </span>{" "}
            per invitation
          </>
        }
        description="One credit invites one candidate. No subscription, no seats and no contract."
      />

      <section className="mx-auto grid max-w-6xl items-start gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2">
        <Reveal className="space-y-6">
          <SectionHeading
            align="left"
            eyebrow="Calculator"
            title="Work out a hiring round"
            description="Pick how many candidates you plan to invite. You only buy credits when you need them."
          />
          <div className="overflow-hidden rounded-3xl border bg-card">
            <table className="w-full text-left">
              <caption className="sr-only">
                Example hiring rounds and their cost
              </caption>
              <thead className="bg-muted/60 text-sm text-muted-foreground">
                <tr>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Example
                  </th>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Candidates
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 text-right font-semibold"
                  >
                    Cost
                  </th>
                </tr>
              </thead>
              <tbody>
                {ROUNDS.map((round) => (
                  <tr key={round.label} className="border-t">
                    <th scope="row" className="px-5 py-4 font-medium">
                      {round.label}
                    </th>
                    <td className="px-5 py-4 tabular-nums">
                      {round.candidates}
                    </td>
                    <td className="px-5 py-4 text-right font-heading text-lg font-semibold tabular-nums">
                      {price(round.candidates * CREDIT_PRICE_CENTS)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
        <Reveal direction="left" delay={0.1}>
          <CreditCalculator />
        </Reveal>
      </section>

      <section id="included" className="border-y bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6">
          <SectionHeading
            eyebrow="What's included"
            title="Simple rules, enforced by the platform"
          />
          <Stagger as="ul" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FACTS.map(({ icon: Icon, title, text }) => (
              <StaggerItem
                as="li"
                key={title}
                className="flex gap-4 rounded-3xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-lg hover:shadow-primary/10"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
                <span className="space-y-1.5">
                  <span className="flex items-center gap-1.5 font-heading text-lg font-semibold">
                    {title}
                    <BadgeCheck
                      className="size-4 text-brand-2"
                      aria-hidden="true"
                    />
                  </span>
                  <span className="block text-muted-foreground">{text}</span>
                </span>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {BILLING_FAQ.length > 0 && (
        <section
          id="billing-faq"
          className="mx-auto max-w-3xl space-y-8 px-4 py-20 sm:px-6"
        >
          <SectionHeading
            eyebrow="Billing FAQ"
            title="Questions about paying"
          />
          <FaqAccordion items={BILLING_FAQ} />
        </section>
      )}

      <CtaSection />
    </>
  );
}
