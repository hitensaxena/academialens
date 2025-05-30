'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserAvatarProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  className?: string;
}

export function UserAvatar({ user, className }: UserAvatarProps) {
  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Avatar className={className}>
      {user?.image ? (
        <AvatarImage src={user.image} alt={user.name || 'User'} />
      ) : (
        <AvatarFallback>{getInitials(user?.name || user?.email)}</AvatarFallback>
      )}
    </Avatar>
  );
}
