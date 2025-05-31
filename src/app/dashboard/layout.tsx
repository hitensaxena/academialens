'use client';

import { Inter } from 'next/font/google';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Menu,
  X,
  Home,
  Folder,
  FileText,
  ChevronLeft,
  ChevronRight,
  Upload,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Header } from '@/components/layout/header';
import { useSession } from 'next-auth/react';

const inter = Inter({ subsets: ['latin'] });

const navItems = [
  {
    name: 'Home',
    href: '/dashboard',
    icon: Home,
    description: 'Go to dashboard',
  },
  {
    name: 'My Projects',
    href: '/dashboard/projects',
    icon: Folder,
    description: 'View your projects',
  },
  {
    name: 'Shared With Me',
    href: '/dashboard/shared',
    icon: FileText,
    description: 'View shared documents',
  },
  {
    name: 'Upload',
    href: '/dashboard/upload',
    icon: Upload,
    description: 'Upload new documents',
  },
  {
    name: 'Profile',
    href: '/dashboard/profile',
    icon: User,
    description: 'View your profile',
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  // Close mobile sidebar when route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`${inter.className} bg-background text-foreground min-h-screen flex flex-col`}>
      <TooltipProvider>
        <ProtectedRoute>
          <div className={cn('sticky top-0 z-40', isCollapsed ? 'lg:pl-20' : 'lg:pl-72')}>
            <Header
              user={session?.user}
              onMenuClick={() => setSidebarOpen(true)}
              className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
            />
          </div>

          {/* Mobile sidebar */}
          <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
            <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <div className="fixed inset-y-0 left-0 w-72 bg-card shadow-lg">
              <div className="flex h-full flex-col">
                <div className="flex h-16 items-center justify-between px-4 border-b">
                  <span className="text-xl font-bold">AcademiaLens</span>
                  <button
                    type="button"
                    className="rounded-md p-2 hover:bg-accent"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <nav className="flex-1 overflow-y-auto py-6 px-4">
                  <ul className="space-y-2">
                    {navItems.map(item => {
                      const isActive = pathname === item.href;
                      const Icon = item.icon;

                      return (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            className={`flex items-center rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                              isActive
                                ? 'bg-accent text-accent-foreground'
                                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                            }`}
                          >
                            <Icon className="h-6 w-6 flex-shrink-0" />
                            <span className="ml-3">{item.name}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              </div>
            </div>
          </div>

          {/* Desktop sidebar */}
          <div
            className={cn(
              'fixed inset-y-0 z-40 hidden lg:flex flex-col',
              'transition-all duration-300 ease-in-out',
              isCollapsed ? 'w-20' : 'w-72',
              'border-r bg-card',
            )}
          >
            <div className="flex min-h-0 flex-1 flex-col border-r bg-card">
              <div className="flex flex-1 flex-col overflow-y-auto pt-6">
                <div
                  className={cn(
                    'flex items-center px-4 mb-6',
                    isCollapsed ? 'justify-center' : 'justify-between',
                  )}
                >
                  {!isCollapsed && <h1 className="text-xl font-bold">AcademiaLens</h1>}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={toggleSidebar}
                      >
                        {isCollapsed ? (
                          <ChevronRight className="h-5 w-5" />
                        ) : (
                          <ChevronLeft className="h-5 w-5" />
                        )}
                        <span className="sr-only">
                          {isCollapsed ? 'Expand' : 'Collapse'} sidebar
                        </span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      {isCollapsed ? 'Expand' : 'Collapse'} sidebar
                    </TooltipContent>
                  </Tooltip>
                </div>

                <nav className="mt-2 flex-1 space-y-1 px-2">
                  <TooltipProvider>
                    {navItems.map(item => {
                      const isActive = pathname === item.href;
                      const Icon = item.icon;

                      return (
                        <Tooltip key={item.name}>
                          <TooltipTrigger asChild>
                            <Link
                              href={item.href}
                              className={cn(
                                'group flex items-center rounded-lg p-3 text-base font-medium transition-colors',
                                'hover:bg-accent hover:text-accent-foreground',
                                isActive
                                  ? 'bg-accent text-accent-foreground'
                                  : 'text-muted-foreground',
                                isCollapsed ? 'justify-center' : 'px-4',
                              )}
                            >
                              <Icon className="h-6 w-6 flex-shrink-0" />
                              {!isCollapsed && <span className="ml-3">{item.name}</span>}
                            </Link>
                          </TooltipTrigger>
                          {isCollapsed && <TooltipContent side="right">{item.name}</TooltipContent>}
                        </Tooltip>
                      );
                    })}
                  </TooltipProvider>
                </nav>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div
            className={cn(
              'flex flex-1 flex-col transition-all duration-300 ease-in-out',
              isCollapsed ? 'lg:pl-20' : 'lg:pl-72',
            )}
          >
            <main className="flex-1">
              <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
              </div>
            </main>
          </div>
        </ProtectedRoute>
      </TooltipProvider>
    </div>
  );
}
