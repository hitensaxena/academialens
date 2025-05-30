'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NavItem as NavItemType } from './sidebar.types';
import { NavItem } from './nav-item';

export interface NavSectionProps {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  items: NavItemType[];
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

export function NavSection({
  title,
  icon: Icon,
  items,
  isActive = false,
  onClick,
  className,
}: NavSectionProps) {
  const [isOpen, setIsOpen] = React.useState(isActive);

  React.useEffect(() => {
    if (isActive) {
      setIsOpen(true);
    }
  }, [isActive]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (onClick) {
      onClick();
    }
  };

  return (
    <div className={cn('space-y-1', className)}>
      <button
        type="button"
        className={cn(
          'flex items-center w-full px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
          'hover:bg-accent hover:text-accent-foreground',
          isActive ? 'bg-accent text-accent-foreground font-semibold' : 'text-muted-foreground',
          'justify-between',
          'group',
        )}
        onClick={handleToggle}
        aria-expanded={isOpen}
      >
        <div className="flex items-center">
          {Icon && <Icon className="mr-3 h-4 w-4 flex-shrink-0" />}
          <span className="text-left">{title}</span>
        </div>
        <ChevronDown
          className={cn(
            'h-4 w-4 transition-transform duration-200',
            isOpen ? 'transform rotate-180' : '',
          )}
          aria-hidden="true"
        />
      </button>
      {isOpen && (
        <div className="ml-7 mt-1.5 space-y-1">
          {items.map((item, index) => (
            <NavItem key={item.id || index} item={item} className="text-sm" />
          ))}
        </div>
      )}
    </div>
  );
}
