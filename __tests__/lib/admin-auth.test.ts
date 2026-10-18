import { verifyPassword, getSessionToken, verifySessionToken, COOKIE_NAME } from '@/lib/admin-auth';

// NODE_ENV is 'test' so the production guard does not run

describe('admin-auth', () => {
  describe('verifyPassword', () => {
    it('accepts the correct default password', () => {
      expect(verifyPassword('wote-admin-2026')).toBe(true);
    });

    it('rejects an incorrect password', () => {
      expect(verifyPassword('wrong-password')).toBe(false);
    });

    it('rejects an empty string', () => {
      expect(verifyPassword('')).toBe(false);
    });

    it('is case-sensitive', () => {
      expect(verifyPassword('WOTE-ADMIN-2026')).toBe(false);
    });

    it('rejects a password with leading whitespace', () => {
      expect(verifyPassword(' wote-admin-2026')).toBe(false);
    });

    it('rejects a password with trailing whitespace', () => {
      expect(verifyPassword('wote-admin-2026 ')).toBe(false);
    });
  });

  describe('getSessionToken', () => {
    it('returns a 64-character hex string (SHA-256 HMAC)', () => {
      expect(getSessionToken()).toMatch(/^[0-9a-f]{64}$/);
    });

    it('is deterministic — same secret always produces the same token', () => {
      expect(getSessionToken()).toBe(getSessionToken());
    });
  });

  describe('verifySessionToken', () => {
    it('accepts a token produced by getSessionToken', () => {
      const token = getSessionToken();
      expect(verifySessionToken(token)).toBe(true);
    });

    it('rejects a random string', () => {
      expect(verifySessionToken('not-a-real-token')).toBe(false);
    });

    it('rejects an empty string', () => {
      expect(verifySessionToken('')).toBe(false);
    });

    it('rejects a token with a one-character mutation', () => {
      const token = getSessionToken();
      const last = token.slice(-1);
      const tampered = token.slice(0, -1) + (last === 'a' ? 'b' : 'a');
      expect(verifySessionToken(tampered)).toBe(false);
    });

    it('rejects a token that is one character short', () => {
      const token = getSessionToken();
      expect(verifySessionToken(token.slice(0, -1))).toBe(false);
    });
  });

  it('exports COOKIE_NAME as admin_session', () => {
    expect(COOKIE_NAME).toBe('admin_session');
  });
});
