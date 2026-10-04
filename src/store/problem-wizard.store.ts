import { create } from "zustand";

interface ProblemWizardState {
  step: number;
  setStep: (step: number) => void;
  reset: () => void;
}

export const useProblemWizardStore = create<ProblemWizardState>((set) => ({
  step: 0,
  setStep: (step) => set({ step }),
  reset: () => set({ step: 0 }),
}));
