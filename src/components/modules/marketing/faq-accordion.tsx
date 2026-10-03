import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { FaqItem } from "@/constants/faqs";

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <Accordion className="overflow-hidden rounded-xl border">
      {items.map((item) => (
        <AccordionItem
          key={item.question}
          value={item.question}
          className="px-0 not-last:border-b last:border-b-0"
        >
          <AccordionTrigger className="rounded-none px-4 py-4 text-left text-base">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="px-4 text-muted-foreground">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
