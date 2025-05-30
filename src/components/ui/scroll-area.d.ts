declare module '@/components/ui/scroll-area' {
  import * as React from 'react';

  interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    children: React.ReactNode;
  }

  export const ScrollArea: React.ForwardRefExoticComponent<
    ScrollAreaProps & React.RefAttributes<HTMLDivElement>
  >;

  export const ScrollBar: React.FC<{
    className?: string;
    orientation?: 'horizontal' | 'vertical';
  }>;
}
