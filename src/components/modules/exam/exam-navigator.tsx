import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { AttemptProblem } from "@/types";
import { type Answers, isAnswered } from "@/utils/exam";

interface ExamNavigatorProps {
  problems: AttemptProblem[];
  answers: Answers;
  current: number;
  onSelect: (index: number) => void;
}

export default function ExamNavigator({
  problems,
  answers,
  current,
  onSelect,
}: ExamNavigatorProps) {
  return (
    <Card className="h-fit lg:sticky lg:top-24">
      <CardHeader>
        <CardTitle className="text-base">Questions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-8 lg:grid-cols-4">
          {problems.map((item, index) => {
            const answered = isAnswered(item, answers[item.problemId]);
            const active = index === current;
            return (
              <button
                key={item.problemId}
                type="button"
                onClick={() => onSelect(index)}
                aria-label={`Question ${index + 1}${answered ? ", answered" : ""}`}
                aria-current={active ? "step" : undefined}
                className={cn(
                  "flex size-10 items-center justify-center rounded-lg border text-sm font-medium transition-colors",
                  answered && "border-primary/40 bg-primary/10 text-primary",
                  active && "ring-2 ring-primary",
                )}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
        <div className="flex gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="size-3 rounded border border-primary/40 bg-primary/10" />
            Answered
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-3 rounded border" />
            Not answered
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
