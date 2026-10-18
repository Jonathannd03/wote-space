import { NextResponse } from 'next/server';
import { verifyPassword, getSessionToken, COOKIE_NAME } from '@/lib/admin-auth';

// Simple in-memory rate limiter: max 5 attempts per IP per 15 minutes
const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

function getIp(request: Request): string | null {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip');
}

export async function POST(request: Request) {
  const ip = getIp(request);
  if (!ip) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const now = Date.now();
  const entry = attempts.get(ip);

  if (entry && now < entry.resetAt) {
    if (entry.count >= MAX_ATTEMPTS) {
      return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 });
    }
    entry.count++;
  } else {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
  }

  const { password } = await request.json();

  if (!verifyPassword(password)) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  // Clear attempts on success
  attempts.delete(ip);

  const token = getSessionToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(COOKIE_NAME);
  return response;
}
