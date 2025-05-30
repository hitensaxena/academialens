'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { ProtectedRoute } from '@/components/auth/protected-route';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <ProtectedRoute>
        <MainLayout>{children}</MainLayout>
      </ProtectedRoute>
    </div>
  );
}
