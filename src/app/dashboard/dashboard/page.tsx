'use client';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  if (status === 'loading' || status === 'unauthenticated') {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }
  return (
    <div className="max-w-2xl mx-auto mt-16 p-6 bg-white rounded shadow">
      <h1 className="text-3xl font-bold mb-2">Welcome to AcademiaLens!</h1>
      <p className="mb-4">
        This is your dashboard. Here you can manage projects, documents, and analyses.
      </p>
      <div className="mb-4 p-4 bg-gray-50 rounded">
        <div className="font-semibold">Logged in as:</div>
        <div>Name: {session?.user?.name || 'N/A'}</div>
        <div>Email: {session?.user?.email || 'N/A'}</div>
      </div>
      <button
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        onClick={() => signOut({ callbackUrl: '/auth/login' })}
      >
        Log out
      </button>
    </div>
  );
}
