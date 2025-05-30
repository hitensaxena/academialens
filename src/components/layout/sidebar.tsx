'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Icons } from '@/components/icons';
import type { NavItem as NavItemType, ScreenType } from './sidebar.types';
import { NavSection } from './nav-section';
import { NavItem } from './nav-item';

interface SidebarProps {
  className?: string;
  navItems: NavItemType[];
  bottomNavItems?: NavItemType[];
  activeScreen?: ScreenType;
  onScreenChange?: (screen: ScreenType) => void;
  onNavItemClick?: (item: NavItemType) => void;
  collapsed?: boolean;
}

export function Sidebar({
  className,
  navItems = [],
  bottomNavItems = [],
  activeScreen,
  onScreenChange,
  onNavItemClick,
  collapsed = false,
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [isCollapsed, setIsCollapsed] = React.useState(collapsed);

  React.useEffect(() => {
    setIsCollapsed(collapsed);
  }, [collapsed]);

  const handleNavItemClick = (item: NavItemType) => {
    if (onNavItemClick) {
      onNavItemClick(item);
    }
    if (onScreenChange && item.id) {
      onScreenChange(item.id as ScreenType);
    }
    if (item.href) {
      router.push(item.href);
    }
    setOpen(false);
  };

  const isItemActive = React.useCallback(
    (item: NavItemType): boolean => {
      if (activeScreen && item.id === activeScreen) {
        return true;
      }
      if (item.href) {
        return pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
      }
      if (item.items) {
        return item.items.some(isItemActive);
      }
      return false;
    },
    [activeScreen, pathname],
  );

  const renderNavItem = (item: NavItemType, index: number) => {
    if (item.items && item.items.length > 0) {
      return (
        <div key={item.id || index} className="mb-2">
          <NavSection
            title={item.title}
            icon={item.icon}
            items={item.items}
            isActive={isItemActive(item)}
            onClick={() => handleNavItemClick(item)}
          />
        </div>
      );
    }

    return (
      <NavItem
        key={item.id || index}
        item={item}
        isActive={isItemActive(item)}
        onClick={() => handleNavItemClick(item)}
        className="mb-1"
      />
    );
  };

  return (
    <>
      {/* Mobile Navigation */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="fixed left-4 top-4 z-50 md:hidden">
            <Icons.menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] p-0">
          <div className="flex h-full flex-col">
            <div className="h-16 flex-shrink-0" /> {/* Spacer for header */}
            <ScrollArea className="flex-1">
              <nav className="px-3 py-2">
                <ul className="space-y-1.5">
                  {navItems.map((item, index) => (
                    <li key={`mobile-${item.id || index}`} className="px-2">
                      {renderNavItem(item, index)}
                    </li>
                  ))}
                </ul>
                {bottomNavItems.length > 0 && (
                  <div className="border-t border-gray-200 dark:border-gray-800 mt-3 pt-3">
                    <ul className="space-y-1.5">
                      {bottomNavItems.map((item, index) => (
                        <li key={`mobile-bottom-${item.id || index}`} className="px-2">
                          {renderNavItem(item, index)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </nav>
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Navigation */}
      <div className={cn('hidden md:flex md:flex-col md:w-64 h-screen sticky top-0', className)}>
        <div className="h-16 flex-shrink-0" /> {/* Spacer for header */}
        <ScrollArea className="flex-1">
          <nav className="px-3 py-2">
            <ul className="space-y-1.5">
              {navItems.map((item, index) => (
                <li key={item.id || index} className="px-2">
                  {renderNavItem(item, index)}
                </li>
              ))}
            </ul>
            {bottomNavItems.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-800 mt-3 pt-3">
                <ul className="space-y-1.5">
                  {bottomNavItems.map((item, index) => (
                    <li key={item.id || `bottom-${index}`} className="px-2">
                      {renderNavItem(item, index)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </nav>
        </ScrollArea>
      </div>
    </>
  );
}
