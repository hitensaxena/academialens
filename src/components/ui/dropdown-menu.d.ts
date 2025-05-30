import * as React from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';

declare module '@/components/ui/dropdown-menu' {
  export const DropdownMenu: React.ForwardRefExoticComponent<
    React.ComponentProps<typeof DropdownMenuPrimitive.Root>
  >;

  export const DropdownMenuTrigger: React.ForwardRefExoticComponent<
    React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>
  >;

  export const DropdownMenuContent: React.ForwardRefExoticComponent<
    React.ComponentProps<typeof DropdownMenuPrimitive.Content> & {
      sideOffset?: number;
    }
  >;

  export const DropdownMenuItem: React.ForwardRefExoticComponent<
    React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
      inset?: boolean;
      variant?: 'default' | 'destructive';
    }
  >;

  export const DropdownMenuLabel: React.ForwardRefExoticComponent<
    React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
      inset?: boolean;
    }
  >;

  export const DropdownMenuSeparator: React.ForwardRefExoticComponent<
    React.ComponentProps<typeof DropdownMenuPrimitive.Separator>
  >;

  export const DropdownMenuGroup: React.ForwardRefExoticComponent<
    React.ComponentProps<typeof DropdownMenuPrimitive.Group>
  >;

  export const DropdownMenuPortal: React.FC<
    React.ComponentProps<typeof DropdownMenuPrimitive.Portal>
  >;
}
