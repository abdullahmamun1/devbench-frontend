import type { Metadata } from "next";
import { CreateProblemForm } from "@/components/modules/problems/create-problem-form";

export const metadata: Metadata = { title: "New problem" };

export default function NewProblemPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">New problem</h1>
        <p className="text-sm text-muted-foreground">
          Add a question to your problem bank in three steps.
        </p>
      </div>
      <CreateProblemForm />
    </div>
  );
}
