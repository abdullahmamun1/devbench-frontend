"use client";

import { useCallback, useEffect, useRef } from "react";
import { type AttemptEventInput, recordAttemptEvents } from "@/api";

const FLUSH_EVERY_MS = 5000;
const MAX_BATCH = 50; // the API accepts at most 50 events per request

// Records exam-integrity signals for an attempt: tab switches, pastes and
// which question is open. Events are queued and sent in small batches. They
// are signals for evaluators only, never used for scoring, and a failed send
// is dropped silently so it can never interrupt the exam.
export function useAttemptSignals(
  attemptId: string,
  currentProblemId: string | undefined,
  active: boolean,
) {
  const queue = useRef<AttemptEventInput[]>([]);
  const currentRef = useRef(currentProblemId);

  const push = useCallback((event: Omit<AttemptEventInput, "occurredAt">) => {
    queue.current.push({ ...event, occurredAt: new Date().toISOString() });
  }, []);

  const flush = useCallback(
    async (keepalive = false) => {
      while (queue.current.length > 0) {
        const batch = queue.current.splice(0, MAX_BATCH);
        try {
          await recordAttemptEvents(attemptId, batch, keepalive);
        } catch {
          // Signals are best effort
          return;
        }
      }
    },
    [attemptId],
  );

  // Which question is on screen (also kept for attributing pastes)
  useEffect(() => {
    currentRef.current = currentProblemId;
    if (active && currentProblemId) {
      push({ type: "QUESTION_VIEWED", problemId: currentProblemId });
    }
  }, [active, currentProblemId, push]);

  useEffect(() => {
    if (!active) return;

    const onVisibility = () => {
      push({ type: document.hidden ? "TAB_HIDDEN" : "TAB_VISIBLE" });
      // The tab may be about to close: send what we have now
      if (document.hidden) void flush(true);
    };
    const onBlur = () => push({ type: "TAB_HIDDEN" });
    const onFocus = () => push({ type: "TAB_VISIBLE" });
    // One listener covers the code editor and the written answer box alike
    const onPaste = (e: ClipboardEvent) => {
      const chars = e.clipboardData?.getData("text").length ?? 0;
      if (chars > 0) {
        push({ type: "PASTE", problemId: currentRef.current, chars });
      }
    };
    const onPageHide = () => void flush(true);

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);
    document.addEventListener("paste", onPaste, true);
    window.addEventListener("pagehide", onPageHide);
    const timer = setInterval(() => void flush(), FLUSH_EVERY_MS);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("paste", onPaste, true);
      window.removeEventListener("pagehide", onPageHide);
      clearInterval(timer);
    };
  }, [active, flush, push]);

  return { flush };
}
