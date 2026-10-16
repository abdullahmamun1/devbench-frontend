import { Stagger, StaggerItem } from "@/components/shared/reveal";
import type { PublicStats } from "@/types";
import SectionHeading from "../section-heading";
import CountUp from "./count-up";

// Real totals from the platform database. The page skips this section when
// the numbers can't be loaded, rather than showing invented ones.
export default function LiveStats({ stats }: { stats: PublicStats | null }) {
  if (!stats) return null;

  const tiles = [
    { label: "Problems in the bank", value: stats.problemCount },
    { label: "Assessments published", value: stats.publishedAssessmentCount },
    { label: "Attempts completed", value: stats.completedAttemptCount },
    { label: "Answers graded", value: stats.gradedAnswerCount },
  ];

  return (
    <section
      id="live-numbers"
      className="relative overflow-hidden border-y bg-linear-to-br from-primary/8 via-background to-brand-2/8 py-24"
    >
      <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6">
        <SectionHeading
          eyebrow="Live numbers"
          title="Counted from the platform, not a pitch deck"
          description="Totals across every company on this DevBench instance, refreshed every ten minutes."
        />
        <Stagger as="dl" className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {tiles.map((tile) => (
            <StaggerItem
              key={tile.label}
              className="flex flex-col-reverse gap-2 rounded-3xl border bg-card/80 p-7 text-center shadow-sm backdrop-blur"
            >
              <dt className="text-muted-foreground">{tile.label}</dt>
              <dd className="font-heading text-5xl font-bold text-gradient-brand">
                <CountUp value={tile.value} />
              </dd>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
