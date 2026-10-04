"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useDeleteProblem } from "@/hooks";
import type { Problem } from "@/types";

interface DeleteProblemDialogProps {
  problem: Problem | null;
  onClose: () => void;
  onDeleted?: () => void;
}

export function DeleteProblemDialog({
  problem,
  onClose,
  onDeleted,
}: DeleteProblemDialogProps) {
  const { mutate, isPending } = useDeleteProblem();

  const handleDelete = () => {
    if (!problem) return;
    mutate(problem.id, {
      onSuccess: () => {
        onClose();
        onDeleted?.();
      },
    });
  };

  return (
    <AlertDialog
      open={Boolean(problem)}
      onOpenChange={(open) => {
        if (!open && !isPending) onClose();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this problem?</AlertDialogTitle>
          <AlertDialogDescription>
            "{problem?.title}" will be removed from your problem bank.
            Assessments that already use it keep working.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
