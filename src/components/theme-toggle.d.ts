import { ReactNode } from 'react';

declare module '@/components/theme-toggle' {
  export function ThemeToggle(): ReactNode;
}

declare module './theme-toggle' {
  export function ThemeToggle(): ReactNode;
}

declare module './theme-toggle.js' {
  export function ThemeToggle(): ReactNode;
}
