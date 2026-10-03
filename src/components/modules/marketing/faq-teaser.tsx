import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ALL_FAQS } from "@/constants/faqs";
import FaqAccordion from "./faq-accordion";
import SectionHeading from "./section-heading";

export default function FaqTeaser() {
  return (
    <section className="mx-auto max-w-3xl space-y-8 px-4 py-16 sm:px-6">
      <SectionHeading eyebrow="FAQ" title="Common questions" />
      <FaqAccordion items={ALL_FAQS.slice(0, 3)} />
      <div className="text-center">
        <Link href="/faq" className={buttonVariants({ variant: "outline" })}>
          Read all questions
        </Link>
      </div>
    </section>
  );
}
