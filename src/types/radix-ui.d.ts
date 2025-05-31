// Type definitions for @radix-ui/react-progress
declare module '@radix-ui/react-progress' {
  export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
    value?: number;
    max?: number;
    getValueLabel?: (value: number, max: number) => string;
    children?: React.ReactNode;
  }

  export const Root: React.ForwardRefExoticComponent<
    ProgressProps & React.RefAttributes<HTMLDivElement>
  >;

  export const Indicator: React.ForwardRefExoticComponent<
    React.HTMLAttributes<HTMLDivElement> & {
      style?: React.CSSProperties & {
        '--progress-value'?: string;
        '--progress-max'?: string;
      };
    } & React.RefAttributes<HTMLDivElement>
  >;
}
