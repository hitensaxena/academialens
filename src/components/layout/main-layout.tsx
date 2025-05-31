'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { FileText, Home, Upload, Settings, BarChart, Folder, Loader2 } from 'lucide-react';

import { Sidebar } from './sidebar';
import { Header } from './header';
import { Toaster } from '@/components/ui/toaster';
import { useUIStore } from '@/store/ui-store';
import { useUserStore } from '@/store/user-store';
import { useSession } from 'next-auth/react';
import type { ScreenType, NavItem } from './sidebar.types';

// Import your screen components
import { DashboardScreen } from '@/app/dashboard/screens/dashboard';
import { AnalysisScreen } from '@/app/dashboard/screens/analysis';
import { DocumentsScreen } from '@/app/dashboard/screens/documents';
import { ProjectsScreen } from '@/app/dashboard/screens/projects';
import UploadScreen from '@/app/dashboard/screens/upload';
import { SettingsScreen } from '@/app/dashboard/screens/settings';

// Screen components mapping
const screenComponents: Record<string, React.ComponentType> = {
  dashboard: DashboardScreen,
  analysis: AnalysisScreen,
  documents: DocumentsScreen,
  projects: ProjectsScreen,
  upload: UploadScreen,
  settings: SettingsScreen,
};

// Navigation items configuration
const navItems: NavItem[] = [
  { id: 'dashboard', title: 'Dashboard', icon: Home },
  { id: 'documents', title: 'Documents', icon: FileText },
  { id: 'analysis', title: 'Analysis', icon: BarChart },
  { id: 'projects', title: 'Projects', icon: Folder },
  { id: 'upload', title: 'Upload', icon: Upload },
  { id: 'settings', title: 'Settings', icon: Settings },
];

interface MainLayoutProps {
  children?: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  // State from stores
  const { isSidebarOpen, setSidebarOpen } = useUIStore();
  const { user, setUser } = useUserStore();

  // Hydrate user store from NextAuth session
  React.useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      setUser({
        ...session.user,
        name: session.user.name ?? '',
        email: session.user.email ?? '',
        image: session.user.image ?? '',
        // Patch missing fields with null/defaults
        title: null,
        createdAt: null as unknown as Date,
        updatedAt: null as unknown as Date,
        institution: null,
        department: null,
        bio: null,
        researchInterests: [],
        stripeCustomerId: null,
        subscriptionStatus: null,
        subscriptionId: null,
        subscriptionPeriodEnd: null as unknown as Date,
        // Add more fields as required by your user model
      });
    }
  }, [status, session, setUser]);

  // Get active screen from URL
  const pathParts = pathname.split('/').filter(Boolean);
  const screenFromPath = (pathParts[pathParts.length - 1] || 'dashboard') as ScreenType;
  const activeScreen = Object.keys(screenComponents).includes(screenFromPath)
    ? screenFromPath
    : 'dashboard';

  // Handle screen changes
  const handleScreenChange = (screen: ScreenType) => {
    if (screen === activeScreen) return;

    // Update URL without page reload
    if (screen === 'dashboard') {
      router.push('/dashboard');
    } else {
      router.push(`/dashboard/${screen}`);
    }
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  // Show loading state if user data is not loaded yet
  if (!user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      {/* Header always at the top */}
      <Header onMenuClick={toggleSidebar} user={user} className="border-b" />
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeScreen={activeScreen}
          onScreenChange={handleScreenChange}
          navItems={navItems}
        />
        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-background p-4 md:p-6">
          {children || React.createElement(screenComponents[activeScreen] || (() => null))}
        </main>
      </div>
      {/* Toast notifications */}
      <Toaster />
    </div>
  );
}
