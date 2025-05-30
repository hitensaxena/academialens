'use client';

import * as React from 'react';
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps as NextThemesProviderProps,
} from 'next-themes';
import { useEffect, useState } from 'react';

type ThemeProviderProps = Omit<NextThemesProviderProps, 'children'> & {
  children: React.ReactNode;
};

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);

  // Set mounted state after component mounts
  useEffect(() => {
    setMounted(true);

    // Cleanup function
    return () => {
      setMounted(false);
    };
  }, []);

  // Don't render anything on the server
  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
      storageKey="academialens-theme"
      // Prevent hydration mismatch by forcing a re-render on mount
      forcedTheme={mounted ? undefined : 'light'}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
