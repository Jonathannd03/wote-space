'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        setError('Incorrect password. Please try again.');
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Image src="/Wotespace-logo-01.png" alt="Wote Space" width={160} height={64} />
        </div>
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-sm p-8">
          <h1 className="text-xl font-bold text-white mb-2">Admin Access</h1>
          <p className="text-gray-400 text-sm mb-6">Enter your password to manage the website.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoFocus
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-sm text-white focus:outline-none focus:border-[#dc2626]"
                placeholder="Enter password"
              />
            </div>

            {error && (
              <p className="text-[#dc2626] text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-[#dc2626] hover:bg-[#b91c1c] disabled:bg-[#2a2a2a] disabled:text-gray-500 text-white py-3 rounded-sm font-semibold transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
