'use client';
import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  let callbackUrl = searchParams.get('callbackUrl') || '/dashboard/dashboard';
  const { status } = useSession();

  // Harden callbackUrl
  function isUnsafe(url: string | null) {
    if (!url) return false;
    try {
      const decoded = decodeURIComponent(url);
      if (decoded.startsWith('/auth/') || decoded.includes('callbackUrl=')) {
        return true;
      }
    } catch {
      return true;
    }
    return false;
  }
  if (isUnsafe(callbackUrl)) {
    callbackUrl = '/dashboard/dashboard';
  } else {
    try {
      callbackUrl = decodeURIComponent(callbackUrl);
    } catch {
      callbackUrl = '/dashboard/dashboard';
    }
  }

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      router.push(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  if (status === 'loading' || status === 'authenticated') {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        // Auto-login after successful registration
        const loginRes = await signIn('credentials', {
          redirect: false,
          email: form.email,
          password: form.password,
        });

        if (loginRes?.error) {
          setMessage('Registration successful! Please login.');
        } else {
          // Ensure we're not redirecting to an auth route
          let targetUrl = callbackUrl;
          try {
            const decoded = decodeURIComponent(targetUrl);
            if (decoded.startsWith('/auth/')) {
              targetUrl = '/dashboard/dashboard';
            }
          } catch {
            targetUrl = '/dashboard/dashboard';
          }
          router.push(targetUrl);
        }
      } else {
        setMessage(data.error || 'Registration failed.');
      }
    } catch {
      setMessage('An error occurred during registration');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Name"
            className={`w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${message && message.toLowerCase().includes('error') ? 'border-red-500' : ''}`}
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            required
            aria-invalid={!form.name}
            aria-describedby="name-error"
            autoComplete="name"
          />
          {form.name === '' && (
            <div id="name-error" className="text-xs text-red-600 mt-1">
              Name is required.
            </div>
          )}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            className={`w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${message && message.toLowerCase().includes('error') ? 'border-red-500' : ''}`}
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            required
            aria-invalid={!/^\S+@\S+\.\S+$/.test(form.email)}
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
            className={`w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${message && message.toLowerCase().includes('error') ? 'border-red-500' : ''}`}
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            required
            minLength={6}
            aria-invalid={form.password.length < 6}
            aria-describedby="password-error"
            autoComplete="new-password"
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
            loading || !form.name || !/^\S+@\S+\.\S+$/.test(form.email) || form.password.length < 6
          }
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      {message && (
        <div
          className={`mt-4 text-center text-sm px-4 py-2 rounded ${message.toLowerCase().includes('success') ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-red-100 border border-red-400 text-red-700'}`}
          role="alert"
        >
          {message}
        </div>
      )}
    </div>
  );
}
