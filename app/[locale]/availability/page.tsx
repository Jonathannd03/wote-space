import { getTranslations } from 'next-intl/server';
import AvailabilityCalendar from '@/components/AvailabilityCalendar';
import Link from 'next/link';

interface AvailabilityPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function AvailabilityPage({ params }: AvailabilityPageProps) {
  const { locale } = await params;
  const t = await getTranslations('availability');
  const tCommon = await getTranslations('common');

  return (
    <div className="min-h-screen bg-brand-black py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">{t('title')}</h1>
          <div className="h-1 w-24 bg-brand-red mb-6 mx-auto"></div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <AvailabilityCalendar locale={locale as 'en' | 'fr'} />
          </div>

          {/* Info Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-brand-black-light border border-brand-black-light rounded-sm p-6 sticky top-24">
              <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-wider">
                {locale === 'fr' ? 'Informations' : 'Information'}
              </h3>

              <div className="space-y-4 text-sm text-gray-300">
                <div>
                  <h4 className="font-semibold text-white mb-2">
                    {locale === 'fr' ? 'Comment réserver?' : 'How to book?'}
                  </h4>
                  <p className="leading-relaxed">
                    {locale === 'fr'
                      ? 'Sélectionnez une date disponible dans le calendrier et cliquez sur "Réserver maintenant" pour commencer votre réservation.'
                      : 'Select an available date on the calendar and click "Book Now" to start your reservation.'}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-2">
                    {locale === 'fr' ? 'Horaires d\'ouverture' : 'Opening Hours'}
                  </h4>
                  <p className="leading-relaxed">
                    {locale === 'fr' ? 'Du lundi au dimanche' : 'Monday to Sunday'}
                    <br />
                    9:00 - 21:00
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-2">
                    {locale === 'fr' ? 'Durée minimale' : 'Minimum Duration'}
                  </h4>
                  <p className="leading-relaxed">
                    {locale === 'fr'
                      ? '2 heures minimum par réservation'
                      : '2 hours minimum per booking'}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-2">
                    {locale === 'fr' ? 'Annulation' : 'Cancellation'}
                  </h4>
                  <p className="leading-relaxed">
                    {locale === 'fr'
                      ? 'Annulation gratuite jusqu\'à 24h avant la réservation'
                      : 'Free cancellation up to 24h before booking'}
                  </p>
                </div>
              </div>

              <Link
                href={`/${locale}/booking`}
                className="mt-6 w-full block text-center bg-brand-red text-white px-6 py-4 rounded-sm font-bold hover:bg-brand-red-dark transition-colors uppercase tracking-wider"
              >
                {locale === 'fr' ? 'Réserver maintenant' : 'Book Now'}
              </Link>

              <Link
                href={`/${locale}/contact`}
                className="mt-3 w-full block text-center bg-brand-black border-2 border-brand-red text-white px-6 py-3 rounded-sm font-semibold hover:bg-brand-red transition-colors"
              >
                {locale === 'fr' ? 'Nous contacter' : 'Contact Us'}
              </Link>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 bg-brand-black-light border border-brand-black-light rounded-sm p-8">
          <h3 className="text-2xl font-bold text-white mb-4">
            {locale === 'fr'
              ? 'À propos de notre système de réservation'
              : 'About Our Booking System'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
            <div>
              <h4 className="font-semibold text-white mb-2">
                {locale === 'fr' ? 'Salle unique, configurations multiples' : 'One Room, Multiple Setups'}
              </h4>
              <p className="text-sm leading-relaxed">
                {locale === 'fr'
                  ? 'Nous avons une grande salle polyvalente qui peut être configurée de différentes manières (Setup S, M, L, XL) selon vos besoins. Chaque réservation occupe toute la salle.'
                  : 'We have one large versatile room that can be configured in different ways (Setup S, M, L, XL) according to your needs. Each booking occupies the entire room.'}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">
                {locale === 'fr' ? 'Disponibilité en temps réel' : 'Real-Time Availability'}
              </h4>
              <p className="text-sm leading-relaxed">
                {locale === 'fr'
                  ? 'Notre calendrier affiche la disponibilité en temps réel. Les dates grisées sont déjà réservées ou dans le passé.'
                  : 'Our calendar shows real-time availability. Grayed-out dates are already booked or in the past.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
