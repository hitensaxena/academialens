'use client';

import { GeistSans, GeistMono } from 'geist/font';
import { useEffect } from 'react';

export function FontStyles() {
  useEffect(() => {
    // Set CSS variables on the document element
    const root = document.documentElement;
    root.style.setProperty('--geist-sans', GeistSans.style.fontFamily);
    root.style.setProperty('--geist-mono', GeistMono.style.fontFamily);

    // Apply font to body
    document.body.style.fontFamily = 'var(--geist-sans)';

    // Apply monospace font to code elements
    const codeElements = document.querySelectorAll('code, pre, kbd, samp, tt, var');
    codeElements.forEach(el => {
      (el as HTMLElement).style.fontFamily = 'var(--geist-mono)';
    });

    // Cleanup function
    return () => {
      root.style.removeProperty('--geist-sans');
      root.style.removeProperty('--geist-mono');
      document.body.style.fontFamily = '';
    };
  }, []);

  // Return null since we're handling styles with useEffect
  return null;
}
