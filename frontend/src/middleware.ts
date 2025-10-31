import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only guard nested admin routes like /admin/..., not the root /admin
  const isNestedAdmin = pathname.startsWith('/admin/') && pathname !== '/admin';

  if (!isNestedAdmin) {
    return NextResponse.next();
  }

  const cookieToken = request.cookies.get('admin_token')?.value || '';
  const expected = process.env.ADMIN_TOKEN || '';

  if (!cookieToken || !expected || cookieToken !== expected) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};


