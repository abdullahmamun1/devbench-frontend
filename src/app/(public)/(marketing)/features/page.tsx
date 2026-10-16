import CtaSection from "@/components/modules/marketing/cta-section";
import FeatureCard from "@/components/modules/marketing/feature-card";
import FeaturesNav from "@/components/modules/marketing/features-nav";
import BrowserFrame from "@/components/modules/marketing/home/browser-frame";
import ThemedShot from "@/components/modules/marketing/home/themed-shot";
import PageHero from "@/components/modules/marketing/page-hero";
import SectionHeading from "@/components/modules/marketing/section-heading";
import Reveal, { Stagger, StaggerItem } from "@/components/shared/reveal";
import { FEATURE_GROUPS, FEATURE_SHOWCASES } from "@/constants/marketing";
import { cn } from "@/lib/utils";
import { buildMetadata } from "@/utils/metadata";

export const metadata = buildMetadata({
  title: "Features",
  description:
    "Explore DevBench features for hiring teams, candidates and platform admins: problem bank, timed assessments, invitations, evaluations, credits and audit logs.",
  path: "/features",
});

const NAV = [
  { id: "company", label: "Hiring teams" },
  { id: "candidate", label: "Candidates" },
  { id: "admin", label: "Admins" },
];

export default function FeaturesPage() {
  return (
    <>
      <PageHero
        eyebrow="Features"
        title="Features for every role"
        description="Three portals on one platform: one for hiring teams, one for candidates and one for platform admins."
      />

      <FeaturesNav sections={NAV} />

      {FEATURE_GROUPS.map((group, groupIndex) => (
        <section
          key={group.id}
          id={group.id}
          // Extra offset: the sticky tab bar sits under the header on this page
          className={cn(
            "scroll-mt-8 [&_[id]]:scroll-mt-8",
            groupIndex % 2 === 1 && "border-y bg-muted/30",
          )}
        >
          <div className="mx-auto max-w-7xl space-y-20 px-4 py-24 sm:px-6">
            <SectionHeading
              eyebrow={group.eyebrow}
              title={group.title}
              description={group.description}
            />

            {FEATURE_SHOWCASES[group.id].map((item, i) => (
              <div
                key={item.shot}
                className="grid items-center gap-10 *:min-w-0 lg:grid-cols-[2fr_3fr]"
              >
                <Reveal
                  direction={i % 2 ? "left" : "right"}
                  className={cn("space-y-4", i % 2 === 1 && "lg:order-2")}
                >
                  <span className="inline-flex size-9 items-center justify-center rounded-full bg-primary/10 font-heading font-bold text-primary">
                    {i + 1}
                  </span>
                  <h3 className="text-h2 font-bold">{item.title}</h3>
                  <p className="text-lg text-muted-foreground">
                    {item.description}
                  </p>
                </Reveal>
                <Reveal direction={i % 2 ? "right" : "left"} delay={0.1}>
                  <BrowserFrame url={`devbench / ${item.title.toLowerCase()}`}>
                    <ThemedShot
                      id={item.shot}
                      alt={item.title}
                      sizes="(min-width: 1024px) 60vw, 100vw"
                    />
                  </BrowserFrame>
                </Reveal>
              </div>
            ))}

            <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((item) => (
                <StaggerItem key={item.title}>
                  <FeatureCard {...item} />
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      ))}

      <CtaSection />
    </>
  );
}
