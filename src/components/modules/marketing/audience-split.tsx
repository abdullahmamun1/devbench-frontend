import { Building2, UserRound } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const AUDIENCES = [
  {
    icon: Building2,
    title: "For companies",
    points: [
      "Build a reusable problem bank",
      "Invite your team with creator and evaluator roles",
      "Pay only for the invitations you send",
    ],
    cta: { label: "Create a company account", href: "/register" },
  },
  {
    icon: UserRound,
    title: "For candidates",
    points: [
      "Keep every invitation in one inbox",
      "Work in a focused, timed exam screen",
      "Review your past attempts and results",
    ],
    cta: { label: "Create a candidate account", href: "/register" },
  },
];

export default function AudienceSplit() {
  return (
    <section className="mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:px-6 md:grid-cols-2">
      <h2 className="sr-only">Who DevBench is for</h2>
      {AUDIENCES.map(({ icon: Icon, title, points, cta }) => (
        <Card key={title}>
          <CardContent className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-5" />
              </div>
              <h3 className="font-heading text-xl font-semibold">{title}</h3>
            </div>
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              {points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <Link
              href={cta.href}
              className={buttonVariants({ variant: "outline" })}
            >
              {cta.label}
            </Link>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
