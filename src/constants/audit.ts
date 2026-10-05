export const AUDIT_ENTITY_TYPES = [
  "Assessment",
  "Attempt",
  "Company",
  "Invitation",
  "Payment",
  "Problem",
  "SubmissionResult",
  "TeamInvitation",
  "User",
] as const;

// "COMPANY_SUSPENDED" -> "Company suspended"
export function formatAction(action: string): string {
  const text = action.toLowerCase().replaceAll("_", " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export const shortId = (id: string) => id.slice(0, 8);
