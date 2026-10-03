import Image from "next/image";
import CtaSection from "@/components/modules/marketing/cta-section";
import PageHero from "@/components/modules/marketing/page-hero";
import SectionHeading from "@/components/modules/marketing/section-heading";
import { Badge } from "@/components/ui/badge";
import { TECH_STACK } from "@/constants/marketing";
import { buildMetadata } from "@/utils/metadata";

export const metadata = buildMetadata({
  title: "About",
  description:
    "Why DevBench exists, how its three portals fit together and the technology it is built with.",
  path: "/about",
});

const PORTALS = [
  {
    title: "Company portal",
    text: "Owners, assessment creators and evaluators build problems and assessments, send invitations and review results.",
  },
  {
    title: "Candidate portal",
    text: "Candidates accept invitations, take timed assessments and keep a record of their attempts.",
  },
  {
    title: "Admin portal",
    text: "Platform admins manage companies and candidates and keep an audit trail of important actions.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="Assessments that respect everyone's time"
        description="DevBench is a developer assessment platform that keeps writing, taking and reviewing tests in one place."
      />

      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
        <div className="relative aspect-3/2 overflow-hidden rounded-2xl border bg-muted">
          <Image
            src="/images/about.jpg"
            alt="A small team reviewing work together"
            fill
            sizes="(min-width: 1024px) 560px, 100vw"
            className="object-cover"
          />
        </div>
        <div className="space-y-4">
          <SectionHeading
            align="left"
            eyebrow="Our mission"
            title="Make technical hiring simple and fair"
          />
          <p className="text-muted-foreground">
            Hiring teams often stitch together spreadsheets, email threads and
            separate testing tools. Candidates juggle links and deadlines.
            DevBench puts the whole flow in one workspace: build a problem,
            assemble an assessment, invite a candidate and review the result.
          </p>
          <p className="text-muted-foreground">
            Every invitation costs one credit and you only pay for what you use,
            so small teams can start with a single candidate.
          </p>
        </div>
      </section>

      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl space-y-10 px-4 py-16 sm:px-6">
          <SectionHeading
            eyebrow="How it fits together"
            title="Three portals, one platform"
          />
          <div className="grid gap-6 md:grid-cols-3">
            {PORTALS.map((portal) => (
              <div
                key={portal.title}
                className="space-y-2 rounded-xl border bg-background p-6"
              >
                <h3 className="font-semibold">{portal.title}</h3>
                <p className="text-sm text-muted-foreground">{portal.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl space-y-6 px-4 py-16 text-center sm:px-6">
        <SectionHeading
          eyebrow="Built with"
          title="A modern full stack"
          description="DevBench is a Next.js front end talking to an Express and Prisma API, with Stripe handling payments."
        />
        <div className="flex flex-wrap justify-center gap-2">
          {TECH_STACK.map((tech) => (
            <Badge key={tech} variant="secondary">
              {tech}
            </Badge>
          ))}
        </div>
      </section>

      <CtaSection />
    </>
  );
}
