import type { Metadata } from 'next';
import { Providers } from '@/components/providers/session-provider';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { AuthCheck } from '@/components/auth/auth-check';
import { Toaster } from '@/components/ui/toast/toaster';
import './globals.css';

// Define fonts for the app
const fontSans = GeistSans;
const fontMono = GeistMono;

console.log('Font variables:', {
  sansVariable: fontSans.variable,
  monoVariable: fontMono.variable,
});

export const metadata: Metadata = {
  title: 'AcademiaLens',
  description: 'Academic Document Management System',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log('Rendering RootLayout');
  return (
    <html
      lang="en"
      className={`${fontSans.variable} ${fontMono.variable}`}
      suppressHydrationWarning
    >
      <head />
      <body className="antialiased">
        <Providers>
          <AuthCheck>
            {children}
            <Toaster />
          </AuthCheck>
        </Providers>
      </body>
    </html>
  );
}
