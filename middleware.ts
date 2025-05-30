import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// List of public paths that don't require authentication
const publicPaths = [
  '/',
  '/auth/login',
  '/auth/register',
  '/auth/error',
  '/unauthorized',
  '/_next',
  '/favicon.ico',
  '/api/auth',
  '/images',
];

// List of API routes that don't require authentication
const publicApiPaths = ['/api/auth', '/api/health', '/api/public'];

// List of admin paths that require admin role
const adminPaths = ['/admin', '/api/admin'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log('Middleware - Path:', pathname);

  const isPublicPath = publicPaths.some(path => {
    const isMatch = pathname === path || pathname.startsWith(`${path}/`);
    if (isMatch) {
      console.log('Path is public:', path);
    }
    return isMatch;
  });

  // Allow public paths
  if (isPublicPath) {
    console.log('Allowing public path:', pathname);
    return NextResponse.next();
  }

  // Skip middleware for static files and API routes that don't need auth
  if (
    pathname.match(/\.(css|js|png|jpg|jpeg|svg|gif|ico|woff|woff2|ttf|eot)$/) ||
    (pathname.startsWith('/api/') && publicApiPaths.some(apiPath => pathname.startsWith(apiPath)))
  ) {
    return NextResponse.next();
  }

  // Get the session token
  console.log('Checking session for path:', pathname);
  const session = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  console.log('Session data:', session ? 'Authenticated' : 'No session');

  // If no session and trying to access protected route, redirect to login
  if (!session) {
    console.log('No session found, redirecting to login');
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('callbackUrl', encodeURI(request.url));
    console.log('Redirecting to:', loginUrl.toString());
    return NextResponse.redirect(loginUrl);
  }

  // Check if the path requires admin role
  const isAdminPath = adminPaths.some(path => pathname === path || pathname.startsWith(`${path}/`));

  // If user is not an admin but trying to access admin path
  if (isAdminPath && session.role !== 'admin') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  // If user is authenticated but tries to access auth pages, redirect to dashboard
  if (pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Add security headers to all responses
  const response = NextResponse.next();

  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // CSP Header - adjust according to your needs
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    "connect-src 'self'",
    "frame-ancestors 'none'",
  ].join('; ');

  response.headers.set('Content-Security-Policy', csp);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes) - handled separately in the middleware
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
