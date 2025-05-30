'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

interface AuthCheckProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export function AuthCheck({ children, requiredRole }: AuthCheckProps) {
  const { data: session, status } = useSession();
  console.log('AuthCheck session:', session, 'status:', status);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't run on server or while session is loading
    if (status === 'loading') return;

    const publicPaths = ['/auth/login', '/auth/register', '/auth/error'];
    const isPublicPath = publicPaths.some(path => pathname?.startsWith(path));

    // Redirect to login if not authenticated and not on a public path
    if (!session && !isPublicPath) {
      const callbackUrl = encodeURIComponent(pathname || '/dashboard');
      router.push(`/auth/login?callbackUrl=${callbackUrl}`);
      return;
    }

    // Redirect to unauthorized if user doesn't have the required role
    if (session && requiredRole && session.user.role !== requiredRole) {
      router.push('/unauthorized');
      return;
    }

    // Redirect to dashboard if authenticated and on auth pages
    if (session && isPublicPath) {
      router.push('/dashboard');
    }
  }, [session, status, router, pathname, requiredRole]);

  // Show loading state while checking auth
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is authenticated or on a public path, render children
  if (session || pathname?.startsWith('/auth/')) {
    return <>{children}</>;
  }

  // Otherwise, don't render anything (will be handled by the redirect)
  return null;
}
