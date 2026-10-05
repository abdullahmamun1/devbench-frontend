import type { Metadata } from "next";
import CandidateProfile from "@/components/modules/candidate/candidate-profile";

export const metadata: Metadata = { title: "Profile" };

export default function CandidateProfilePage() {
  return <CandidateProfile />;
}
