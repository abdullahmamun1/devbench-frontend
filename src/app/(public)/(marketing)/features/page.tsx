import CtaSection from "@/components/modules/marketing/cta-section";
import FeatureCard from "@/components/modules/marketing/feature-card";
import PageHero from "@/components/modules/marketing/page-hero";
import SectionHeading from "@/components/modules/marketing/section-heading";
import { FEATURE_GROUPS } from "@/constants/marketing";
import { buildMetadata } from "@/utils/metadata";

export const metadata = buildMetadata({
  title: "Features",
  description:
    "Explore DevBench features for hiring teams, candidates and platform admins: problem bank, timed assessments, invitations, evaluations and billing.",
  path: "/features",
});

export default function FeaturesPage() {
  return (
    <>
      <PageHero
        title="Features for every role"
        description="DevBench has three portals: one for companies, one for candidates and one for platform admins."
      />

      {FEATURE_GROUPS.map((group, index) => (
        <section
          key={group.id}
          id={group.id}
          className={index % 2 === 1 ? "border-y bg-muted/30" : undefined}
        >
          <div className="mx-auto max-w-7xl space-y-10 px-4 py-16 sm:px-6">
            <SectionHeading
              eyebrow={group.eyebrow}
              title={group.title}
              description={group.description}
            />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((item) => (
                <FeatureCard key={item.title} {...item} />
              ))}
            </div>
          </div>
        </section>
      ))}

      <CtaSection />
    </>
  );
}
