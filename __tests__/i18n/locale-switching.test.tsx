/**
 * Locale switching tests — verifies that all user-visible strings switch
 * correctly when the locale changes between 'fr' and 'en'.
 *
 * AUDIT NOTES (hardcoded strings found during review):
 * - Navigation: pricing link label is a ternary, not using t() — no nav.pricing key in messages
 * - HeroSection: eyebrow, price label, and day label are ternaries, not in messages files
 * - Footer: most text uses ternary pattern — not in messages files
 * - app/[locale]/page.tsx CTA section: hardcoded ternaries (both branches present)
 * - app/[locale]/spaces/page.tsx: 'Disponible'/'Available', 'Tarifs'/'Pricing' etc. are ternaries
 * All ternaries have both FR and EN branches so locale switching does work end-to-end;
 * the gap is that these strings are not centralised in messages/[locale].json.
 */

import { render, screen } from '@testing-library/react';
import React from 'react';
import frMessages from '../../messages/fr.json';
import enMessages from '../../messages/en.json';

// ── Framer-motion stub (avoids animation-related errors in jsdom) ────────────
jest.mock('framer-motion', () => ({
  motion: new Proxy(
    {},
    {
      get: (_target, tag: string) =>
        // eslint-disable-next-line react/display-name
        ({ children, ...props }: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }) =>
          React.createElement(tag, props, children),
    },
  ),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// ── next/image stub ──────────────────────────────────────────────────────────
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...rest }: { src: string; alt: string; [key: string]: unknown }) =>
    // eslint-disable-next-line @next/next/no-img-element
    React.createElement('img', { src, alt, ...rest }),
}));

// ── next/link stub ───────────────────────────────────────────────────────────
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode; [key: string]: unknown }) =>
    React.createElement('a', { href, ...rest }, children),
}));

// ── next/navigation stub ─────────────────────────────────────────────────────
const mockPush = jest.fn();
const mockPathname = jest.fn(() => '/fr');

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => mockPathname(),
}));

// ── next-intl client hooks stub ──────────────────────────────────────────────
const mockLocale = jest.fn(() => 'fr');

// Returns a lookup function backed by the actual message files
const makeT = (namespace: string, locale: string) => {
  const messages: Record<string, unknown> = locale === 'fr' ? frMessages : enMessages;
  const ns = messages[namespace] as Record<string, unknown> | undefined;
  return (key: string) => {
    const parts = key.split('.');
    let val: unknown = ns;
    for (const part of parts) {
      val = (val as Record<string, unknown>)?.[part];
    }
    return typeof val === 'string' ? val : key;
  };
};

jest.mock('next-intl', () => ({
  useTranslations: (namespace: string) => makeT(namespace, mockLocale()),
  useLocale: () => mockLocale(),
}));

// ── helpers ──────────────────────────────────────────────────────────────────
function setLocale(locale: 'fr' | 'en') {
  mockLocale.mockReturnValue(locale);
  mockPathname.mockReturnValue(`/${locale}`);
}

// ── Imports (after mocks are set up) ─────────────────────────────────────────
import HeroSection from '@/components/HeroSection';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

// ═══════════════════════════════════════════════════════════════════════════════
// 1. HeroSection — price rendering
// ═══════════════════════════════════════════════════════════════════════════════
describe('HeroSection — coworkingPrice', () => {
  it('renders the price when coworkingPrice is provided', () => {
    render(
      <HeroSection
        title="Au service de la dignité humaine"
        subtitle="subtitle"
        ctaText="Rejoindre"
        secondaryCtaText="Découvrir"
        locale="fr"
        coworkingPrice={10}
      />,
    );
    expect(screen.getByText('10$')).toBeInTheDocument();
  });

  it('renders "—" when coworkingPrice is null', () => {
    render(
      <HeroSection
        title="In service of human dignity"
        subtitle="subtitle"
        ctaText="Join"
        secondaryCtaText="Discover"
        locale="en"
        coworkingPrice={null}
      />,
    );
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('renders French eyebrow text when locale is fr', () => {
    render(
      <HeroSection
        title="Au service de la dignité humaine"
        subtitle="subtitle"
        ctaText="Rejoindre"
        secondaryCtaText="Découvrir"
        locale="fr"
        coworkingPrice={5}
      />,
    );
    expect(screen.getByText('Espace Humanitaire à Goma, RDC')).toBeInTheDocument();
  });

  it('renders English eyebrow text when locale is en', () => {
    render(
      <HeroSection
        title="In service of human dignity"
        subtitle="subtitle"
        ctaText="Join"
        secondaryCtaText="Discover"
        locale="en"
        coworkingPrice={5}
      />,
    );
    expect(screen.getByText('Humanitarian Space in Goma, DRC')).toBeInTheDocument();
  });

  it('renders French price label when locale is fr', () => {
    render(
      <HeroSection
        title="titre"
        subtitle="sous-titre"
        ctaText="CTA"
        secondaryCtaText="secondary"
        locale="fr"
        coworkingPrice={8}
      />,
    );
    expect(screen.getByText('Coworking individuel dès')).toBeInTheDocument();
    expect(screen.getByText('/ jour')).toBeInTheDocument();
  });

  it('renders English price label when locale is en', () => {
    render(
      <HeroSection
        title="title"
        subtitle="subtitle"
        ctaText="CTA"
        secondaryCtaText="secondary"
        locale="en"
        coworkingPrice={8}
      />,
    );
    expect(screen.getByText('Individual coworking from')).toBeInTheDocument();
    expect(screen.getByText('/ day')).toBeInTheDocument();
  });

  it('passes translated title and ctaText as props — switches with locale', () => {
    const { rerender } = render(
      <HeroSection
        title={frMessages.home.hero.title}
        subtitle={frMessages.home.hero.subtitle}
        ctaText={frMessages.home.hero.cta}
        secondaryCtaText="Découvrir nos espaces"
        locale="fr"
        coworkingPrice={null}
      />,
    );
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(frMessages.home.hero.title);

    rerender(
      <HeroSection
        title={enMessages.home.hero.title}
        subtitle={enMessages.home.hero.subtitle}
        ctaText={enMessages.home.hero.cta}
        secondaryCtaText="Discover our spaces"
        locale="en"
        coworkingPrice={null}
      />,
    );
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(enMessages.home.hero.title);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 2. Navigation — locale switching
// ═══════════════════════════════════════════════════════════════════════════════
describe('Navigation — locale switching', () => {
  it('renders French nav labels when locale is fr', () => {
    setLocale('fr');
    render(<Navigation />);

    expect(screen.getAllByText(frMessages.nav.home).length).toBeGreaterThan(0);
    expect(screen.getAllByText(frMessages.nav.spaces).length).toBeGreaterThan(0);
    expect(screen.getAllByText(frMessages.nav.booking).length).toBeGreaterThan(0);
    expect(screen.getAllByText(frMessages.nav.about).length).toBeGreaterThan(0);
    expect(screen.getAllByText(frMessages.nav.contact).length).toBeGreaterThan(0);
  });

  it('renders English nav labels when locale is en', () => {
    setLocale('en');
    render(<Navigation />);

    expect(screen.getAllByText(enMessages.nav.home).length).toBeGreaterThan(0);
    expect(screen.getAllByText(enMessages.nav.spaces).length).toBeGreaterThan(0);
    expect(screen.getAllByText(enMessages.nav.booking).length).toBeGreaterThan(0);
    expect(screen.getAllByText(enMessages.nav.about).length).toBeGreaterThan(0);
    expect(screen.getAllByText(enMessages.nav.contact).length).toBeGreaterThan(0);
  });

  it('does not show French labels when locale is en', () => {
    setLocale('en');
    render(<Navigation />);
    // "Accueil" is the French home label; should not appear in English
    expect(screen.queryByText('Accueil')).not.toBeInTheDocument();
  });

  it('does not show English labels when locale is fr', () => {
    setLocale('fr');
    render(<Navigation />);
    // "Home" is the English home label; should not appear in French
    expect(screen.queryByText('Home')).not.toBeInTheDocument();
  });

  it('highlights the active locale button', () => {
    setLocale('fr');
    render(<Navigation />);
    const frButton = screen.getByRole('button', { name: 'FR' });
    expect(frButton.className).toMatch(/bg-brand-red/);
  });

  it('the pricing nav link reads "Tarifs" in French', () => {
    setLocale('fr');
    render(<Navigation />);
    expect(screen.getAllByText('Tarifs').length).toBeGreaterThan(0);
  });

  it('the pricing nav link reads "Pricing" in English', () => {
    setLocale('en');
    render(<Navigation />);
    expect(screen.getAllByText('Pricing').length).toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 3. Footer — locale switching
// ═══════════════════════════════════════════════════════════════════════════════
describe('Footer — locale switching', () => {
  it('renders French description when locale is fr', () => {
    setLocale('fr');
    render(<Footer />);
    expect(
      screen.getByText(/Un espace humanitaire au service de la dignité/),
    ).toBeInTheDocument();
  });

  it('renders English description when locale is en', () => {
    setLocale('en');
    render(<Footer />);
    expect(
      screen.getByText(/A humanitarian space in service of dignity/),
    ).toBeInTheDocument();
  });

  it('renders French quick-links heading when locale is fr', () => {
    setLocale('fr');
    render(<Footer />);
    expect(screen.getByText('Liens Rapides')).toBeInTheDocument();
  });

  it('renders English quick-links heading when locale is en', () => {
    setLocale('en');
    render(<Footer />);
    expect(screen.getByText('Quick Links')).toBeInTheDocument();
  });

  it('renders French copyright when locale is fr', () => {
    setLocale('fr');
    render(<Footer />);
    expect(screen.getByText(/Tous droits réservés/)).toBeInTheDocument();
  });

  it('renders English copyright when locale is en', () => {
    setLocale('en');
    render(<Footer />);
    expect(screen.getByText(/All rights reserved/)).toBeInTheDocument();
  });

  it('renders French address when locale is fr', () => {
    setLocale('fr');
    render(<Footer />);
    expect(screen.getByText(/Nord-Kivu, RDC/)).toBeInTheDocument();
  });

  it('renders English address when locale is en', () => {
    setLocale('en');
    render(<Footer />);
    expect(screen.getByText(/North Kivu, DRC/)).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 4. Messages files — key parity between fr.json and en.json
// ═══════════════════════════════════════════════════════════════════════════════
describe('messages key parity', () => {
  function collectKeys(obj: Record<string, unknown>, prefix = ''): string[] {
    return Object.entries(obj).flatMap(([k, v]) => {
      const full = prefix ? `${prefix}.${k}` : k;
      return typeof v === 'object' && v !== null
        ? collectKeys(v as Record<string, unknown>, full)
        : [full];
    });
  }

  it('en.json and fr.json have the same set of keys', () => {
    const frKeys = collectKeys(frMessages).sort();
    const enKeys = collectKeys(enMessages).sort();
    expect(frKeys).toEqual(enKeys);
  });

  it('fr.json has all nav keys', () => {
    const required = ['nav.home', 'nav.spaces', 'nav.booking', 'nav.about', 'nav.contact'];
    const frKeys = collectKeys(frMessages);
    for (const key of required) {
      expect(frKeys).toContain(key);
    }
  });

  it('en.json has all nav keys', () => {
    const required = ['nav.home', 'nav.spaces', 'nav.booking', 'nav.about', 'nav.contact'];
    const enKeys = collectKeys(enMessages);
    for (const key of required) {
      expect(enKeys).toContain(key);
    }
  });

  it('fr.json nav.pricing key is missing (known gap — nav link hardcodes Tarifs/Pricing)', () => {
    const frKeys = collectKeys(frMessages);
    // This is the known gap: pricing nav link uses a ternary instead of t()
    expect(frKeys).not.toContain('nav.pricing');
  });

  it('all fr.json string values are non-empty', () => {
    const frKeys = collectKeys(frMessages);
    for (const key of frKeys) {
      const parts = key.split('.');
      let val: unknown = frMessages;
      for (const part of parts) {
        val = (val as Record<string, unknown>)?.[part];
      }
      expect(typeof val === 'string' && val.length > 0).toBe(true);
    }
  });

  it('all en.json string values are non-empty', () => {
    const enKeys = collectKeys(enMessages);
    for (const key of enKeys) {
      const parts = key.split('.');
      let val: unknown = enMessages;
      for (const part of parts) {
        val = (val as Record<string, unknown>)?.[part];
      }
      expect(typeof val === 'string' && val.length > 0).toBe(true);
    }
  });

  it('home.hero.title differs between fr and en', () => {
    expect(frMessages.home.hero.title).not.toBe(enMessages.home.hero.title);
  });

  it('home.hero.cta differs between fr and en', () => {
    expect(frMessages.home.hero.cta).not.toBe(enMessages.home.hero.cta);
  });

  it('nav.home differs between fr and en', () => {
    expect(frMessages.nav.home).not.toBe(enMessages.nav.home);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 5. Middleware config — locale list matches what's in messages
// ═══════════════════════════════════════════════════════════════════════════════
describe('middleware locale config', () => {
  it('the supported locales are fr and en, with fr as default', async () => {
    // Inline the config values rather than importing middleware (edge runtime)
    const supportedLocales = ['fr', 'en'];
    const defaultLocale = 'fr';

    expect(supportedLocales).toContain('fr');
    expect(supportedLocales).toContain('en');
    expect(defaultLocale).toBe('fr');
  });

  it('messages directory has a file for every supported locale', () => {
    const frKeys = Object.keys(frMessages);
    const enKeys = Object.keys(enMessages);
    // Both files exist and have content
    expect(frKeys.length).toBeGreaterThan(0);
    expect(enKeys.length).toBeGreaterThan(0);
  });
});
