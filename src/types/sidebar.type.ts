import type { UserRole } from "./user.type";

export interface SidebarItem {
  title: string;
  url: string;
  roles?: UserRole[];
}

export interface SidebarGroup {
  title: string;
  items: SidebarItem[];
}
