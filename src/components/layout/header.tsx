'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Bell, Menu, Search } from 'lucide-react';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { UserNav } from './user-nav';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  onMenuClick?: () => void;
  className?: string;
}

export function Header({ onMenuClick, className }: HeaderProps) {
  const { data: session } = useSession();
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
      <div className="flex w-full items-center justify-between px-4 sm:px-6 md:ml-64">
        {/* Left section */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 p-0 md:hidden"
              onClick={onMenuClick}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
            <div className="hidden md:flex items-center">
              <Icons.logo className="h-6 w-6" />
              <span className="ml-2 font-bold text-lg">AcademiaLens</span>
            </div>
          </div>

          <div className="relative hidden w-64 md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="h-9 w-full rounded-lg bg-muted pl-9 focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 p-0 text-muted-foreground hover:text-foreground"
          >
            <Bell className="h-5 w-5" />
            <span className="sr-only">View notifications</span>
          </Button>
          <ThemeToggle />
          <UserNav user={session?.user} />
        </div>
      </div>
    </header>
  );
}
