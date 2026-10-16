import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// Minimal browser chrome around a product screenshot
export default function BrowserFrame({
  url,
  children,
  className,
}: {
  url: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border bg-card shadow-2xl shadow-primary/10 ring-1 ring-foreground/5",
        className,
      )}
    >
      <div className="flex items-center gap-3 border-b bg-muted/60 px-4 py-2.5">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-destructive/60" />
          <span className="size-2.5 rounded-full bg-brand-3/80" />
          <span className="size-2.5 rounded-full bg-brand-2/70" />
        </div>
        <div className="mx-auto w-full max-w-sm min-w-0 truncate rounded-md bg-background/80 px-3 py-1 text-center font-mono text-xs text-muted-foreground">
          {url}
        </div>
        <span className="w-10" aria-hidden="true" />
      </div>
      {children}
    </div>
  );
}
