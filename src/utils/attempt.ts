import type { MyAttempt, MyInvitation } from "@/types";

// A submitted attempt with no score still has answers waiting for an evaluator.
export function isAwaitingReview(
  attempt: Pick<MyAttempt, "status" | "totalScore">,
) {
  return attempt.status === "SUBMITTED" && attempt.totalScore === null;
}

// The backend only finalises an expired attempt when it is next touched,
// so a past expiresAt on an IN_PROGRESS attempt means it is effectively over.
export function isLiveAttempt(
  attempt: Pick<MyAttempt, "status" | "expiresAt">,
) {
  if (attempt.status !== "IN_PROGRESS") return false;
  return (
    !attempt.expiresAt || new Date(attempt.expiresAt).getTime() > Date.now()
  );
}

// An invitation the candidate can still act on: accept it, or start the exam.
export function isOpenInvitation(
  invitation: MyInvitation,
  attemptedAssessmentIds: Set<string>,
) {
  if (invitation.assessment.status !== "PUBLISHED") return false;
  if (attemptedAssessmentIds.has(invitation.assessment.id)) return false;
  if (invitation.status === "ACCEPTED") return true;
  return (
    invitation.status === "PENDING" &&
    new Date(invitation.expiresAt).getTime() > Date.now()
  );
}
