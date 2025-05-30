'use client';

import { useSession } from 'next-auth/react';
import { hasPermission, createPermissionChecker } from '@/lib/permissions';

/**
 * Hook to check if the current user has a specific permission
 * @param resource The resource to check permission for
 * @param action The action to check permission for
 * @returns boolean indicating if the user has permission
 */
export function usePermission(resource: string, action: string): boolean {
  const { data: session } = useSession();
  return hasPermission(session?.user, resource, action);
}

/**
 * Hook to create a permission checker for a specific resource
 * @param resource The resource to check permissions for
 * @returns An object with permission check methods
 */
export function useResourcePermissions(resource: string) {
  const { data: session } = useSession();

  const can = (action: string): boolean => {
    return hasPermission(session?.user, resource, action);
  };

  return {
    can,
    canCreate: () => can('create'),
    canRead: () => can('read'),
    canUpdate: () => can('update'),
    canDelete: () => can('delete'),
  };
}

/**
 * Hook to check if the current user has any of the required permissions
 * @param permissions Array of { resource: string, action: string } objects
 * @returns boolean indicating if the user has any of the required permissions
 */
export function useAnyPermission(
  permissions: Array<{ resource: string; action: string }>,
): boolean {
  const { data: session } = useSession();

  return permissions.some(({ resource, action }) => hasPermission(session?.user, resource, action));
}

// Example usage:
// const canEditProfile = usePermission('profile', 'update');
// const documentPermissions = useResourcePermissions('documents');
// const canViewDocument = documentPermissions.canRead();
// const canDeleteDocument = documentPermissions.canDelete();
//
// const hasAnyPermission = useAnyPermission([
//   { resource: 'documents', action: 'delete' },
//   { resource: 'users', action: 'manage' },
// ]);
