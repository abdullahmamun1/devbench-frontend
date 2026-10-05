import type { Metadata } from "next";
import CandidateOverview from "@/components/modules/candidate/candidate-overview";

export const metadata: Metadata = { title: "Overview" };

export default function CandidatePage() {
  return <CandidateOverview />;
}
