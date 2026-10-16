import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

// Mirrors `strongPassword` in validation/auth.validation.ts, rule for rule
export const PASSWORD_RULES = [
  { label: "8 or more characters", test: (v: string) => v.length >= 8 },
  { label: "An uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
  { label: "A lowercase letter", test: (v: string) => /[a-z]/.test(v) },
  { label: "A number", test: (v: string) => /[0-9]/.test(v) },
  { label: "A symbol", test: (v: string) => /[^A-Za-z0-9]/.test(v) },
] as const;

export default function PasswordChecklist({
  value,
  id,
}: {
  value: string;
  id?: string;
}) {
  const met = PASSWORD_RULES.filter((rule) => rule.test(value)).length;

  return (
    <div id={id} className="space-y-2">
      {/* Strength bar: one segment per rule */}
      <div className="flex gap-1" aria-hidden="true">
        {PASSWORD_RULES.map((rule, i) => (
          <span
            key={rule.label}
            className={cn(
              "h-1 flex-1 rounded-full bg-muted transition-colors duration-300",
              i < met &&
                (met === PASSWORD_RULES.length ? "bg-brand-2" : "bg-primary"),
            )}
          />
        ))}
      </div>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm sm:grid-cols-3">
        {PASSWORD_RULES.map((rule) => {
          const ok = rule.test(value);
          return (
            <li
              key={rule.label}
              className={cn(
                "flex items-center gap-1.5 transition-colors",
                ok ? "text-brand-2" : "text-muted-foreground",
              )}
            >
              {ok ? (
                <Check className="size-3.5 shrink-0" aria-hidden="true" />
              ) : (
                <X className="size-3.5 shrink-0" aria-hidden="true" />
              )}
              <span>
                {rule.label}
                <span className="sr-only">{ok ? " (done)" : " (missing)"}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
