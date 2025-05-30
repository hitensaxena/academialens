import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user || null;
}

export async function requireAuth(requiredRole?: string) {
  const user = await getCurrentUser();

  if (!user) {
    return { user: null, isAuthorized: false };
  }

  if (requiredRole && user.role !== requiredRole) {
    return { user, isAuthorized: false };
  }

  return { user, isAuthorized: true };
}
