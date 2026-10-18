'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAdminLang } from './AdminLangProvider';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { lang, t, toggle } = useAdminLang();

  const nav = [
    {
      href: '/admin',
      exact: true,
      label: t.nav.dashboard,
      icon: (
        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      href: '/admin/events',
      label: t.nav.events,
      icon: (
        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      href: '/admin/partners',
      label: t.nav.partners,
      icon: (
        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      href: '/admin/pricing',
      label: t.nav.pricing,
      icon: (
        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      href: '/admin/contact',
      label: t.nav.contact,
      icon: (
        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
    },
  ];

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + '/');

  const logout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
  };

  return (
    <aside className="w-52 flex-shrink-0 bg-[#0a0a0a] flex flex-col h-screen sticky top-0 border-r border-[#1a1a1a]">
      {/* Logo */}
      <div className="px-6 pt-6 pb-5 border-b border-[#1a1a1a]">
        <Image
          src="/Wotespace-logo-01.png"
          alt="Wote Space"
          width={110}
          height={44}
          style={{ height: 'auto' }}
        />
        <div className="flex items-center gap-2 mt-3">
          <div className="h-px flex-1 bg-[#1e1e1e]" />
          <span className="text-[9px] uppercase tracking-[0.25em] text-[#dc2626] font-bold">Admin</span>
          <div className="h-px flex-1 bg-[#1e1e1e]" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 overflow-y-auto" aria-label="Admin navigation">
        {nav.map(item => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 px-5 py-2.5 text-[13px] font-medium transition-all border-l-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#dc2626] ${
                active
                  ? 'border-[#dc2626] bg-[#161616] text-white'
                  : 'border-transparent text-[#666] hover:text-[#aaa] hover:bg-[#0f0f0f]'
              }`}
            >
              <span className={active ? 'text-[#dc2626]' : 'text-[#444] group-hover:text-[#666] transition-colors'}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-[#1a1a1a] space-y-3">
        {/* Language toggle */}
        <button
          onClick={toggle}
          suppressHydrationWarning
          aria-label="Toggle language"
          className="flex items-center gap-2 w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626] rounded-sm"
        >
          <span className={`text-[11px] font-black px-1.5 py-0.5 rounded-sm transition-colors ${lang === 'fr' ? 'bg-[#dc2626] text-white' : 'text-[#555] hover:text-[#888]'}`}>FR</span>
          <span className="text-[#333] text-[10px]">/</span>
          <span className={`text-[11px] font-black px-1.5 py-0.5 rounded-sm transition-colors ${lang === 'en' ? 'bg-[#dc2626] text-white' : 'text-[#555] hover:text-[#888]'}`}>EN</span>
        </button>

        {/* Sign out */}
        <button
          onClick={logout}
          suppressHydrationWarning
          className="flex items-center gap-2 text-[12px] text-[#555] hover:text-[#aaa] transition-colors w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626] rounded-sm"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {t.nav.signOut}
        </button>
      </div>
    </aside>
  );
}
