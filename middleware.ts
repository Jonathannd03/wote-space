import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware({
  locales: ['fr', 'en'],
  defaultLocale: 'fr',
  localePrefix: 'always',
});

const SECRET = process.env.ADMIN_SECRET || 'wote-space-admin-secret-change-me';
const COOKIE_NAME = 'admin_session';

async function verifyToken(token: string): Promise<boolean> {
  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw', encoder.encode(SECRET),
      { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']
    );
    const tokenBytes = Uint8Array.from(
      token.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))
    );
    return await crypto.subtle.verify('HMAC', key, tokenBytes, encoder.encode('admin-session'));
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    // Login page and auth API are always accessible
    if (pathname === '/admin/login' || pathname.startsWith('/api/admin/auth')) {
      return NextResponse.next();
    }

    const sessionCookie = request.cookies.get(COOKIE_NAME)?.value;
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    if (!(await verifyToken(sessionCookie))) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/', '/(fr|en)/:path*', '/admin', '/admin/:path*', '/api/admin/:path*'],
};
