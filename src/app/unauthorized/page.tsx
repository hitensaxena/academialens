'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">403</h1>
          <h2 className="text-2xl font-semibold">Unauthorized Access</h2>
          <p className="text-muted-foreground">You don't have permission to access this page.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" onClick={() => router.back()} className="w-full sm:w-auto">
            Go Back
          </Button>
          <Button onClick={() => router.push('/dashboard')} className="w-full sm:w-auto">
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
