'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function UserAvatar({ user, className, size = 'md' }: UserAvatarProps) {
  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  };

  const fallbackText = getInitials(user?.name || user?.email);
  const imageUrl =
    user?.image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=random`;

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      <AvatarImage
        src={imageUrl}
        alt={user?.name || 'User'}
        onError={e => {
          // Fallback to initials if image fails to load
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const fallback = target.nextElementSibling as HTMLElement;
          if (fallback) {
            fallback.style.display = 'flex';
          }
        }}
      />
      <AvatarFallback
        className={cn(
          'bg-gradient-to-br from-primary/20 to-muted/50',
          'text-foreground/80',
          'flex items-center justify-center',
          sizeClasses[size],
        )}
      >
        {fallbackText}
      </AvatarFallback>
    </Avatar>
  );
}
