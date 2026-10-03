import { HOW_IT_WORKS } from "@/constants/marketing";
import SectionHeading from "./section-heading";

export default function HowItWorks() {
  return (
    <section className="border-y bg-muted/30">
      <div className="mx-auto max-w-7xl space-y-10 px-4 py-16 sm:px-6">
        <SectionHeading
          eyebrow="How it works"
          title="From question bank to hiring decision in four steps"
        />
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {HOW_IT_WORKS.map((step, index) => (
            <li key={step.title} className="space-y-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground">
                {index + 1}
              </span>
              <h3 className="font-semibold">{step.title}</h3>
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
