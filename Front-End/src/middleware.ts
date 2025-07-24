// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose'

export async function middleware(request: NextRequest) {
  let token = request.cookies.get('token');
  const secret = new TextEncoder().encode('super_secret_key');

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    await jwtVerify(token.value, secret);
  } catch (err) {
    console.error('Invalid token:', err);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/dashboard', '/appointments', '/patients'],
};
