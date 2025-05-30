import type { LucideIcon } from 'lucide-react';

export type ScreenType =
  | 'dashboard'
  | 'analysis'
  | 'documents'
  | 'projects'
  | 'upload'
  | 'settings';

export interface NavItem {
  id: string;
  title: string;
  icon: LucideIcon;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  items?: NavItem[];
  label?: string;
  variant?: 'default' | 'ghost';
}
