'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function useAuth(requiredRole?: string) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't run on server or while session is loading
    if (status === 'loading') return;

    const publicPaths = ['/auth/login', '/auth/register', '/auth/error'];
    const isPublicPath = publicPaths.some(path => pathname?.startsWith(path));

    // If not authenticated and not on a public path, redirect to login
    if (!session && !isPublicPath) {
      const callbackUrl = encodeURIComponent(pathname || '/dashboard');
      router.push(`/auth/login?callbackUrl=${callbackUrl}`);
      return;
    }

    // If user doesn't have the required role, redirect to unauthorized
    if (session && requiredRole && session.user.role !== requiredRole) {
      router.push('/unauthorized');
      return;
    }

    // If authenticated and on auth pages, redirect to dashboard
    if (session && isPublicPath) {
      router.push('/dashboard');
    }
  }, [session, status, router, pathname, requiredRole]);

  return {
    session,
    status,
    isAuthenticated: !!session,
    hasRequiredRole: requiredRole ? session?.user.role === requiredRole : true,
  };
}
