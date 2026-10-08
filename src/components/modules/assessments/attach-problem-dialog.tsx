"use client";

import { useState } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useAttachProblems, useDebounce, useProblems } from "@/hooks";
import { cn } from "@/lib/utils";

interface AttachProblemDialogProps {
  assessmentId: string;
  attachedIds: Set<string>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const isValidPoints = (points: number) =>
  Number.isInteger(points) && points >= 1;

export function AttachProblemDialog({
  assessmentId,
  attachedIds,
  open,
  onOpenChange,
}: AttachProblemDialogProps) {
  const [search, setSearch] = useState("");
  // problemId -> points. A Map keeps the order the problems were ticked in.
  const [selected, setSelected] = useState<Map<string, number>>(new Map());
  const debounced = useDebounce(search, 300);

  const { data, isLoading } = useProblems({
    page: 1,
    limit: 20,
    search: debounced.trim() || undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const { mutate, isPending } = useAttachProblems(assessmentId);

  const available = (data?.data ?? []).filter((p) => !attachedIds.has(p.id));
  const allShownSelected =
    available.length > 0 && available.every((p) => selected.has(p.id));

  const totalPoints = [...selected.values()].reduce(
    (sum, points) => sum + (isValidPoints(points) ? points : 0),
    0,
  );
  const hasInvalidPoints = [...selected.values()].some(
    (points) => !isValidPoints(points),
  );

  const close = (next: boolean) => {
    if (!next) {
      setSearch("");
      setSelected(new Map());
    }
    onOpenChange(next);
  };

  const toggle = (id: string, defaultPoints: number) => {
    setSelected((prev) => {
      const next = new Map(prev);
      if (next.has(id)) next.delete(id);
      else next.set(id, defaultPoints);
      return next;
    });
  };

  const toggleAllShown = () => {
    setSelected((prev) => {
      const next = new Map(prev);
      if (allShownSelected) {
        for (const p of available) next.delete(p.id);
      } else {
        for (const p of available) if (!next.has(p.id)) next.set(p.id, p.points);
      }
      return next;
    });
  };

  const setPoints = (id: string, points: number) =>
    setSelected((prev) => new Map(prev).set(id, points));

  const handleAdd = () => {
    if (selected.size === 0 || hasInvalidPoints) return;
    mutate(
      {
        problems: [...selected].map(([problemId, points]) => ({
          problemId,
          points,
        })),
      },
      { onSuccess: () => close(false) },
    );
  };

  const count = selected.size;

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Add problems</DialogTitle>
          <DialogDescription>
            Tick one or more problems from your bank. You can give each one
            different points inside this assessment.
          </DialogDescription>
        </DialogHeader>

        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search problems..."
          aria-label="Search problems"
        />

        {available.length > 0 && (
          <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              className="size-4 accent-primary"
              checked={allShownSelected}
              onChange={toggleAllShown}
            />
            Select all shown ({available.length})
          </label>
        )}

        <ul className="max-h-72 space-y-2 overflow-y-auto">
          {isLoading &&
            ["a", "b", "c"].map((k) => (
              <li key={k}>
                <Skeleton className="h-14 w-full" />
              </li>
            ))}

          {!isLoading && available.length === 0 && (
            <li className="py-6 text-center text-sm text-muted-foreground">
              No problems available. Create one in the problem bank, or clear
              the search.
            </li>
          )}

          {available.map((p) => {
            const checked = selected.has(p.id);
            const points = selected.get(p.id) ?? p.points;

            return (
              <li
                key={p.id}
                className={cn(
                  "flex items-center gap-3 rounded-lg border p-3 transition-colors",
                  checked ? "border-primary bg-primary/5" : "hover:bg-muted",
                )}
              >
                <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    className="size-4 shrink-0 accent-primary"
                    checked={checked}
                    onChange={() => toggle(p.id, p.points)}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">
                      {p.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {p.points} points by default
                    </span>
                  </span>
                  <StatusBadge status={p.type} />
                </label>

                {checked && (
                  <Input
                    type="number"
                    min={1}
                    step={1}
                    value={Number.isNaN(points) ? "" : points}
                    onChange={(e) => setPoints(p.id, Number(e.target.value))}
                    aria-label={`Points for ${p.title}`}
                    aria-invalid={!isValidPoints(points)}
                    className="h-8 w-20 shrink-0"
                  />
                )}
              </li>
            );
          })}
        </ul>

        <p className="text-sm text-muted-foreground" aria-live="polite">
          {count === 0
            ? "No problems selected"
            : `${count} selected, ${totalPoints} points in total`}
        </p>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => close(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAdd}
            disabled={count === 0 || hasInvalidPoints || isPending}
          >
            {isPending
              ? "Adding..."
              : count > 1
                ? `Add ${count} problems`
                : "Add problem"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}