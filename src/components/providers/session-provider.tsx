'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from './theme-provider';
import type { ThemeProviderProps } from 'next-themes';
import { ReactNode } from 'react';

type ProvidersProps = {
  children: ReactNode;
  themeProps?: Omit<ThemeProviderProps, 'children'>;
  session?: unknown; // Session from getServerSession
};

export function Providers({ children, themeProps, session }: ProvidersProps) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider {...themeProps}>{children}</ThemeProvider>
    </SessionProvider>
  );
}
