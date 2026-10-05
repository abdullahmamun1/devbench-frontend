import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatClock } from "@/utils/exam";

export default function ExamTimer({ secondsLeft }: { secondsLeft: number }) {
  const low = secondsLeft <= 300;
  return (
    <div
      role="timer"
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-sm font-semibold tabular-nums",
        low
          ? "border-destructive/40 bg-destructive/10 text-destructive"
          : "bg-muted/50",
      )}
    >
      <Clock className="size-4" />
      {formatClock(secondsLeft)}
    </div>
  );
}
