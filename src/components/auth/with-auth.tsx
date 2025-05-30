'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

interface WithAuthProps {
  requiredRole?: string;
  redirectTo?: string;
}

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithAuthProps = {},
) {
  const { requiredRole, redirectTo = '/auth/login' } = options;

  return function WithAuthWrapper(props: P) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === 'loading') return;

      // If no session, redirect to login
      if (!session) {
        router.push(redirectTo);
        return;
      }

      // If role is required and user doesn't have it, show unauthorized
      if (requiredRole && session.user.role !== requiredRole) {
        router.push('/unauthorized');
      }
    }, [session, status, router]);

    // Show loading state while checking auth
    if (status === 'loading' || !session) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      );
    }

    // If role is required and user doesn't have it, don't render the component
    if (requiredRole && session.user.role !== requiredRole) {
      return null;
    }

    return <WrappedComponent {...(props as P)} />;
  };
}
