'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Bell, Search, Menu } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { UserNav } from './user-nav';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

import type { User } from '@/types/user';

interface HeaderProps {
  onMenuClick?: () => void;
  user?: User | null;
  className?: string;
}

export function Header({ onMenuClick, user, className }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 flex h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-200',
        isScrolled && 'shadow-sm',
        className,
      )}
    >
      <div className="flex w-full items-center justify-between px-4 sm:px-6">
        {/* Left: App Name & Menu */}
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 p-0 md:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
          <span className="text-xl font-bold tracking-tight whitespace-nowrap">AcademiaLens</span>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 flex justify-center">
          <div className="relative w-full max-w-lg">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-4 flex-1 justify-end min-w-0">
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
              3
            </span>
            <span className="sr-only">Notifications</span>
          </Button>
          {user && <UserNav user={user} />}
        </div>
      </div>
    </header>
  );
}
