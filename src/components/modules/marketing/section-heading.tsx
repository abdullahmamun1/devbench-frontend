import Reveal from "@/components/shared/reveal";
import { cn } from "@/lib/utils";

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}) {
  return (
    <Reveal
      className={cn(
        "max-w-2xl space-y-4",
        align === "center" && "mx-auto text-center",
      )}
    >
      {eyebrow && (
        <p className="text-sm font-semibold tracking-wide text-primary uppercase">
          {eyebrow}
        </p>
      )}
      <h2 className="text-h2 font-bold">{title}</h2>
      {description && (
        <p className="text-lg text-muted-foreground text-pretty">
          {description}
        </p>
      )}
    </Reveal>
  );
}
