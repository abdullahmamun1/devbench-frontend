"use client";

import { CircleAlert, CircleCheck, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import ConfirmDialog from "@/components/shared/confirm-dialog";
import EmptyState from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAttempt,
  useCountdown,
  useMyAttempts,
  useSaveAnswer,
  useSubmitAttempt,
} from "@/hooks";
import type { AttemptDetail, AttemptProblem } from "@/types";
import { getErrorMessage, getErrorStatus } from "@/utils/error";
import {
  type Answer,
  type Answers,
  answersFromSubmissions,
  buildPayload,
  isAnswered,
} from "@/utils/exam";
import ExamNavigator from "./exam-navigator";
import ExamTimer from "./exam-timer";
import QuestionPanel from "./question-panel";

type SaveState = "idle" | "pending" | "saving" | "saved" | "error";

const TEXT_DEBOUNCE_MS = 800;

// Backend messages for an attempt that the server already closed.
const isClosedError = (error: unknown) => {
  if (getErrorStatus(error) !== 400) return false;
  const message = getErrorMessage(error, "").toLowerCase();
  return message.includes("expired") || message.includes("already");
};

function SaveIndicator({
  state,
  onRetry,
}: {
  state: SaveState;
  onRetry: () => void;
}) {
  if (state === "idle") return null;
  if (state === "error") {
    return (
      <span className="inline-flex items-center gap-2 text-sm text-destructive">
        <CircleAlert className="size-4" />
        Not saved
        <Button variant="outline" size="sm" onClick={onRetry}>
          Retry
        </Button>
      </span>
    );
  }
  if (state === "saved") {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
        <CircleCheck className="size-4 text-emerald-600" />
        Saved
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
      <LoaderCircle className="size-4 animate-spin" />
      {state === "pending" ? "Unsaved changes" : "Saving..."}
    </span>
  );
}

function ExamSession({
  detail,
  title,
}: {
  detail: AttemptDetail;
  title: string;
}) {
  const router = useRouter();
  const { problems } = detail;

  // Absolute deadline from the server's remaining time, fixed on entry.
  const [deadline] = useState(
    () => Date.now() + detail.remainingSeconds * 1000,
  );
  const [answers, setAnswers] = useState<Answers>(() =>
    answersFromSubmissions(detail.submissions),
  );
  const [current, setCurrent] = useState(0);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [finishing, setFinishing] = useState<"manual" | "expired" | null>(null);

  const saveAnswer = useSaveAnswer(detail.id);
  const submitAttempt = useSubmitAttempt(detail.id);
  const saveAsync = saveAnswer.mutateAsync;
  const submitAsync = submitAttempt.mutateAsync;

  const answersRef = useRef<Answers>(answers);
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  // Saves run one after another so an older answer can never overwrite a newer one.
  const chain = useRef<Promise<void>>(Promise.resolve());
  const finishedRef = useRef(false);
  const finishRef = useRef<(reason: "manual" | "expired") => Promise<void>>(
    async () => {},
  );

  const problemById = useMemo(
    () => new Map(problems.map((p) => [p.problemId, p])),
    [problems],
  );

  const persist = useCallback(
    (item: AttemptProblem) => {
      const payload = buildPayload(item, answersRef.current[item.problemId]);
      if (!payload) return;
      chain.current = chain.current.then(async () => {
        setSaveState("saving");
        try {
          await saveAsync(payload);
          setSaveState(timers.current.size === 0 ? "saved" : "pending");
        } catch (error) {
          setSaveState("error");
          if (isClosedError(error)) void finishRef.current("expired");
        }
      });
    },
    [saveAsync],
  );

  const flushPending = useCallback(() => {
    for (const [problemId, timer] of timers.current) {
      clearTimeout(timer);
      const item = problemById.get(problemId);
      if (item) persist(item);
    }
    timers.current.clear();
  }, [persist, problemById]);

  const finish = useCallback(
    async (reason: "manual" | "expired") => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      setConfirmOpen(false);
      setFinishing(reason);

      flushPending();
      await chain.current;

      try {
        await submitAsync();
        toast.success(
          reason === "manual"
            ? "Assessment submitted"
            : "Time is up. Your answers were submitted.",
        );
      } catch (error) {
        // The server may already have closed it (expiry), which is fine.
        if (!isClosedError(error)) {
          finishedRef.current = false;
          setFinishing(null);
          toast.error(getErrorMessage(error, "Could not submit. Try again."));
          return;
        }
      }
      router.replace(`/candidate/attempts/${detail.id}`);
    },
    [detail.id, flushPending, router, submitAsync],
  );

  useEffect(() => {
    finishRef.current = finish;
  }, [finish]);

  const secondsLeft = useCountdown(deadline, () => {
    void finishRef.current("expired");
  });

  // Gentle warnings, each shown once.
  const warned = useRef({ five: false, one: false });
  useEffect(() => {
    if (secondsLeft <= 60 && secondsLeft > 0 && !warned.current.one) {
      warned.current.one = true;
      warned.current.five = true;
      toast.warning("Less than 1 minute left");
    } else if (secondsLeft <= 300 && secondsLeft > 60 && !warned.current.five) {
      warned.current.five = true;
      toast.warning("Less than 5 minutes left");
    }
  }, [secondsLeft]);

  // Best effort: send anything still waiting when the runner unmounts.
  useEffect(() => {
    const pending = timers.current;
    return () => {
      for (const [problemId, timer] of pending) {
        clearTimeout(timer);
        const item = problemById.get(problemId);
        if (item) persist(item);
      }
      pending.clear();
    };
  }, [persist, problemById]);

  const handleChange = (item: AttemptProblem, patch: Answer) => {
    const next: Answers = {
      ...answersRef.current,
      [item.problemId]: { ...answersRef.current[item.problemId], ...patch },
    };
    answersRef.current = next;
    setAnswers(next);

    if (!buildPayload(item, next[item.problemId])) return;

    const existing = timers.current.get(item.problemId);
    if (existing) clearTimeout(existing);

    if (item.problem.type === "MCQ") {
      timers.current.delete(item.problemId);
      persist(item);
      return;
    }
    setSaveState("pending");
    timers.current.set(
      item.problemId,
      setTimeout(() => {
        timers.current.delete(item.problemId);
        persist(item);
      }, TEXT_DEBOUNCE_MS),
    );
  };

  const retryAll = () => {
    for (const item of problems) persist(item);
  };

  const answeredCount = problems.filter((p) =>
    isAnswered(p, answers[p.problemId]),
  ).length;
  const unanswered = problems.length - answeredCount;
  const item = problems[current];
  const locked = finishing !== null;

  // Warn before the tab is closed or reloaded while the exam is running.
  useEffect(() => {
    if (locked) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [locked]);

  // The browser back button would silently leave the exam, so hold the page.
  useEffect(() => {
    if (locked) return;
    window.history.pushState(null, "", window.location.href);
    const onPopState = () => {
      window.history.pushState(null, "", window.location.href);
      toast.info(
        "Use Submit to finish. Going back is disabled during the exam.",
      );
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [locked]);

  // Switching tabs or minimising can end in a closed tab, so send edits now.
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "hidden") flushPending();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [flushPending]);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 flex flex-wrap items-center gap-3 border-b bg-background px-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{title}</p>
          <p className="text-xs text-muted-foreground">
            {answeredCount} of {problems.length} answered
          </p>
        </div>
        <SaveIndicator state={saveState} onRetry={retryAll} />
        <ExamTimer secondsLeft={secondsLeft} />
        <Button onClick={() => setConfirmOpen(true)} disabled={locked}>
          Submit
        </Button>
      </header>

      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto grid w-full max-w-6xl flex-1 gap-6 p-4 outline-none lg:grid-cols-[220px_1fr]"
      >
        <ExamNavigator
          problems={problems}
          answers={answers}
          current={current}
          onSelect={setCurrent}
        />

        <div className="space-y-4">
          {item ? (
            <QuestionPanel
              item={item}
              index={current}
              total={problems.length}
              answer={answers[item.problemId]}
              disabled={locked}
              onChange={(patch) => handleChange(item, patch)}
            />
          ) : (
            <EmptyState
              title="This assessment has no questions"
              description="Contact the company that invited you."
            />
          )}

          <div className="flex justify-between">
            <Button
              variant="outline"
              disabled={current === 0 || locked}
              onClick={() => setCurrent((c) => c - 1)}
            >
              Previous
            </Button>
            {current < problems.length - 1 ? (
              <Button
                disabled={locked}
                onClick={() => setCurrent((c) => c + 1)}
              >
                Next
              </Button>
            ) : (
              <Button disabled={locked} onClick={() => setConfirmOpen(true)}>
                Review and submit
              </Button>
            )}
          </div>
        </div>
      </main>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Submit your assessment?"
        description={`${
          unanswered > 0
            ? `You have ${unanswered} unanswered question${unanswered === 1 ? "" : "s"}. `
            : ""
        }Once submitted you cannot change your answers.`}
        confirmLabel="Submit assessment"
        isPending={submitAttempt.isPending}
        onConfirm={() => void finish("manual")}
      />

      {finishing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3 rounded-2xl border bg-background p-8 text-center shadow-sm">
            <LoaderCircle className="size-8 animate-spin text-primary" />
            <p className="font-semibold">
              {finishing === "expired" ? "Time is up" : "Submitting"}
            </p>
            <p className="text-sm text-muted-foreground">
              Saving your answers. Please do not close this page.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function ExamSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-4 p-4">
      <Skeleton className="h-14 w-full" />
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    </div>
  );
}

export function ExamRunner({ id }: { id: string }) {
  const router = useRouter();
  const { data, isLoading, isError } = useAttempt(id, { live: true });
  const attempts = useMyAttempts().data?.data;

  const status = data?.data.status;
  const finished = status !== undefined && status !== "IN_PROGRESS";

  // Already submitted (or auto-submitted on entry): go to the results.
  useEffect(() => {
    if (finished) router.replace(`/candidate/attempts/${id}`);
  }, [finished, id, router]);

  if (isLoading || finished) return <ExamSkeleton />;

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-lg p-8">
        <EmptyState
          title="Could not open this attempt"
          description="It may not exist, or it belongs to another account."
          action={
            <Button
              nativeButton={false}
              render={<Link href="/candidate/attempts" />}
            >
              Back to attempts
            </Button>
          }
        />
      </div>
    );
  }

  const title =
    attempts?.find((a) => a.id === id)?.assessment.title ?? "Assessment";

  return <ExamSession key={data.data.id} detail={data.data} title={title} />;
}
