import type { MyAttempt, MyInvitation } from "@/types";

export type InvitationAction =
  | "start"
  | "continue"
  | "view"
  | "check-email"
  | "none";

export interface InvitationRow {
  invitation: MyInvitation;
  attempt?: MyAttempt;
  // Drives both the badge and the filter tabs.
  displayStatus: string;
  action: InvitationAction;
}

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

// Combines each invitation with the candidate's attempt for the same
// assessment (the backend allows one attempt per assessment).
export function buildInvitationRows(
  invitations: MyInvitation[],
  attempts: MyAttempt[],
): InvitationRow[] {
  const byAssessment = new Map(attempts.map((a) => [a.assessment.id, a]));

  return invitations.map((invitation) => {
    const attempt = byAssessment.get(invitation.assessment.id);

    if (attempt) {
      // An IN_PROGRESS attempt past its deadline is finalised by the backend
      // the next time it is opened, so it is shown as submitted.
      return isLiveAttempt(attempt)
        ? {
            invitation,
            attempt,
            displayStatus: "IN_PROGRESS",
            action: "continue",
          }
        : { invitation, attempt, displayStatus: "SUBMITTED", action: "view" };
    }

    if (invitation.status === "REVOKED") {
      return { invitation, displayStatus: "REVOKED", action: "none" };
    }
    if (invitation.status === "EXPIRED") {
      return { invitation, displayStatus: "EXPIRED", action: "none" };
    }
    if (invitation.status === "PENDING") {
      const expired = new Date(invitation.expiresAt).getTime() <= Date.now();
      return expired
        ? { invitation, displayStatus: "EXPIRED", action: "none" }
        : { invitation, displayStatus: "PENDING", action: "check-email" };
    }

    // ACCEPTED and not attempted yet
    if (invitation.assessment.status !== "PUBLISHED") {
      return { invitation, displayStatus: "CLOSED", action: "none" };
    }
    return { invitation, displayStatus: "ACCEPTED", action: "start" };
  });
}
