'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredRole?: string;
};

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'loading') return;

    // If user is not authenticated, redirect to login
    if (!session) {
      const callbackUrl = encodeURIComponent(pathname || '/dashboard');
      router.push(`/auth/login?callbackUrl=${callbackUrl}`);
      return;
    }

    // If role is required and user doesn't have it, redirect to dashboard
    if (requiredRole && session.user.role !== requiredRole) {
      router.push('/dashboard');
    }
  }, [session, status, router, pathname, requiredRole]);

  if (status === 'loading' || !session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If role is required and user doesn't have it, show unauthorized
  if (requiredRole && session.user.role !== requiredRole) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Unauthorized</h2>
          <p className="text-muted-foreground">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
