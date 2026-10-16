"use client";

import { Check, Link2, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import type { FaqGroup } from "@/constants/faqs";
import { cn } from "@/lib/utils";

const ALL = "All";

export const faqId = (question: string) =>
  `faq-${question
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;

function CopyLink({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        const url = `${window.location.origin}${window.location.pathname}#${id}`;
        try {
          await navigator.clipboard.writeText(url);
          window.history.replaceState(null, "", `#${id}`);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          window.location.hash = id;
        }
      }}
      className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
    >
      {copied ? <Check className="size-3.5" /> : <Link2 className="size-3.5" />}
      {copied ? "Link copied" : "Copy link to this answer"}
    </button>
  );
}

// Searchable, filterable FAQ. Every question has its own #anchor, and arriving
// on one opens that answer.
export default function FaqExplorer({ groups }: { groups: FaqGroup[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(ALL);
  const [open, setOpen] = useState<string[]>([]);

  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id.startsWith("faq-")) return;
    setOpen([id]);
    requestAnimationFrame(() =>
      document.getElementById(id)?.scrollIntoView({ block: "center" }),
    );
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return groups
      .filter((g) => category === ALL || g.title === category)
      .map((g) => ({
        ...g,
        items: g.items.filter(
          (item) =>
            !q ||
            item.question.toLowerCase().includes(q) ||
            item.answer.toLowerCase().includes(q),
        ),
      }))
      .filter((g) => g.items.length > 0);
  }, [groups, query, category]);

  const count = filtered.reduce((n, g) => n + g.items.length, 0);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="relative">
          <Search
            className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions, e.g. credits, timer, refund"
            aria-label="Search the FAQ"
            className="h-13 pr-12 pl-12 text-base md:text-base"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter by topic"
        >
          {[ALL, ...groups.map((g) => g.title)].map((title) => (
            <button
              key={title}
              type="button"
              aria-pressed={category === title}
              onClick={() => setCategory(title)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                category === title
                  ? "border-primary bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {title}
            </button>
          ))}
        </div>
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {count === 1 ? "1 question" : `${count} questions`}
          {query && ` matching "${query.trim()}"`}
        </p>
      </div>

      {filtered.map((group) => (
        <section key={group.title} className="space-y-4">
          <h2 className="font-heading text-2xl font-semibold">{group.title}</h2>
          <Accordion
            value={open}
            onValueChange={(value) => setOpen(value as string[])}
            className="overflow-hidden rounded-2xl border bg-card"
          >
            {group.items.map((item) => {
              const id = faqId(item.question);
              return (
                <AccordionItem
                  key={id}
                  id={id}
                  value={id}
                  className="scroll-mt-28 px-0 not-last:border-b last:border-b-0"
                >
                  <AccordionTrigger className="rounded-none px-5 py-5 text-left text-lg">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-5 text-base text-muted-foreground">
                    <p>{item.answer}</p>
                    <CopyLink id={id} />
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </section>
      ))}

      {count === 0 && (
        <p className="rounded-2xl border border-dashed p-8 text-center text-muted-foreground">
          No questions match that search. Try another word, or ask us directly.
        </p>
      )}
    </div>
  );
}
