import { ArrowRight, MessageSquare } from "lucide-react";
import Link from "next/link";
import FaqExplorer from "@/components/modules/marketing/faq-explorer";
import PageHero from "@/components/modules/marketing/page-hero";
import { buttonVariants } from "@/components/ui/button";
import { ALL_FAQS, FAQ_GROUPS } from "@/constants/faqs";
import { buildMetadata } from "@/utils/metadata";

export const metadata = buildMetadata({
  title: "FAQ",
  description:
    "Answers to common questions about DevBench assessments, invitations, team roles, credits and billing.",
  path: "/faq",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: ALL_FAQS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

export default function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Frequently asked questions"
        description="Quick answers for hiring teams and candidates. Search, filter by topic, or share a link to any answer."
      />

      <div className="mx-auto max-w-3xl space-y-12 px-4 py-16 sm:px-6">
        <FaqExplorer groups={FAQ_GROUPS} />

        <aside className="flex flex-col items-start gap-4 rounded-3xl border bg-linear-to-br from-primary/8 to-brand-2/8 p-7 sm:flex-row sm:items-center">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <MessageSquare className="size-5" />
          </span>
          <div className="flex-1 space-y-1">
            <h2 className="font-heading text-xl font-semibold">Still stuck?</h2>
            <p className="text-muted-foreground">
              Ask us directly and we&apos;ll reply to your email.
            </p>
          </div>
          <Link
            href="/contact"
            className={buttonVariants({ variant: "brand" })}
          >
            Contact us
            <ArrowRight />
          </Link>
        </aside>
      </div>

      <script
        type="application/ld+json"
        // "<" is escaped so the data can't close the script tag
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
