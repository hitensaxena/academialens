'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get and validate callback URL
  const getSafeCallbackUrl = () => {
    try {
      const url = searchParams.get('callbackUrl') || '/dashboard';
      // Prevent open redirects
      if (url.startsWith('http') || url.startsWith('//')) {
        return '/dashboard';
      }
      // Prevent auth loops
      if (url.startsWith('/auth/')) {
        return '/dashboard';
      }
      return url;
    } catch {
      return '/dashboard';
    }
  };

  const callbackUrl = getSafeCallbackUrl();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // No need for authenticated redirect here - handled by AuthWrapper

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: form.email,
        password: form.password,
      });

      if (res?.error) {
        setError(res.error);
      } else if (res?.ok) {
        // Ensure we're not redirecting to an auth route
        let targetUrl = callbackUrl;
        try {
          const decoded = decodeURIComponent(targetUrl);
          if (decoded.startsWith('/auth/') || !decoded.startsWith('/')) {
            targetUrl = '/dashboard';
          }
        } catch {
          targetUrl = '/dashboard';
        }
        router.push(targetUrl);
      }
    } catch {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            className={`w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${error ? 'border-red-500' : ''}`}
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            required
            aria-invalid={!!error}
            aria-describedby="email-error"
            autoComplete="email"
          />
          {form.email && !/^\S+@\S+\.\S+$/.test(form.email) && (
            <div id="email-error" className="text-xs text-red-600 mt-1">
              Please enter a valid email address.
            </div>
          )}
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            className={`w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${error ? 'border-red-500' : ''}`}
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            required
            minLength={6}
            aria-invalid={!!error}
            aria-describedby="password-error"
            autoComplete="current-password"
          />
          {form.password && form.password.length < 6 && (
            <div id="password-error" className="text-xs text-red-600 mt-1">
              Password must be at least 6 characters.
            </div>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
          disabled={
            loading || !form.email || !/^\S+@\S+\.\S+$/.test(form.email) || form.password.length < 6
          }
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <button
        className="mt-4 w-full border py-2 rounded flex items-center justify-center gap-2"
        onClick={() => signIn('google', { callbackUrl: '/dashboard/dashboard' })}
      >
        <svg width="20" height="20" viewBox="0 0 48 48">
          <g>
            <path
              fill="#4285F4"
              d="M44.5 20H24v8.5h11.7C34.8 33.1 30.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.5 5.1 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 19.5-7.6 21-17.5 0-1.7-.2-3.3-.5-4.5z"
            />
            <path
              fill="#34A853"
              d="M6.3 14.7l7 5.1C15.6 16.1 19.5 13 24 13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.5 5.1 29.6 3 24 3 15.5 3 8.1 8.7 6.3 14.7z"
            />
            <path
              fill="#FBBC05"
              d="M24 45c5.5 0 10.4-1.8 14.2-4.8l-6.6-5.4C29.8 36.6 27 37.5 24 37.5c-6.2 0-10.8-2.9-11.7-7.5l-7-5.4C5.9 39.3 14.1 45 24 45z"
            />
            <path
              fill="#EA4335"
              d="M44.5 20H24v8.5h11.7C34.8 33.1 30.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.5 5.1 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 19.5-7.6 21-17.5 0-1.7-.2-3.3-.5-4.5z"
            />
          </g>
        </svg>
        Sign in with Google
      </button>
      {error && (
        <div
          className="mt-4 text-center text-sm bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded"
          role="alert"
        >
          {error}
        </div>
      )}
    </div>
  );
}
