import AudienceSplit from "@/components/modules/marketing/audience-split";
import CtaSection from "@/components/modules/marketing/cta-section";
import FeatureCard from "@/components/modules/marketing/feature-card";
import HomeHero from "@/components/modules/marketing/home-hero";
import HowItWorks from "@/components/modules/marketing/how-it-works";
import PricingTeaser from "@/components/modules/marketing/pricing-teaser";
import SectionHeading from "@/components/modules/marketing/section-heading";
import { CORE_FEATURES } from "@/constants/marketing";
import { SITE_DESCRIPTION } from "@/constants/site";
import { buildMetadata } from "@/utils/metadata";

export const metadata = buildMetadata({
  title: "Developer assessment platform",
  description: SITE_DESCRIPTION,
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <HowItWorks />

      <section className="mx-auto max-w-7xl space-y-10 px-4 py-16 sm:px-6">
        <SectionHeading
          eyebrow="Features"
          title="Built for the whole hiring workflow"
          description="Everything from writing the first question to reviewing the last answer."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CORE_FEATURES.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>

      <AudienceSplit />
      <PricingTeaser />
      <CtaSection />
    </>
  );
}
