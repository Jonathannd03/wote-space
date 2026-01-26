import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import HeroSection from '@/components/HeroSection';
import EventsCarousel from '@/components/EventsCarousel';
import { getEvents, getEventShortDescription } from '@/lib/events';

export default function HomePage() {
  const t = useTranslations('home');
  const tEvents = useTranslations('events');
  const locale = useLocale();
  const events = getEvents();

  const features = [
    {
      icon: '📶',
      title: t('features.wifi.title'),
      description: t('features.wifi.description'),
    },
    {
      icon: '⏰',
      title: t('features.flexible.title'),
      description: t('features.flexible.description'),
    },
    {
      icon: '✨',
      title: t('features.modern.title'),
      description: t('features.modern.description'),
    },
    {
      icon: '📍',
      title: t('features.location.title'),
      description: t('features.location.description'),
    },
  ];

  return (
    <div className="bg-brand-black">
      {/* Hero Section */}
      <HeroSection
        title={t('hero.title')}
        subtitle={t('hero.subtitle')}
        ctaText={t('hero.cta')}
        secondaryCtaText={locale === 'fr' ? 'Voir les Espaces' : 'View Spaces'}
        locale={locale}
      />

      {/* Features Section */}
      <section className="py-20 bg-brand-black-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-white">
            {t('features.title')}
          </h2>
          <div className="h-1 w-24 bg-brand-red mb-16 mx-auto"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-8 bg-brand-black rounded-sm border border-brand-black-light hover:border-brand-red transition-all group"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-brand-red transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events Section */}
      {events.length > 0 && (
        <section className="py-20 bg-brand-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-white">
              {tEvents('title')}
            </h2>
            <p className="text-center text-gray-400 mb-8">
              {tEvents('subtitle')}
            </p>
            <div className="h-1 w-24 bg-brand-red mb-16 mx-auto"></div>

            <EventsCarousel
              events={events.map(event => ({
                ...event,
                shortDescription: getEventShortDescription(event.id, locale as 'en' | 'fr')
              }))}
              locale={locale}
            />
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-brand-black py-24 border-t border-brand-black-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4 text-white">
            {locale === 'fr' ? 'Prêt à commencer ?' : 'Ready to get started?'}
          </h2>
          <div className="h-1 w-24 bg-brand-red mb-8 mx-auto"></div>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            {locale === 'fr'
              ? 'Découvrez nos espaces et réservez dès maintenant'
              : 'Discover our spaces and book now'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/spaces`}
              className="inline-block bg-brand-red text-white px-10 py-4 rounded-sm font-semibold hover:bg-brand-red-dark transition-all transform hover:scale-105 uppercase tracking-wider"
            >
              {locale === 'fr' ? 'Voir les espaces' : 'View spaces'}
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="inline-block bg-transparent text-white border-2 border-brand-red px-10 py-4 rounded-sm font-semibold hover:bg-brand-red hover:border-brand-red transition-all uppercase tracking-wider"
            >
              {locale === 'fr' ? 'Nous contacter' : 'Contact us'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
