import FaqAccordion from "@/components/modules/marketing/faq-accordion";
import PageHero from "@/components/modules/marketing/page-hero";
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
        title="Frequently asked questions"
        description="Quick answers for hiring teams and candidates. Can't find yours? Send us a message."
      />

      <div className="mx-auto max-w-3xl space-y-10 px-4 py-14 sm:px-6">
        {FAQ_GROUPS.map((group) => (
          <section key={group.title} className="space-y-4">
            <h2 className="font-heading text-xl font-semibold">
              {group.title}
            </h2>
            <FaqAccordion items={group.items} />
          </section>
        ))}
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
