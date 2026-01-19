import { getTranslations, getLocale } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import SpacesGallery from '@/components/SpacesGallery';
import { MOCK_SPACES } from '@/lib/mock-data';

export default async function SpacesPage() {
  const t = await getTranslations('spaces');
  const locale = await getLocale();

  // Using mock data - replace with database query when DATABASE_URL is configured
  const spaces = MOCK_SPACES.filter(space => space.available).sort((a, b) => a.capacity - b.capacity);

  const premisesImages = [
    '/premises/IMG_2776.jpg',
    '/premises/IMG_2780.jpg',
    '/premises/IMG_2783.jpg',
    '/premises/IMG_2787.jpg',
    '/premises/IMG_2789.jpg',
    '/premises/IMG_2792.jpg',
    '/premises/IMG_2794.jpg',
    '/premises/IMG_2797.jpg',
    '/premises/IMG_2800.jpg',
    '/premises/IMG_2801.jpg',
    '/premises/IMG_2805.jpg',
    '/premises/IMG_2815.jpg',
    '/premises/IMG_2820.jpg',
  ];

  const spaceImages: Record<number, string> = {
    0: '/premises/IMG_2820.jpg',
    1: '/premises/IMG_2805.jpg',
    2: '/premises/IMG_2800.jpg',
    3: '/premises/IMG_2797.jpg',
    4: '/premises/IMG_2794.jpg',
  };

  return (
    <div className="py-16 bg-brand-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">{t('title')}</h1>
          <div className="h-1 w-24 bg-brand-red mb-6 mx-auto"></div>
          <p className="text-xl text-gray-300">{t('subtitle')}</p>
        </div>

        {/* Spaces Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {spaces.map((space, index) => {
            const amenities = JSON.parse(space.amenities) as string[];
            const spaceName = locale === 'fr' ? space.nameFr : space.nameEn;
            const spaceDescription =
              locale === 'fr' ? space.descriptionFr : space.descriptionEn;

            return (
              <div
                key={space.id}
                className="bg-brand-black-light border border-brand-black-light rounded-sm overflow-hidden hover:border-brand-red transition-all group animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Space Image */}
                <div className="h-64 relative overflow-hidden">
                  <Image
                    src={spaceImages[index] || '/premises/IMG_2776.jpg'}
                    alt={spaceName}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="inline-block bg-brand-red px-3 py-1 rounded-sm text-white text-sm font-semibold uppercase tracking-wider">
                      {locale === 'fr' ? 'Disponible' : 'Available'}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-brand-red transition-colors">
                    {spaceName}
                  </h3>
                  <p className="text-gray-400 mb-4">{spaceDescription}</p>

                  {/* Capacity */}
                  <div className="flex items-center mb-4 text-gray-300">
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
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <span>
                      {t('capacity')}: {space.capacity} {t('people')}
                    </span>
                  </div>

                  {/* Amenities */}
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-300 mb-2">
                      {t('amenities')}:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {amenities.slice(0, 4).map((amenity, index) => (
                        <span
                          key={index}
                          className="bg-brand-red/20 text-brand-red px-2 py-1 rounded-sm text-xs border border-brand-red/30"
                        >
                          {amenity}
                        </span>
                      ))}
                      {amenities.length > 4 && (
                        <span className="bg-brand-black text-gray-400 px-2 py-1 rounded-sm text-xs border border-brand-black-light">
                          +{amenities.length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="border-t border-brand-black-light pt-4 mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">{t('pricePerHour')}</span>
                      <span className="font-bold text-lg text-brand-red">
                        {formatPrice(Number(space.pricePerHour))}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-400">{t('pricePerDay')}</span>
                      <span className="font-bold text-lg text-brand-red">
                        {formatPrice(Number(space.pricePerDay))}
                      </span>
                    </div>

                    <Link
                      href={`/${locale}/booking?space=${space.id}`}
                      className="block w-full bg-brand-red text-white text-center py-3 rounded-sm font-semibold hover:bg-brand-red-dark transition-all transform hover:scale-105 uppercase tracking-wider"
                    >
                      {t('bookNow')}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Gallery Section */}
        <SpacesGallery
          images={premisesImages}
          title={locale === 'fr' ? 'Découvrez nos espaces' : 'Discover our spaces'}
          subtitle={locale === 'fr'
            ? 'Des environnements modernes conçus pour inspirer et collaborer'
            : 'Modern environments designed to inspire and collaborate'}
        />
      </div>
    </div>
  );
}
