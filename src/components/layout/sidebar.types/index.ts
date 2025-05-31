import type { LucideIcon } from 'lucide-react';

/**
 * Represents a navigation item in the sidebar
 */
export interface NavItem {
  /** Unique identifier for the navigation item */
  id: string;
  /** Display text for the navigation item */
  title: string;
  /** URL path for the navigation item (optional) */
  href?: string; // Made optional
  /** Optional icon component */
  icon?: LucideIcon | React.ComponentType<{ className?: string }>;
  /** Child navigation items (for nested menus) */
  items?: NavItem[];
  /** Whether the item is disabled */
  disabled?: boolean;
  /** Whether the link should open in a new tab */
  external?: boolean;
  /** Optional label/badge */
  label?: string;
  /** Optional description text */
  description?: string;
  /** Optional roles that can access this item */
  roles?: string[];
  /** Optional variant for styling */
  variant?: 'default' | 'ghost'; // Added from the other file
}

export type ScreenType =
  | 'dashboard'
  | 'analysis'
  | 'documents'
  | 'projects'
  | 'upload'
  | 'settings';
