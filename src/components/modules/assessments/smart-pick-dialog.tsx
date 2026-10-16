"use client";

import { Gauge, Info, Timer, Wand2 } from "lucide-react";
import { useState } from "react";
import ErrorState from "@/components/shared/error-state";
import StatusBadge from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useAttachProblems, useDebounce, useProblemSuggestions } from "@/hooks";
import { cn } from "@/lib/utils";
import type {
  DifficultyPreference,
  ProblemSuggestion,
  ProblemSuggestionParams,
  ProblemType,
} from "@/types";
import { getErrorMessage } from "@/utils/error";

type Mix = Pick<ProblemSuggestionParams, "coding" | "mcq" | "written">;

const PRESETS: { label: string; mix: Mix }[] = [
  { label: "Balanced", mix: { coding: 50, mcq: 30, written: 20 } },
  { label: "Coding focus", mix: { coding: 75, mcq: 10, written: 15 } },
  { label: "Quick screen", mix: { coding: 0, mcq: 70, written: 30 } },
  { label: "Written focus", mix: { coding: 20, mcq: 20, written: 60 } },
];

const MIX_FIELDS: { key: keyof Mix; type: ProblemType; label: string }[] = [
  { key: "coding", type: "CODING", label: "Coding" },
  { key: "mcq", type: "MCQ", label: "MCQ" },
  { key: "written", type: "WRITTEN", label: "Written" },
];

// Same colours as the problem type badges
const TYPE_BAR: Record<ProblemType, string> = {
  CODING: "bg-primary",
  MCQ: "bg-brand-3",
  WRITTEN: "bg-brand-2",
};

const DIFFICULTIES: { value: DifficultyPreference; label: string }[] = [
  { value: "easier", label: "Easier" },
  { value: "balanced", label: "Balanced" },
  { value: "harder", label: "Harder" },
];

// Native spinners sit on top of the unit suffix. Arrow keys still step.
const NO_SPINNER =
  "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

const sameMix = (a: Mix, b: Mix) =>
  a.coding === b.coding && a.mcq === b.mcq && a.written === b.written;

const isShare = (n: number) => Number.isInteger(n) && n >= 0 && n <= 100;

interface SmartPickDialogProps {
  assessmentId: string;
  durationMinutes: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SmartPickDialog({
  assessmentId,
  durationMinutes,
  open,
  onOpenChange,
}: SmartPickDialogProps) {
  const [minutes, setMinutes] = useState(durationMinutes);
  const [mix, setMix] = useState<Mix>(PRESETS[0].mix);
  const [difficulty, setDifficulty] =
    useState<DifficultyPreference>("balanced");
  // Picks the user unticked. Kept by id, so they stay unticked if the plan
  // is rebuilt with the same problem in it.
  const [excluded, setExcluded] = useState<Set<string>>(new Set());

  const minutesValid =
    Number.isInteger(minutes) && minutes >= 5 && minutes <= 600;
  const mixValid =
    MIX_FIELDS.every((f) => isShare(mix[f.key])) &&
    mix.coding + mix.mcq + mix.written > 0;
  const params = useDebounce<ProblemSuggestionParams>(
    { minutes, ...mix, difficulty },
    300,
  );

  const { data, isLoading, isFetching, isError, error, refetch } =
    useProblemSuggestions(
      assessmentId,
      params,
      open && minutesValid && mixValid,
    );
  const { mutate: attach, isPending } = useAttachProblems(assessmentId);

  const picks = data?.picks ?? [];
  const chosen = picks.filter((p) => !excluded.has(p.problemId));
  const chosenMinutes = chosen.reduce((sum, p) => sum + p.minutes, 0);
  const chosenPoints = chosen.reduce((sum, p) => sum + p.points, 0);

  const close = (next: boolean) => {
    if (!next) {
      setMinutes(durationMinutes);
      setMix(PRESETS[0].mix);
      setDifficulty("balanced");
      setExcluded(new Set());
    }
    onOpenChange(next);
  };

  const toggle = (id: string) =>
    setExcluded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const handleAdd = () => {
    if (chosen.length === 0) return;
    attach(
      {
        problems: chosen.map((p) => ({
          problemId: p.problemId,
          points: p.points,
        })),
      },
      { onSuccess: () => close(false) },
    );
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="max-h-[92dvh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="size-5 text-primary" aria-hidden="true" />
            Smart pick
          </DialogTitle>
          <DialogDescription>
            Fills the time left with problems from your bank. Times come from
            how long candidates actually took, and difficulty from their graded
            answers. Review the list, untick anything you don&apos;t want, then
            add.
          </DialogDescription>
        </DialogHeader>

        {/* Settings */}
        <div className="grid gap-5 rounded-2xl border bg-muted/30 p-4 sm:grid-cols-[9rem_1fr]">
          <div className="space-y-1.5">
            <Label htmlFor="smart-minutes">Duration</Label>
            <div className="relative">
              <Input
                id="smart-minutes"
                type="number"
                min={5}
                max={600}
                step={5}
                value={Number.isNaN(minutes) ? "" : minutes}
                onChange={(e) => setMinutes(Number(e.target.value))}
                aria-invalid={!minutesValid}
                aria-describedby="smart-minutes-hint"
                className={cn(NO_SPINNER, "pr-12")}
              />
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
                min
              </span>
            </div>
            <p
              id="smart-minutes-hint"
              className={cn(
                "text-xs",
                minutesValid ? "text-muted-foreground" : "text-destructive",
              )}
            >
              {minutesValid ? "Defaults to the timer" : "Between 5 and 600"}
            </p>
          </div>

          <div className="space-y-3">
            <div
              role="group"
              aria-label="Mix presets"
              className="flex flex-wrap gap-2"
            >
              {PRESETS.map((preset) => {
                const active = sameMix(preset.mix, mix);
                return (
                  <button
                    key={preset.label}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setMix(preset.mix)}
                    className={cn(
                      "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "bg-card text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            <fieldset className="grid grid-cols-3 gap-3">
              <legend className="sr-only">Share of the time per type</legend>
              {MIX_FIELDS.map((field) => (
                <div key={field.key} className="space-y-1">
                  <Label
                    htmlFor={`smart-${field.key}`}
                    className="flex items-center gap-1.5 text-sm"
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "size-2 rounded-full",
                        TYPE_BAR[field.type],
                      )}
                    />
                    {field.label}
                  </Label>
                  <div className="relative">
                    <Input
                      id={`smart-${field.key}`}
                      type="number"
                      min={0}
                      max={100}
                      step={5}
                      value={Number.isNaN(mix[field.key]) ? "" : mix[field.key]}
                      onChange={(e) =>
                        setMix((m) => ({
                          ...m,
                          [field.key]: Number(e.target.value),
                        }))
                      }
                      aria-invalid={!isShare(mix[field.key])}
                      className={cn(NO_SPINNER, "pr-8")}
                    />
                    <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
                      %
                    </span>
                  </div>
                </div>
              ))}
            </fieldset>
            {!mixValid && (
              <p className="text-xs text-destructive">
                Use whole numbers from 0 to 100, with at least one above 0.
              </p>
            )}
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <p id="smart-difficulty" className="text-sm font-medium">
              Difficulty
            </p>
            <div
              role="group"
              aria-labelledby="smart-difficulty"
              className="inline-flex rounded-full border bg-card p-1"
            >
              {DIFFICULTIES.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  aria-pressed={difficulty === d.value}
                  onClick={() => setDifficulty(d.value)}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                    difficulty === d.value
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Plan */}
        {isError && !data ? (
          <ErrorState
            title="Couldn't build a plan"
            description={getErrorMessage(error, "Please try again.")}
            onRetry={() => refetch()}
          />
        ) : isLoading || !data ? (
          <div className="space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        ) : (
          <div
            className={cn(
              "space-y-4 transition-opacity",
              isFetching && "opacity-60",
            )}
            aria-busy={isFetching}
          >
            <TimeBar
              total={data.targetMinutes}
              attached={data.attachedMinutes}
              buffer={data.bufferMinutes}
              picks={chosen}
            />

            {data.notes.length > 0 && (
              <ul className="space-y-2">
                {data.notes.map((note) => (
                  <li
                    key={note}
                    className="flex items-start gap-2 rounded-lg bg-brand-3/20 px-3 py-2 text-sm text-brand-3-foreground dark:bg-brand-3/12 dark:text-brand-3"
                  >
                    <Info
                      className="mt-0.5 size-4 shrink-0"
                      aria-hidden="true"
                    />
                    {note}
                  </li>
                ))}
              </ul>
            )}

            {picks.length > 0 && (
              <ul className="divide-y rounded-2xl border bg-card">
                {picks.map((pick) => (
                  <PickRow
                    key={pick.problemId}
                    pick={pick}
                    checked={!excluded.has(pick.problemId)}
                    onToggle={() => toggle(pick.problemId)}
                  />
                ))}
              </ul>
            )}
          </div>
        )}

        <DialogFooter className="gap-2 sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {chosen.length > 0
              ? `${chosen.length} problems · about ${chosenMinutes} min · ${chosenPoints} points`
              : "Nothing selected"}
          </p>
          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="outline" onClick={() => close(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              disabled={chosen.length === 0 || isPending || isFetching}
            >
              {isPending
                ? "Adding..."
                : `Add ${chosen.length} ${chosen.length === 1 ? "problem" : "problems"}`}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Where the time goes: already attached, the new picks by type, the buffer
function TimeBar({
  total,
  attached,
  buffer,
  picks,
}: {
  total: number;
  attached: number;
  buffer: number;
  picks: ProblemSuggestion[];
}) {
  const byType = MIX_FIELDS.map((f) => ({
    ...f,
    minutes: picks
      .filter((p) => p.type === f.type)
      .reduce((sum, p) => sum + p.minutes, 0),
  }));
  const planned = attached + byType.reduce((sum, t) => sum + t.minutes, 0);
  const scale = Math.max(total, planned + buffer, 1);
  const width = (m: number) => `${(m / scale) * 100}%`;
  const free = Math.max(0, total - buffer - planned);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="flex items-center gap-1.5 font-medium">
          <Timer className="size-4 text-primary" aria-hidden="true" />
          About {planned} of {total} minutes planned
        </p>
        <p className="text-sm text-muted-foreground">
          {buffer} min left for reading and checking
          {free > 0 ? ` · ${free} min unfilled` : ""}
        </p>
      </div>
      <div
        className="flex h-3 overflow-hidden rounded-full bg-muted"
        role="img"
        aria-label={`${attached} minutes already attached, ${byType
          .map((t) => `${t.minutes} minutes of ${t.label}`)
          .join(", ")}, ${buffer} minutes of buffer`}
      >
        {attached > 0 && (
          <span
            className="bg-foreground/25"
            style={{ width: width(attached) }}
          />
        )}
        {byType.map((t) =>
          t.minutes > 0 ? (
            <span
              key={t.key}
              className={cn(TYPE_BAR[t.type], "transition-[width]")}
              style={{ width: width(t.minutes) }}
            />
          ) : null,
        )}
      </div>
      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
        {attached > 0 && (
          <li className="flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="size-2 rounded-full bg-foreground/25"
            />
            Already attached {attached} min
          </li>
        )}
        {byType.map((t) => (
          <li key={t.key} className="flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className={cn("size-2 rounded-full", TYPE_BAR[t.type])}
            />
            {t.label} {t.minutes} min
          </li>
        ))}
      </ul>
    </div>
  );
}

function PickRow({
  pick,
  checked,
  onToggle,
}: {
  pick: ProblemSuggestion;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <li>
      <label
        className={cn(
          "flex cursor-pointer items-start gap-3 p-4 transition-colors hover:bg-primary/4",
          !checked && "opacity-60",
        )}
      >
        <input
          type="checkbox"
          className="mt-1 size-4 shrink-0 accent-primary"
          checked={checked}
          onChange={onToggle}
        />
        <span className="min-w-0 flex-1 space-y-1.5">
          <span className="flex flex-wrap items-center gap-2">
            <span className="font-semibold">{pick.title}</span>
            <StatusBadge status={pick.type} />
            {pick.difficulty ? (
              <StatusBadge status={pick.difficulty.toUpperCase()} />
            ) : (
              <span className="text-xs text-muted-foreground">Unrated</span>
            )}
          </span>
          <span className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            <span className="flex items-center gap-1.5">
              <Timer
                className="size-4 text-muted-foreground"
                aria-hidden="true"
              />
              {pick.minutes} min
              <span className="text-muted-foreground">
                {pick.minutesSource === "observed"
                  ? `measured from ${pick.timeSamples}`
                  : "estimated"}
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <Gauge
                className="size-4 text-muted-foreground"
                aria-hidden="true"
              />
              {pick.points} points
            </span>
          </span>
          <span className="block text-sm text-muted-foreground">
            {pick.reason}
          </span>
        </span>
      </label>
    </li>
  );
}
