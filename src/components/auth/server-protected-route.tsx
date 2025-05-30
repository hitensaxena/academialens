import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

interface ServerProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  redirectTo?: string;
}

export async function ServerProtectedRoute({
  children,
  requiredRole,
  redirectTo = '/auth/login',
}: ServerProtectedRouteProps) {
  const session = await getServerSession(authOptions);

  // If no session, redirect to login
  if (!session) {
    redirect(redirectTo);
  }

  // If role is required and user doesn't have it, show unauthorized
  if (requiredRole && session.user.role !== requiredRole) {
    redirect('/unauthorized');
  }

  return <>{children}</>;
}
