import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  user?: { image?: string; name?: string };
  asChild?: boolean;
}

const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  ({ className, user, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', className)}
        {...props}
      >
        <Image
          src={user?.image || '/default-avatar.png'}
          className="rounded-full"
          width={40}
          height={40}
          alt={user?.name ? `${user.name}'s avatar` : 'User avatar'}
        />
        ,
      </span>
    );
  },
);
Avatar.displayName = 'Avatar';

const AvatarImage = React.forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement> & {
    asChild?: boolean;
    src: string;
    alt?: string;
  }
>(({ className, src, alt = 'User avatar', width = 40, height = 40, ...props }) => (
  <Image
    src={src}
    className={cn('aspect-square h-full w-full', className)}
    width={Number(width)}
    height={Number(height)}
    alt={alt}
    {...props}
  />
));
AvatarImage.displayName = 'AvatarImage';

const AvatarFallback = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & {
    asChild?: boolean;
  }
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      'flex h-full w-full items-center justify-center rounded-full bg-muted',
      className,
    )}
    {...props}
  />
));
AvatarFallback.displayName = 'AvatarFallback';

export { Avatar, AvatarImage, AvatarFallback };
