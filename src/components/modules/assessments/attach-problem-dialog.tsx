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
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAttachProblem, useDebounce, useProblems } from "@/hooks";
import { cn } from "@/lib/utils";
import type { Problem } from "@/types";

interface AttachProblemDialogProps {
  assessmentId: string;
  attachedIds: Set<string>;
  nextOrder: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AttachProblemDialog({
  assessmentId,
  attachedIds,
  nextOrder,
  open,
  onOpenChange,
}: AttachProblemDialogProps) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Problem | null>(null);
  const [points, setPoints] = useState(10);
  const debounced = useDebounce(search, 300);

  const { data, isLoading } = useProblems({
    page: 1,
    limit: 20,
    search: debounced.trim() || undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const { mutate, isPending } = useAttachProblem(assessmentId);

  const available = (data?.data ?? []).filter((p) => !attachedIds.has(p.id));

  const close = (next: boolean) => {
    if (!next) {
      setSearch("");
      setSelected(null);
    }
    onOpenChange(next);
  };

  const choose = (p: Problem) => {
    setSelected(p);
    setPoints(p.points);
  };

  const handleAdd = () => {
    if (!selected || points < 1) return;
    mutate(
      { problemId: selected.id, order: nextOrder, points },
      { onSuccess: () => close(false) },
    );
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Add a problem</DialogTitle>
          <DialogDescription>
            Pick a problem from your bank. You can give it different points
            inside this assessment.
          </DialogDescription>
        </DialogHeader>

        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search problems..."
          aria-label="Search problems"
        />

        <div className="max-h-72 space-y-2 overflow-y-auto">
          {isLoading &&
            ["a", "b", "c"].map((k) => (
              <Skeleton key={k} className="h-14 w-full" />
            ))}

          {!isLoading && available.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No problems available. Create one in the problem bank, or clear
              the search.
            </p>
          )}

          {available.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => choose(p)}
              className={cn(
                "flex w-full items-center justify-between gap-3 rounded-lg border p-3 text-left transition-colors",
                selected?.id === p.id
                  ? "border-primary bg-primary/5"
                  : "hover:bg-muted",
              )}
            >
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium">
                  {p.title}
                </span>
                <span className="text-xs text-muted-foreground">
                  {p.points} points by default
                </span>
              </span>
              <StatusBadge status={p.type} />
            </button>
          ))}
        </div>

        {selected && (
          <Field className="max-w-40">
            <FieldLabel htmlFor="attach-points">
              Points in this assessment
            </FieldLabel>
            <Input
              id="attach-points"
              type="number"
              min={1}
              value={points}
              onChange={(e) => setPoints(Number(e.target.value))}
            />
          </Field>
        )}

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
            disabled={!selected || points < 1 || isPending}
          >
            {isPending ? "Adding..." : "Add problem"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
