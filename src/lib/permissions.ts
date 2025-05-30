import { User } from 'next-auth';

type UserRole = 'user' | 'admin' | 'superadmin';

interface Permission {
  resource: string;
  action: string;
}

// Define permissions for each role
const rolePermissions: Record<UserRole, Permission[]> = {
  user: [
    { resource: 'documents', action: 'read' },
    { resource: 'profile', action: 'read' },
    { resource: 'profile', action: 'update' },
  ],
  admin: [
    { resource: 'documents', action: 'read' },
    { resource: 'documents', action: 'create' },
    { resource: 'documents', action: 'update' },
    { resource: 'documents', action: 'delete' },
    { resource: 'users', action: 'read' },
    { resource: 'profile', action: 'read' },
    { resource: 'profile', action: 'update' },
  ],
  superadmin: [{ resource: '*', action: '*' }],
};

/**
 * Check if a user has permission to perform an action on a resource
 * @param user The user object from the session
 * @param resource The resource to check permission for
 * @param action The action to check permission for
 * @returns boolean indicating if the user has permission
 */
export function hasPermission(
  user: User | null | undefined,
  resource: string,
  action: string,
): boolean {
  if (!user) return false;

  // Superadmin has all permissions
  if (user.role === 'superadmin') return true;

  // Check if the user's role has the required permission
  const permissions = rolePermissions[user.role as UserRole] || [];

  return permissions.some(
    permission =>
      (permission.resource === resource || permission.resource === '*') &&
      (permission.action === action || permission.action === '*'),
  );
}

/**
 * Higher-order function to create a permission checker for a specific resource
 * @param resource The resource to check permissions for
 * @returns A function that checks if a user has permission for a specific action
 */
export function createPermissionChecker(resource: string) {
  return (user: User | null | undefined, action: string): boolean => {
    return hasPermission(user, resource, action);
  };
}

// Example usage:
// const can = createPermissionChecker('documents');
// const canEditDocuments = can(user, 'update'); // true or false
