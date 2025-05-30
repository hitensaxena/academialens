'use client';

import { ReactNode, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { FileText, Home, Upload, Settings, BarChart, Folder } from 'lucide-react';

import { Sidebar } from './sidebar';
import { Header } from './header';
import type { NavItem, ScreenType } from './sidebar.types';

// Import your screen components
import { DashboardScreen } from '@/app/dashboard/screens/dashboard';
import { AnalysisScreen } from '@/app/dashboard/screens/analysis';
import { DocumentsScreen } from '@/app/dashboard/screens/documents';
import { ProjectsScreen } from '@/app/dashboard/screens/projects';
import UploadScreen from '@/app/dashboard/screens/upload';
import { SettingsScreen } from '@/app/dashboard/screens/settings';

interface MainLayoutProps {
  children: ReactNode;
  initialScreen?: ScreenType;
}

// Screen components mapping
const screenComponents: Record<string, React.ComponentType> = {
  dashboard: DashboardScreen,
  analysis: AnalysisScreen,
  documents: DocumentsScreen,
  projects: ProjectsScreen,
  upload: UploadScreen,
  settings: SettingsScreen,
};

export function MainLayout({ children, initialScreen = 'dashboard' }: MainLayoutProps) {
  const [activeScreen, setActiveScreen] = useState<ScreenType>(initialScreen);
  const pathname = usePathname();
  const router = useRouter();

  // Update active screen based on URL path
  useEffect(() => {
    const pathParts = pathname.split('/').filter(Boolean);
    const screenFromPath = (pathParts[pathParts.length - 1] || '') as ScreenType;

    // If we're on a valid screen route
    if (screenFromPath && Object.keys(screenComponents).includes(screenFromPath)) {
      if (activeScreen !== screenFromPath) {
        setActiveScreen(screenFromPath);
      }
    }
    // Handle the root dashboard route
    else if (
      pathname.endsWith('/dashboard') ||
      pathname.endsWith('/dashboard/') ||
      pathname === '/'
    ) {
      if (activeScreen !== 'dashboard') {
        setActiveScreen('dashboard');
      }
      // If we're at /dashboard/dashboard, redirect to /dashboard
      if (pathname.endsWith('/dashboard/dashboard')) {
        router.replace('/dashboard');
      }
    }
  }, [pathname, activeScreen, router]);

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: Home,
    },
    {
      id: 'analysis',
      title: 'Analysis',
      icon: BarChart,
    },
    {
      id: 'documents',
      title: 'Documents',
      icon: FileText,
    },
    {
      id: 'projects',
      title: 'Projects',
      icon: Folder,
    },
    {
      id: 'upload',
      title: 'Upload',
      icon: Upload,
    },
  ];

  const bottomNavItems: NavItem[] = [
    {
      id: 'settings',
      title: 'Settings',
      icon: Settings,
    },
  ];

  const handleScreenChange = (screen: ScreenType) => {
    setActiveScreen(screen);
    // Use Next.js router to update the URL
    if (screen === 'dashboard') {
      router.push('/dashboard');
    } else {
      router.push(`/dashboard/${screen}`);
    }
  };

  // Get the active screen component if it exists
  const ActiveScreenComponent = screenComponents[activeScreen];
  const showActiveScreen = ActiveScreenComponent && !children;

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        navItems={navItems}
        activeScreen={activeScreen}
        onScreenChange={handleScreenChange}
        bottomNavItems={bottomNavItems}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-muted/40 p-4 md:p-6">
          {showActiveScreen ? <ActiveScreenComponent /> : children}
        </main>
      </div>
    </div>
  );
}
