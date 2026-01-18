'use client';

import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Navigation() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const switchLocale = (newLocale: string) => {
    const pathWithoutLocale = pathname.replace(`/${locale}`, '');
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  const navLinks = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/spaces`, label: t('spaces') },
    { href: `/${locale}/pricing`, label: locale === 'fr' ? 'Tarifs' : 'Pricing' },
    { href: `/${locale}/booking`, label: t('booking') },
    { href: `/${locale}/about`, label: t('about') },
    { href: `/${locale}/contact`, label: t('contact') },
  ];

  return (
    <nav className="bg-brand-black border-b border-brand-black-light sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-24">
          <div className="flex items-center">
            <Link href={`/${locale}`} className="flex-shrink-0 flex items-center">
              <Image
                src="/Wotespace-logo-01.png"
                alt="Wote Space"
                width={250}
                height={100}
                className="h-20 w-auto brightness-0 invert"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-300 hover:text-brand-red px-3 py-2 text-sm font-medium transition-colors uppercase tracking-wide"
              >
                {link.label}
              </Link>
            ))}

            {/* Language Switcher */}
            <div className="flex items-center space-x-2 ml-4 border-l border-brand-black-light pl-4">
              <button
                onClick={() => switchLocale('fr')}
                className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                  locale === 'fr'
                    ? 'bg-brand-red text-white'
                    : 'text-gray-300 hover:bg-brand-black-light'
                }`}
              >
                FR
              </button>
              <button
                onClick={() => switchLocale('en')}
                className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                  locale === 'en'
                    ? 'bg-brand-red text-white'
                    : 'text-gray-300 hover:bg-brand-black-light'
                }`}
              >
                EN
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-brand-red hover:bg-brand-black-light"
            >
              <span className="sr-only">Open main menu</span>
              {!mobileMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-brand-black-light">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-300 hover:text-brand-red block px-3 py-2 text-base font-medium uppercase tracking-wide"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex space-x-2 px-3 py-2">
              <button
                onClick={() => {
                  switchLocale('fr');
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                  locale === 'fr'
                    ? 'bg-brand-red text-white'
                    : 'text-gray-300 hover:bg-brand-black'
                }`}
              >
                FR
              </button>
              <button
                onClick={() => {
                  switchLocale('en');
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                  locale === 'en'
                    ? 'bg-brand-red text-white'
                    : 'text-gray-300 hover:bg-brand-black'
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
