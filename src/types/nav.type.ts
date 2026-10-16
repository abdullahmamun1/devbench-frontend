import type { LucideIcon } from "lucide-react";

export interface NavMenuLink {
  label: string;
  href: string;
  description: string;
  icon: LucideIcon;
  external?: boolean;
}

export interface NavMenuSection {
  title: string;
  links: NavMenuLink[];
}

// Highlighted card shown beside the links in a dropdown panel
export interface NavMenuFeature {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  cta: string;
}

export type NavMenuEntry =
  | { label: string; href: string }
  | {
      label: string;
      sections: NavMenuSection[];
      feature?: NavMenuFeature;
    };
