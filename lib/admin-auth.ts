import { createHmac, timingSafeEqual } from 'crypto';

export const COOKIE_NAME = 'admin_session';

function requireEnv(name: string, fallback: string): string {
  const value = process.env[name];
  if (!value) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`${name} must be set in production`);
    }
    return fallback;
  }
  return value;
}

export function verifyPassword(input: string): boolean {
  const PASSWORD = requireEnv('ADMIN_PASSWORD', 'wote-admin-2026');
  try {
    const expected = Buffer.from(PASSWORD, 'utf8');
    const actual = Buffer.from(input, 'utf8');
    if (expected.length !== actual.length) {
      timingSafeEqual(expected, expected);
      return false;
    }
    return timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}

export function getSessionToken(): string {
  const SECRET = requireEnv('ADMIN_SECRET', 'wote-space-admin-secret-change-me');
  return createHmac('sha256', SECRET).update('admin-session').digest('hex');
}

export function verifySessionToken(token: string): boolean {
  const expected = getSessionToken();
  try {
    return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  } catch {
    return false;
  }
}
