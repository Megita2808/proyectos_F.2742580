import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = request.nextUrl.pathname;

  const isLoggedIn = request.cookies.get('isLoggedIn')?.value === 'true';
  const rol = request.cookies.get('rol')?.value;

  if (pathname.startsWith('/administrador')) {
    if (!isLoggedIn || !(rol === 'administrador' || rol === 'empleado')) {
      url.pathname = '/cliente/principal';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/administrador/:path*'],
};
