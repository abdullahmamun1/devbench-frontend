import StatusBadge from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { AttemptProblem } from "@/types";
import type { Answer } from "@/utils/exam";
import CodeAnswer from "./code-answer";

interface QuestionPanelProps {
  item: AttemptProblem;
  index: number;
  total: number;
  answer: Answer | undefined;
  disabled: boolean;
  onChange: (patch: Answer) => void;
}

export default function QuestionPanel({
  item,
  index,
  total,
  answer,
  disabled,
  onChange,
}: QuestionPanelProps) {
  const { problem } = item;

  return (
    <Card>
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>
            Question {index + 1} of {total}
          </span>
          <StatusBadge status={problem.type} />
          <span className="ml-auto">
            {item.points} {item.points === 1 ? "point" : "points"}
          </span>
        </div>
        <h2 className="font-heading text-xl font-bold">{problem.title}</h2>
      </CardHeader>

      <CardContent className="space-y-6">
        <p className="whitespace-pre-wrap text-sm leading-relaxed">
          {problem.description}
        </p>

        {problem.type === "CODING" && problem.testCases.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Examples</h3>
            {problem.testCases.map((tc, i) => (
              <div key={tc.id} className="grid gap-2 sm:grid-cols-2">
                <div>
                  <p className="mb-1 text-xs text-muted-foreground">
                    Input {i + 1}
                  </p>
                  <pre className="overflow-x-auto rounded-lg bg-muted p-3 font-mono text-xs">
                    {tc.input}
                  </pre>
                </div>
                <div>
                  <p className="mb-1 text-xs text-muted-foreground">
                    Expected output
                  </p>
                  <pre className="overflow-x-auto rounded-lg bg-muted p-3 font-mono text-xs">
                    {tc.expectedOutput}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        )}

        {problem.type === "MCQ" && (
          <fieldset className="space-y-2" disabled={disabled}>
            <legend className="sr-only">Answer options</legend>
            {problem.mcqOptions.map((option) => {
              const selected = answer?.selectedOptionId === option.id;
              return (
                <label
                  key={option.id}
                  className={cn(
                    "flex w-full cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm transition-colors hover:bg-muted/50 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60",
                    selected && "border-primary bg-primary/5",
                  )}
                >
                  <input
                    type="radio"
                    name={`question-${item.problemId}`}
                    className="sr-only"
                    checked={selected}
                    onChange={() => onChange({ selectedOptionId: option.id })}
                  />
                  <span
                    aria-hidden="true"
                    className={cn(
                      "flex size-4 shrink-0 items-center justify-center rounded-full border",
                      selected && "border-primary",
                    )}
                  >
                    {selected && (
                      <span className="size-2 rounded-full bg-primary" />
                    )}
                  </span>
                  {option.text}
                </label>
              );
            })}
          </fieldset>
        )}

        {problem.type === "WRITTEN" && (
          <Textarea
            value={answer?.answerText ?? ""}
            onChange={(e) => onChange({ answerText: e.target.value })}
            disabled={disabled}
            maxLength={10000}
            placeholder="Write your answer here"
            aria-label="Written answer"
            className="min-h-48"
          />
        )}

        {problem.type === "CODING" && (
          <CodeAnswer
            value={answer?.code ?? ""}
            onChange={(code) => onChange({ code })}
            disabled={disabled}
          />
        )}
      </CardContent>
    </Card>
  );
}
