'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { AdminLang } from '@/lib/admin-i18n';
import translations from '@/lib/admin-i18n';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState<AdminLang>('fr');

  useEffect(() => {
    const saved = document.cookie.match(/admin-lang=([^;]+)/)?.[1] as AdminLang | undefined;
    if (saved === 'en' || saved === 'fr') setLang(saved);
  }, []);

  const t = translations[lang].login;

  const toggleLang = () => {
    const next: AdminLang = lang === 'fr' ? 'en' : 'fr';
    setLang(next);
    document.cookie = `admin-lang=${next};path=/;max-age=31536000`;
  };

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
        setError(t.errorIncorrect);
      }
    } catch {
      setError(t.errorConnection);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main id="main-content" className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex justify-center mb-10">
          <Image src="/Wotespace-logo-01.png" alt="Wote Space" width={140} height={56} priority style={{ height: 'auto' }} />
        </div>

        {/* Card */}
        <div className="bg-[#111111] border border-[#1e1e1e]">
          <div className="px-8 pt-8 pb-2 border-b border-[#1e1e1e] flex items-start justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#dc2626] font-bold mb-2">{t.eyebrow}</p>
              <h1 className="text-xl font-black text-white">{t.title}</h1>
            </div>
            <button
              onClick={toggleLang}
              suppressHydrationWarning
              className="flex items-center gap-1.5 mt-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626] rounded-sm"
              aria-label="Toggle language"
            >
              <span className={`text-[11px] font-black px-1.5 py-0.5 rounded-sm transition-colors ${lang === 'fr' ? 'bg-[#dc2626] text-white' : 'text-[#555]'}`}>FR</span>
              <span className="text-[#333] text-[10px]">/</span>
              <span className={`text-[11px] font-black px-1.5 py-0.5 rounded-sm transition-colors ${lang === 'en' ? 'bg-[#dc2626] text-white' : 'text-[#555]'}`}>EN</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-8 py-7 space-y-5">
            <div>
              <label htmlFor="password" className="block text-[11px] font-bold uppercase tracking-wider text-[#555] mb-2">
                {t.passwordLabel}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoFocus
                aria-describedby={error ? 'login-error' : undefined}
                aria-invalid={!!error}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2a2a2a] text-white placeholder-[#444] text-sm focus:outline-none focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626] transition-colors"
                placeholder={t.passwordPlaceholder}
              />
            </div>

            {error && (
              <p id="login-error" role="alert" className="text-[#dc2626] text-xs border border-[#dc2626]/30 bg-[#dc2626]/10 px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-[#dc2626] hover:bg-[#b91c1c] disabled:bg-[#1e1e1e] disabled:text-[#444] text-white py-3 text-xs font-bold uppercase tracking-widest transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111]"
            >
              {loading ? t.submitting : t.submit}
            </button>
          </form>
        </div>

        <p className="text-center text-[#333] text-xs mt-6 uppercase tracking-widest">
          Wote Space · Goma, DRC
        </p>
      </div>
    </main>
  );
}
