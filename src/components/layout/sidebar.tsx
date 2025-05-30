'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

import { ScrollArea } from '@/components/ui/scroll-area/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

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
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({
  className,
  navItems = [],
  bottomNavItems = [],
  activeScreen,
  onScreenChange,
  onNavItemClick,
  collapsed = false,
  isOpen = false,
  onClose,
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(collapsed);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  React.useEffect(() => {
    setIsCollapsed(collapsed);
  }, [collapsed]);

  React.useEffect(() => {
    setIsMobileOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setIsMobileOpen(false);
    if (onClose) onClose();
  };

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
    // Close mobile sidebar when an item is clicked
    if (isMobileOpen) {
      handleClose();
    }
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
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        {/* Hidden trigger - controlled by the Header component */}
        <SheetTrigger asChild>
          <div className="hidden" />
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] p-0">
          {/* Visually hidden DialogTitle for accessibility */}
          <span
            style={{
              position: 'absolute',
              width: 1,
              height: 1,
              padding: 0,
              margin: -1,
              overflow: 'hidden',
              clip: 'rect(0,0,0,0)',
              whiteSpace: 'nowrap',
              border: 0,
            }}
          >
            Sidebar Navigation
          </span>
          <div className="flex h-full flex-col">
            <div className="h-16 flex-shrink-0" />
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
                  <div className="mt-3 border-t border-gray-200 pt-3 dark:border-gray-800">
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
      <div
        className={cn(
          'hidden h-screen flex-col border-r bg-background transition-all duration-300 ease-in-out md:flex',
          isCollapsed ? 'w-20' : 'w-64',
          className,
        )}
      >
        <div className="h-16 flex-shrink-0" /> {/* Spacer for header */}
        <ScrollArea className="flex-1">
          <nav className="px-3 py-2">
            <ul className="space-y-1.5">
              {navItems.map((item, index) => (
                <li key={`desktop-${item.id || index}`} className="px-2">
                  {renderNavItem(item, index)}
                </li>
              ))}
            </ul>
            {bottomNavItems.length > 0 && (
              <div className="mt-3 border-t border-gray-200 pt-3 dark:border-gray-800">
                <ul className="space-y-1.5">
                  {bottomNavItems.map((item, index) => (
                    <li key={`desktop-bottom-${item.id || index}`} className="px-2">
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
