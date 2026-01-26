import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getEventById, getEvents, getEventDescription, getEventName } from '@/lib/events';
import EventGallery from '@/components/EventGallery';

interface EventPageProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

export async function generateStaticParams() {
  const events = getEvents();
  const locales = ['en', 'fr'];

  const params: { locale: string; id: string }[] = [];

  for (const locale of locales) {
    for (const event of events) {
      params.push({
        locale,
        id: event.id,
      });
    }
  }

  return params;
}

export default async function EventPage({ params }: EventPageProps) {
  const { id, locale } = await params;
  const t = await getTranslations('events');
  const tCommon = await getTranslations('common');

  const event = getEventById(id);

  if (!event) {
    notFound();
  }

  const description = getEventDescription(id, locale as 'en' | 'fr');
  const eventName = getEventName(id, locale as 'en' | 'fr');

  return (
    <div className="bg-brand-black min-h-screen">
      {/* Header Section */}
      <section className="relative py-24 bg-brand-black-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center text-brand-red hover:text-brand-red-dark mb-8 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            {tCommon('back')}
          </Link>

          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
              {eventName}
            </h1>
            <div className="h-1 w-32 bg-brand-red mb-8 mx-auto"></div>
            <p className="text-xl text-gray-300 mb-4">{event.displayDate}</p>
            <p className="text-gray-400">
              {event.totalImages} {t('images')}
            </p>
          </div>
        </div>
      </section>

      {/* Description Section */}
      <section className="py-16 bg-brand-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">
            {t('description')}
          </h2>
          <div className="h-1 w-24 bg-brand-red mb-8"></div>
          <p className="text-lg text-gray-300 leading-relaxed">
            {description}
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 bg-brand-black-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            {t('gallery')}
          </h2>
          <div className="h-1 w-24 bg-brand-red mb-12 mx-auto"></div>
          <EventGallery images={event.images} eventName={event.name} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-brand-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            {locale === 'fr'
              ? 'Intéressé par nos espaces ?'
              : 'Interested in our spaces?'}
          </h2>
          <div className="h-1 w-24 bg-brand-red mb-8 mx-auto"></div>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            {locale === 'fr'
              ? 'Découvrez nos configurations et réservez votre espace'
              : 'Discover our setups and book your space'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/spaces`}
              className="inline-block bg-brand-red text-white px-10 py-4 rounded-sm font-bold hover:bg-brand-red-dark transition-all transform hover:scale-105 uppercase tracking-wider"
            >
              {locale === 'fr' ? 'Voir les configurations' : 'View setups'}
            </Link>
            <Link
              href={`/${locale}/booking`}
              className="inline-block bg-transparent text-white border-2 border-brand-red px-10 py-4 rounded-sm font-bold hover:bg-brand-red hover:border-brand-red transition-all uppercase tracking-wider"
            >
              {locale === 'fr' ? 'Réserver' : 'Book now'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
