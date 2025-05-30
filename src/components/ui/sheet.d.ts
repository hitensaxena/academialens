import * as React from 'react';

declare module '@/components/ui/sheet' {
  interface SheetProps extends React.HTMLAttributes<HTMLDivElement> {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    defaultOpen?: boolean;
    modal?: boolean;
  }

  interface SheetTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
    asChild?: boolean;
  }

  interface SheetContentProps extends React.HTMLAttributes<HTMLDivElement> {
    side?: 'top' | 'right' | 'bottom' | 'left';
    onEscapeKeyDown?: (event: KeyboardEvent) => void;
    onPointerDownOutside?: (event: Event) => void;
    onInteractOutside?: (event: Event) => void;
    forceMount?: boolean;
    container?: HTMLElement | null;
  }

  export const Sheet: React.FC<SheetProps> & {
    Trigger: React.FC<SheetTriggerProps>;
    Content: React.FC<SheetContentProps>;
    Header: React.FC<React.HTMLAttributes<HTMLDivElement>>;
    Footer: React.FC<React.HTMLAttributes<HTMLDivElement>>;
    Title: React.FC<React.HTMLAttributes<HTMLDivElement>>;
    Description: React.FC<React.HTMLAttributes<HTMLDivElement>>;
    Close: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>>;
  };
}
