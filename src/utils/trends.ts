const SHORT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  timeZone: "UTC",
});
const LONG = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

// "2026-05" -> "May", or "May 2026" when full is true
export function monthLabel(month: string, full = false): string {
  const [year = "1970", mon = "1"] = month.split("-");
  const date = new Date(Date.UTC(Number(year), Number(mon) - 1, 1));
  return (full ? LONG : SHORT).format(date);
}
