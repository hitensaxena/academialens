'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

import type { NavItem as NavItemType } from './sidebar.types';

export interface NavItemProps extends React.HTMLAttributes<HTMLDivElement> {
  item: NavItemType;
  isActive?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  className?: string;
}

export function NavItem({ item, isActive = false, onClick, className, ...props }: NavItemProps) {
  const { title, href, icon: Icon, disabled, external, label } = item;

  const pathname = usePathname();
  const isActiveState = isActive || (href ? pathname === href : false);

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick(e);
    }
  };

  const content = (
    <div
      className={cn(
        'flex items-center w-full px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
        'hover:bg-accent hover:text-accent-foreground',
        isActiveState ? 'bg-accent text-accent-foreground font-semibold' : 'text-muted-foreground',
        disabled && 'opacity-50 pointer-events-none',
        className,
      )}
      onClick={handleClick}
      {...props}
    >
      {Icon && <Icon className="mr-3 h-4 w-4 flex-shrink-0" />}
      <span className="truncate">{title}</span>
      {label && (
        <span className="ml-auto bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
          {label}
        </span>
      )}
    </div>
  );

  if (disabled) {
    return <div className="w-full">{content}</div>;
  }

  return (
    <div className="w-full">
      {external ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="block w-full">
          {content}
        </a>
      ) : href ? (
        <Link href={href} className="block w-full" onClick={handleClick}>
          {content}
        </Link>
      ) : (
        <button className="block w-full text-left" onClick={handleClick}>
          {content}
        </button>
      )}
    </div>
  );
}
