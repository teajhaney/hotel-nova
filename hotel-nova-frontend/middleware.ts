import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Note: Adjust the cookie names based on the actual backend implementation.
  // Using 'jwt' or 'accessToken' as common defaults, and a separate 'role' cookie.
  const token = request.cookies.get('accessToken') || request.cookies.get('jwt');
  const role = request.cookies.get('role')?.value;

  // 1. Guest Auth Routes (public login/signup)
  if (pathname === '/login' || pathname === '/signup') {
    if (token && role === 'GUEST') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // 2. Admin Auth Routes (/admin/login, /admin/signup)
  if (pathname === '/admin/login' || pathname === '/admin/signup') {
    if (token && role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin/overview', request.url));
    }
  }

  // 3. Admin Protected Routes (/admin/* except auth)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login' && pathname !== '/admin/signup') {
    if (!token || role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // 4. Guest Protected Routes (/dashboard)
  if (pathname.startsWith('/dashboard')) {
    if (!token || role !== 'GUEST') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 5. Booking payment and confirmation require guest auth
  // TODO: Re-enable once login flow with redirect-back is implemented.
  // When re-enabling, the login form must read the `redirect` search param
  // and navigate there on successful login instead of going to '/'.
  // if (pathname === '/book/payment' || pathname === '/book/confirmation') {
  //   if (!token || role !== 'GUEST') {
  //     const loginUrl = new URL('/login', request.url);
  //     loginUrl.searchParams.set('redirect', pathname);
  //     return NextResponse.redirect(loginUrl);
  //   }
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
