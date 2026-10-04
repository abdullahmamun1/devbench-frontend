import StatusBadge from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import type { EvaluationDetail } from "@/types";
import { formatDateTime } from "@/utils/format";

const PRE_CLASS =
  "overflow-x-auto whitespace-pre-wrap rounded-lg border bg-muted/40 p-3 font-mono text-xs";

export function SubmissionView({
  evaluation,
}: {
  evaluation: EvaluationDetail;
}) {
  const { submission } = evaluation;
  const { problem } = submission;

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-semibold">{problem.title}</h2>
          <StatusBadge status={problem.type} />
        </div>
        <p className="whitespace-pre-wrap text-sm">{problem.description}</p>
      </section>

      <section className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-medium">Candidate answer</h3>
          <span className="text-xs text-muted-foreground">
            Submitted {formatDateTime(submission.submittedAt)}
          </span>
        </div>

        {problem.type === "CODING" && (
          <>
            {submission.language && (
              <Badge variant="secondary">{submission.language}</Badge>
            )}
            {submission.code ? (
              <pre className={PRE_CLASS}>{submission.code}</pre>
            ) : (
              <p className="text-sm text-muted-foreground">
                No code was submitted.
              </p>
            )}
          </>
        )}

        {problem.type === "WRITTEN" &&
          (submission.answerText ? (
            <p className="whitespace-pre-wrap rounded-lg border bg-muted/40 p-3 text-sm">
              {submission.answerText}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              No answer was written.
            </p>
          ))}

        {problem.type === "MCQ" &&
          (submission.selectedOption ? (
            <p className="rounded-lg border bg-muted/40 p-3 text-sm">
              {submission.selectedOption.text}{" "}
              <span
                className={
                  submission.selectedOption.isCorrect
                    ? "text-emerald-600"
                    : "text-red-600"
                }
              >
                ({submission.selectedOption.isCorrect ? "correct" : "incorrect"}
                )
              </span>
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              No option was selected.
            </p>
          ))}
      </section>

      {problem.type === "CODING" && problem.testCases.length > 0 && (
        <section className="space-y-2">
          <div>
            <h3 className="font-medium">
              Test cases ({problem.testCases.length})
            </h3>
            <p className="text-xs text-muted-foreground">
              Code is not run automatically. Compare the answer with these cases
              yourself.
            </p>
          </div>
          <ul className="space-y-2">
            {problem.testCases.map((tc, i) => (
              <li key={tc.id} className="rounded-lg border p-3">
                <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Case {i + 1}</span>
                  <span className="flex items-center gap-2">
                    {tc.isHidden && <Badge variant="outline">Hidden</Badge>}
                    weight {tc.weight}
                  </span>
                </div>
                <div className="grid gap-2 md:grid-cols-2">
                  <div>
                    <p className="mb-1 text-xs font-medium">Input</p>
                    <pre className={PRE_CLASS}>{tc.input}</pre>
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-medium">Expected output</p>
                    <pre className={PRE_CLASS}>{tc.expectedOutput}</pre>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
