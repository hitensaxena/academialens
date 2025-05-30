import { ReactNode } from 'react';

declare module '@/components/user-avatar' {
  interface User {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }

  interface UserAvatarProps {
    user: User;
    className?: string;
  }

  export function UserAvatar(props: UserAvatarProps): ReactNode;
}

declare module './user-avatar' {
  export * from '@/components/user-avatar';
}

declare module './user-avatar.js' {
  export * from '@/components/user-avatar';
}
