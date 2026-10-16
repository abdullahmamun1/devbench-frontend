import CtaSection from "@/components/modules/marketing/cta-section";
import FaqTeaser from "@/components/modules/marketing/faq-teaser";
import BuiltWith from "@/components/modules/marketing/home/built-with";
import Comparison from "@/components/modules/marketing/home/comparison";
import IntegrityDemo from "@/components/modules/marketing/home/integrity-demo";
import LanguageMarquee from "@/components/modules/marketing/home/language-marquee";
import LiveStats from "@/components/modules/marketing/home/live-stats";
import PricingSection from "@/components/modules/marketing/home/pricing-section";
import ProblemFix from "@/components/modules/marketing/home/problem-fix";
import ProductTour from "@/components/modules/marketing/home/product-tour";
import RoleTabs from "@/components/modules/marketing/home/role-tabs";
import TrustBento from "@/components/modules/marketing/home/trust-bento";
import HomeHero from "@/components/modules/marketing/home-hero";
import HowItWorks from "@/components/modules/marketing/how-it-works";
import { SITE_DESCRIPTION } from "@/constants/site";
import { getPublicStats } from "@/lib/public-stats";
import { buildMetadata } from "@/utils/metadata";

// Rebuild at most every ten minutes so the live numbers stay current
export const revalidate = 600;

export const metadata = buildMetadata({
  title: "Developer assessment platform",
  description: SITE_DESCRIPTION,
  path: "/",
});

export default async function HomePage() {
  const stats = await getPublicStats();

  return (
    <>
      <HomeHero stats={stats} />
      <LanguageMarquee />
      <ProblemFix />
      <ProductTour />
      <HowItWorks />
      <RoleTabs />
      <TrustBento />
      <IntegrityDemo />
      <LiveStats stats={stats} />
      <Comparison />
      <PricingSection />
      <FaqTeaser />
      <CtaSection />
      <BuiltWith />
    </>
  );
}
