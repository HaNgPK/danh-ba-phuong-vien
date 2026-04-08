import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_development';
const key = new TextEncoder().encode(JWT_SECRET);

export default async function proxy(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;

  // We are accessing a protected route
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    // Verify the JWT token
    const { payload } = await jwtVerify(token, key);
    // You can do additional checks on the payload if needed
    if (payload.user !== 'admin') {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  } catch (err) {
    // Token is invalid or expired
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Allow access
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
