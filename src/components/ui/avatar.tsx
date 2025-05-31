import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string;
  children?: React.ReactNode;
}

const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  ({ className, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', className)}
      {...props}
    >
      {children}
    </span>
  ),
);
Avatar.displayName = 'Avatar';

interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  width?: number | string;
  height?: number | string;
}

const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className, src, alt, width = 40, height = 40, ...props }, ref) => {
    return (
      <Image
        ref={ref}
        src={src}
        className={cn('aspect-square h-full w-full object-cover', className)}
        width={Number(width)}
        height={Number(height)}
        alt={alt}
        onError={e => {
          // Hide the image if it fails to load
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
        }}
        {...props}
      />
    );
  },
);
AvatarImage.displayName = 'AvatarImage';

interface AvatarFallbackProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string;
  children?: React.ReactNode;
}

const AvatarFallback = React.forwardRef<HTMLSpanElement, AvatarFallbackProps>(
  ({ className, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'flex h-full w-full items-center justify-center rounded-full',
        'bg-gradient-to-br from-muted/50 to-muted/30',
        'text-foreground/80 font-medium',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  ),
);
AvatarFallback.displayName = 'AvatarFallback';

export { Avatar, AvatarImage, AvatarFallback };
