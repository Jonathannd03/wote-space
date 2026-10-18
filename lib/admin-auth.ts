import { createHmac, timingSafeEqual } from 'crypto';

if (process.env.NODE_ENV === 'production') {
  if (!process.env.ADMIN_SECRET || !process.env.ADMIN_PASSWORD) {
    throw new Error('ADMIN_SECRET and ADMIN_PASSWORD must be set in production');
  }
}

const SECRET = process.env.ADMIN_SECRET || 'wote-space-admin-secret-change-me';
const PASSWORD = process.env.ADMIN_PASSWORD || 'wote-admin-2026';
export const COOKIE_NAME = 'admin_session';

export function verifyPassword(input: string): boolean {
  try {
    const expected = Buffer.from(PASSWORD, 'utf8');
    const actual = Buffer.from(input, 'utf8');
    if (expected.length !== actual.length) {
      // Still run the comparison to prevent timing attacks
      timingSafeEqual(expected, expected);
      return false;
    }
    return timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}

export function getSessionToken(): string {
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
