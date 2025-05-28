import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const publicPaths = ['/auth/login', '/auth/register', '/'];

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Allow all API routes and static files
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon.ico')
  ) {
    return NextResponse.next();
  }

  const token = await getToken({ req: request });
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
  let callbackUrl = searchParams.get('callbackUrl');

  // --- Sanitize callbackUrl ---
  function isUnsafe(url: string | null) {
    if (!url) return false;
    try {
      const decoded = decodeURIComponent(url);
      // Never allow callbackUrl to be an /auth/ route or contain another callbackUrl param
      if (decoded.startsWith('/auth/') || decoded.includes('callbackUrl=')) {
        return true;
      }
    } catch (e) {
      return true;
    }
    return false;
  }
  // DEBUG LOGGING

  // HARD BLOCK: If on /auth/login and callbackUrl is present, always redirect to safe default
  if (pathname.startsWith('/auth/login') && searchParams.get('callbackUrl')) {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // If user is not authenticated and trying to access a protected route
  if (!token && !isPublicPath) {
    const loginUrl = new URL('/auth/login', request.url);
    // Only set callbackUrl if we're not already on the login page and there isn't already a callbackUrl
    if (!pathname.startsWith('/auth/') && !callbackUrl) {
      loginUrl.searchParams.set('callbackUrl', pathname);
      console.log('MIDDLEWARE: redirecting unauthenticated to', loginUrl.toString());
    } else if (callbackUrl) {
      // If callbackUrl is unsafe, remove it and redirect to root
      if (isUnsafe(callbackUrl)) {
        loginUrl.searchParams.delete('callbackUrl');
        return NextResponse.redirect(new URL('/', request.url));
      } else {
        loginUrl.searchParams.set('callbackUrl', decodeURIComponent(callbackUrl));
      }
    }
    return NextResponse.redirect(loginUrl);
  }

  // If user is authenticated and trying to access auth routes
  if (token && isPublicPath) {
    // If there's a callbackUrl and it's safe, use it
    if (callbackUrl && !isUnsafe(callbackUrl)) {
      return NextResponse.redirect(new URL(decodeURIComponent(callbackUrl), request.url));
    }
    // Otherwise, redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
