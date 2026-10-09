import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ProblemFormValues } from "@/validation/problem.validation";

interface ProblemDraftState {
  step: number;
  values: ProblemFormValues | null;
  setStep: (step: number) => void;
  setValues: (values: ProblemFormValues) => void;
  clear: () => void;
}

export const useProblemDraftStore = create<ProblemDraftState>()(
  persist(
    (set) => ({
      step: 0,
      values: null,
      setStep: (step) => set({ step }),
      setValues: (values) => set({ values }),
      clear: () => set({ step: 0, values: null }),
    }),
    {
      name: "devbench-problem-draft",
      storage: createJSONStorage(() => sessionStorage),
      skipHydration: true,
    },
  ),
);
