import { LucideIcon } from 'lucide-react';

declare module '@/components/icons' {
  export const Icons: {
    [key: string]: LucideIcon | ((props: any) => JSX.Element);
    menu: LucideIcon;
    close: LucideIcon;
    home: LucideIcon;
    document: LucideIcon;
    upload: LucideIcon;
    settings: LucideIcon;
    logout: LucideIcon;
    chevronDown: LucideIcon;
    chevronRight: LucideIcon;
    logo: (props: any) => JSX.Element;
  };
}
