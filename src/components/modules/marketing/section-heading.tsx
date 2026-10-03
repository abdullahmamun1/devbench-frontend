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
    <div
      className={cn(
        "max-w-2xl space-y-3",
        align === "center" && "mx-auto text-center",
      )}
    >
      {eyebrow && (
        <p className="text-sm font-semibold tracking-wide text-primary uppercase">
          {eyebrow}
        </p>
      )}
      <h2 className="font-heading text-3xl font-bold tracking-tight text-balance sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="text-muted-foreground text-pretty">{description}</p>
      )}
    </div>
  );
}
