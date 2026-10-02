import type { LucideIcon } from "lucide-react";
import type { UserRole } from "./user.type";

export interface SidebarItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  roles?: UserRole[];
}

export interface SidebarGroup {
  title: string;
  items: SidebarItem[];
}
