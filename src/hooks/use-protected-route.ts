'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function useProtectedRoute(requiredRole?: string) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'loading') return;

    const publicPaths = ['/auth/login', '/auth/register', '/auth/error'];
    const isPublicPath = publicPaths.some(path => pathname?.startsWith(path));

    // If user is not authenticated and trying to access a protected route
    if (!session && !isPublicPath) {
      const callbackUrl = encodeURIComponent(pathname || '/dashboard');
      router.push(`/auth/login?callbackUrl=${callbackUrl}`);
      return;
    }

    // If user is authenticated but doesn't have the required role
    if (session && requiredRole && session.user.role !== requiredRole) {
      router.push('/unauthorized');
      return;
    }

    // If user is authenticated but trying to access auth pages, redirect to dashboard
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
