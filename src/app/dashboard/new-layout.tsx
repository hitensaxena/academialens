'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

// Import icons from @heroicons/react/24/outline
import {
  HomeIcon,
  DocumentTextIcon,
  ChartBarIcon,
  FolderIcon,
  ArrowUpTrayIcon as UploadIcon,
  Cog6ToothIcon as CogIcon,
  BellIcon,
  MagnifyingGlassIcon as SearchIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

// Card component removed as it's not being used

type NavItem = {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  current: boolean;
};

export function NewDashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation: NavItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, current: pathname === '/dashboard' },
    {
      name: 'Documents',
      href: '/documents',
      icon: DocumentTextIcon,
      current: pathname.startsWith('/documents'),
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: ChartBarIcon,
      current: pathname === '/analytics',
    },
    { name: 'Projects', href: '/projects', icon: FolderIcon, current: pathname === '/projects' },
    { name: 'Upload', href: '/upload', icon: UploadIcon, current: pathname === '/upload' },
    { name: 'Settings', href: '/settings', icon: CogIcon, current: pathname === '/settings' },
  ];

  useEffect(() => {
    // Close mobile sidebar when route changes
    setSidebarOpen(false);
  }, [pathname]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/auth/signin');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-20 bg-black bg-opacity-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-30 w-64 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full bg-background border-r">
          <div className="flex items-center justify-between p-4 border-b">
            <h1 className="text-xl font-bold">AcademiaLens</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-md hover:bg-accent"
              aria-label="Close sidebar"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-2">
              {navigation.map(item => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-4 py-3 rounded-lg ${
                      item.current
                        ? 'bg-accent text-accent-foreground'
                        : 'text-foreground/80 hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="ml-3">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="p-4 border-t">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <span className="font-medium">
                  {session?.user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{session?.user?.name || 'User'}</p>
                <p className="text-xs text-muted-foreground">
                  {session?.user?.email || 'user@example.com'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-background border-r">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <h1 className="text-xl font-bold">AcademiaLens</h1>
              </div>
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {navigation.map(item => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                      item.current
                        ? 'bg-accent text-accent-foreground'
                        : 'text-foreground/80 hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="ml-3">{item.name}</span>
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 border-t p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="font-medium">
                    {session?.user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{session?.user?.name || 'User'}</p>
                  <p className="text-xs text-muted-foreground">
                    {session?.user?.email || 'user@example.com'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
        {/* Top navigation */}
        <div className="lg:hidden flex-shrink-0 flex h-16 bg-background border-b lg:border-none">
          <button
            type="button"
            className="px-4 border-r text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" />
          </button>
          <div className="flex-1 flex justify-between px-4">
            <div className="flex-1 flex">
              <div className="w-full flex md:ml-0">
                <div className="relative w-full text-muted-foreground focus-within:text-foreground">
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5" />
                  </div>
                  <input
                    id="search-field"
                    name="search-field"
                    className="block w-full h-full pl-8 pr-3 py-2 border-transparent placeholder-muted-foreground focus:outline-none focus:ring-0 focus:border-transparent sm:text-sm bg-accent/50 rounded-md"
                    placeholder="Search"
                    type="search"
                  />
                </div>
              </div>
            </div>
            <div className="ml-4 flex items-center">
              <button
                type="button"
                className="p-1 rounded-full text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-background">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-6">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
