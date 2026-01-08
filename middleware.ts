import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Paths care NU necesită autentificare
const publicPaths = ['/login', '/'];

// Paths care necesită admin
const adminPaths = ['/admin'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware pentru static files și API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/icons') ||
    pathname.startsWith('/manifest.json') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Verifică dacă path-ul este public
  const isPublicPath = publicPaths.some(path => pathname === path || pathname.startsWith(path));
  
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Pentru rute protejate, verificăm auth în client-side
  // (localStorage nu poate fi accesat în middleware)
  // Vom folosi un cookie sau header custom
  
  const authCookie = request.cookies.get('rsq_session');
  
  if (!authCookie) {
    // Redirect la login dacă nu există session
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verificare admin paths
  const isAdminPath = adminPaths.some(path => pathname.startsWith(path));
  
  if (isAdminPath) {
    const isAdmin = request.cookies.get('rsq_is_admin')?.value === 'true';
    
    if (!isAdmin) {
      // Redirect la dashboard dacă nu e admin
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)',
  ],
};
