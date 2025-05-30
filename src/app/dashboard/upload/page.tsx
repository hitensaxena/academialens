'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UploadScreen from '../screens/upload';

export default function UploadPage() {
  const router = useRouter();

  // Ensure the URL is properly set
  useEffect(() => {
    const path = window.location.pathname;
    if (!path.endsWith('/upload')) {
      router.replace('/dashboard/upload');
    }
  }, [router]);

  return <UploadScreen />;
}
