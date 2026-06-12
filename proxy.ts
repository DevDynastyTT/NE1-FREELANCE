import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJwt } from '@/lib/auth';

const PROTECTED_PAGES = [
  '/jobs/create',
  '/jobs/checkout',
  '/inbox',
  '/auth/profile',
  '/auth/admin',
  '/auth/messages',
];

const PROTECTED_API = [
  '/api/auth/createJob',
  '/api/auth/updateUser',
  '/api/auth/updateProfile',
  '/api/auth/updateRatings',
  '/api/auth/rateFreelancer',
  '/api/auth/reportJob',
  '/api/auth/makePayment',
  '/api/auth/messages/send',
  '/api/auth/logout',
  '/api/auth/createService',
  '/api/auth/updateServices',
  '/api/auth/deleteServices',
  '/api/auth/updateAbout',
];

function isProtectedPath(pathname: string, prefixes: string[]): boolean {
  return prefixes.some((prefix) => pathname.startsWith(prefix));
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get('ne1_session')?.value;

  if (!token) {
    if (isProtectedPath(pathname, PROTECTED_PAGES)) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    if (isProtectedPath(pathname, PROTECTED_API)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.next();
  }

  const payload = verifyJwt(token);

  if (!payload) {
    const response = isProtectedPath(pathname, PROTECTED_PAGES)
      ? NextResponse.redirect(new URL('/auth/login', request.url))
      : NextResponse.next();

    response.cookies.set('ne1_session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });

    return response;
  }

  if (pathname.startsWith('/auth/admin') && !payload.isStaff) {
    return NextResponse.redirect(new URL('/jobs', request.url));
  }

  if (pathname.startsWith('/api/auth/')) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.userID);
    requestHeaders.set('x-user-email', payload.email);
    requestHeaders.set('x-user-isStaff', String(payload.isStaff));

    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
