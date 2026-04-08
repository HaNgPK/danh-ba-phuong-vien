import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

// Secret key for JWT signing
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_development';
const key = new TextEncoder().encode(JWT_SECRET);

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // Verification
    if (username === 'admin' && password === 'sondong123@') {
      // Create JWT token using jose
      const token = await new SignJWT({ user: 'admin', role: 'system_admin' })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h') // 24 hours expiry
        .sign(key);

      // Create a response and set cookie
      const response = NextResponse.json({ success: true, message: 'Đăng nhập thành công' }, { status: 200 });
      
      response.cookies.set('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24, // 24 hours in seconds
      });

      return response;
    }

    return NextResponse.json({ success: false, message: 'Tài khoản hoặc mật khẩu không chính xác' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Đã xảy ra lỗi hệ thống' }, { status: 500 });
  }
}
