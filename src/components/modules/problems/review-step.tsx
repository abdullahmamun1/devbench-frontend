import StatusBadge from "@/components/shared/status-badge";
import type { ProblemFormValues } from "@/validation/problem.validation";

export function ReviewStep({ values }: { values: ProblemFormValues }) {
  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">{values.title}</h3>
          <StatusBadge status={values.type} />
        </div>
        <p className="text-sm text-muted-foreground">{values.points} points</p>
      </div>

      <p className="whitespace-pre-wrap text-sm">{values.description}</p>

      {values.type === "CODING" && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">
            Test cases ({values.testCases.length})
          </h4>
          <ul className="space-y-2">
            {values.testCases.map((tc, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static review list
              <li key={i} className="rounded-lg border p-3 text-sm">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Case {i + 1}</span>
                  <span>
                    {tc.isHidden ? "Hidden" : "Visible"} · weight {tc.weight}
                  </span>
                </div>
                <pre className="mt-1 whitespace-pre-wrap font-mono text-xs">
                  {tc.input}
                  {"\n→ "}
                  {tc.expectedOutput}
                </pre>
              </li>
            ))}
          </ul>
        </div>
      )}

      {values.type === "MCQ" && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Options</h4>
          <ul className="space-y-1.5">
            {values.mcqOptions.map((o, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static review list
              <li key={i} className="flex items-center gap-2 text-sm">
                <span
                  className={
                    o.isCorrect ? "font-medium text-emerald-600" : undefined
                  }
                >
                  {String.fromCharCode(65 + i)}. {o.text}
                </span>
                {o.isCorrect && (
                  <span className="text-xs text-emerald-600">(correct)</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {values.type === "WRITTEN" && (
        <p className="text-sm text-muted-foreground">
          Candidates answer in free text. An evaluator reviews it manually.
        </p>
      )}
    </div>
  );
}
