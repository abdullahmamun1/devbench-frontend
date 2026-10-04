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
import { useDeleteAssessment } from "@/hooks";
import type { Assessment } from "@/types";

interface DeleteAssessmentDialogProps {
  assessment: Assessment | null;
  onClose: () => void;
  onDeleted?: () => void;
}

export function DeleteAssessmentDialog({
  assessment,
  onClose,
  onDeleted,
}: DeleteAssessmentDialogProps) {
  const { mutate, isPending } = useDeleteAssessment();

  const handleDelete = () => {
    if (!assessment) return;
    mutate(assessment.id, {
      onSuccess: () => {
        onClose();
        onDeleted?.();
      },
    });
  };

  return (
    <AlertDialog
      open={Boolean(assessment)}
      onOpenChange={(open) => {
        if (!open && !isPending) onClose();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this assessment?</AlertDialogTitle>
          <AlertDialogDescription>
            "{assessment?.title}" will be removed. This cannot be undone.
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
