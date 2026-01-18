import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';

export default function PricingPage() {
  const t = useTranslations('pricing');
  const locale = useLocale();

  const coworkingPlans = [
    {
      name: locale === 'fr' ? 'Pass Journalier' : 'Day Pass',
      price: '3',
      period: locale === 'fr' ? 'jour' : 'day',
      features: [
        locale === 'fr' ? 'Accès à l\'espace de coworking partagé' : 'Access to shared coworking space',
        'Wi-Fi',
        locale === 'fr' ? 'Mobilier & espaces communs' : 'Furniture & common areas',
        locale === 'fr' ? 'Café' : 'Coffee',
      ],
    },
    {
      name: locale === 'fr' ? 'Pass Hebdomadaire' : 'Weekly Pass',
      price: '15',
      period: locale === 'fr' ? 'semaine' : 'week',
      features: [
        locale === 'fr' ? 'Coworking partagé' : 'Shared coworking',
        'Wi-Fi',
        locale === 'fr' ? 'Café' : 'Coffee',
        locale === 'fr' ? '1 heure de salle de réunion incluse' : '1 hour meeting room included',
      ],
    },
    {
      name: locale === 'fr' ? 'Flex Desk' : 'Flex Desk',
      price: '60',
      period: locale === 'fr' ? 'mois' : 'month',
      featured: true,
      features: [
        locale === 'fr' ? 'Accès 5 jours / semaine' : 'Access 5 days / week',
        'Wi-Fi',
        locale === 'fr' ? 'Café' : 'Coffee',
        locale === 'fr' ? 'Événements communautaires' : 'Community events',
        locale === 'fr' ? '3 heures de salle de réunion / mois' : '3 hours meeting room / month',
      ],
    },
    {
      name: locale === 'fr' ? 'Premium' : 'Premium',
      price: '90',
      period: locale === 'fr' ? 'mois' : 'month',
      features: [
        locale === 'fr' ? 'Accès 7j / 7j' : 'Access 7 days / week',
        locale === 'fr' ? 'Wi-Fi haut débit' : 'High-speed Wi-Fi',
        locale === 'fr' ? 'Café + impression légère' : 'Coffee + light printing',
        locale === 'fr' ? '6 heures de salle de réunion / mois' : '6 hours meeting room / month',
      ],
    },
    {
      name: locale === 'fr' ? 'Pro / Équipe' : 'Pro / Team',
      price: '130',
      period: locale === 'fr' ? 'mois' : 'month',
      features: [
        locale === 'fr' ? 'Accès illimité au coworking' : 'Unlimited coworking access',
        locale === 'fr' ? 'Wi-Fi premium' : 'Premium Wi-Fi',
        locale === 'fr' ? 'Café' : 'Coffee',
        locale === 'fr' ? '10 heures de salle de réunion / mois' : '10 hours meeting room / month',
        locale === 'fr' ? 'Adresse professionnelle' : 'Professional address',
      ],
    },
  ];

  const meetingRoomPricing = [
    {
      capacity: '1 – 10',
      hourly: '10',
      halfDay: '35',
      fullDay: '60',
    },
    {
      capacity: '11 – 25',
      hourly: '15',
      halfDay: '50',
      fullDay: '90',
    },
    {
      capacity: '26 – 40',
      hourly: '20',
      halfDay: '70',
      fullDay: '120',
    },
    {
      capacity: '41 – 60',
      hourly: '25',
      halfDay: '90',
      fullDay: '160',
    },
  ];

  const addOns = [
    {
      name: locale === 'fr' ? 'Vidéoprojecteur ou écran' : 'Projector or screen',
      price: locale === 'fr' ? '+5 $ / heure · 15 $ / jour' : '+$5 / hour · $15 / day',
    },
    {
      name: locale === 'fr' ? 'Wi-Fi premium dédié' : 'Dedicated premium Wi-Fi',
      price: locale === 'fr' ? '+5 $ / événement' : '+$5 / event',
    },
    {
      name: locale === 'fr' ? 'Sonorisation (micro + haut-parleurs)' : 'Sound system (mic + speakers)',
      price: locale === 'fr' ? '+10 $ / événement' : '+$10 / event',
    },
    {
      name: locale === 'fr' ? 'Assistance technique' : 'Technical assistance',
      price: locale === 'fr' ? '+10 $ / événement' : '+$10 / event',
    },
  ];

  const specialPacks = [
    {
      name: locale === 'fr' ? 'Pack Étudiants / Écoles' : 'Students / Schools Pack',
      capacity: '25–40',
      price: '10',
      period: locale === 'fr' ? 'heure' : 'hour',
      features: [
        locale === 'fr' ? 'Salle' : 'Room',
        locale === 'fr' ? 'Projecteur ou écran' : 'Projector or screen',
        'Wi-Fi',
      ],
    },
    {
      name: locale === 'fr' ? 'Pack Communauté' : 'Community Pack',
      capacity: '26–40',
      price: '150',
      period: locale === 'fr' ? 'mois' : 'month',
      features: [
        locale === 'fr' ? 'Salle' : 'Room',
        locale === 'fr' ? 'Projecteur ou écran' : 'Projector or screen',
        'Wi-Fi',
      ],
    },
    {
      name: locale === 'fr' ? 'Pack Réunion ONG' : 'NGO Meeting Pack',
      capacity: '26–40',
      price: '200',
      period: locale === 'fr' ? 'mois' : 'month',
      features: [
        locale === 'fr' ? 'Salle' : 'Room',
        locale === 'fr' ? 'Projecteur ou écran' : 'Projector or screen',
        'Wi-Fi',
      ],
    },
    {
      name: locale === 'fr' ? 'Pack Formation' : 'Training Pack',
      capacity: '26–40',
      price: '130',
      period: locale === 'fr' ? 'jour' : 'day',
      features: [
        locale === 'fr' ? 'Salle (journée)' : 'Room (full day)',
        locale === 'fr' ? 'Projecteur + sonorisation' : 'Projector + sound',
        locale === 'fr' ? 'Wi-Fi premium' : 'Premium Wi-Fi',
        locale === 'fr' ? 'Photographie (2 heures)' : 'Photography (2 hours)',
      ],
    },
    {
      name: locale === 'fr' ? 'Pack Conférence Pro' : 'Pro Conference Pack',
      capacity: '41–60',
      price: '180',
      period: locale === 'fr' ? 'jour' : 'day',
      featured: true,
      features: [
        locale === 'fr' ? 'Salle (journée)' : 'Room (full day)',
        locale === 'fr' ? 'Projecteur + sonorisation' : 'Projector + sound',
        locale === 'fr' ? 'Wi-Fi premium' : 'Premium Wi-Fi',
        locale === 'fr' ? 'Photographie complète' : 'Full photography',
        locale === 'fr' ? 'Assistance technique' : 'Technical assistance',
      ],
    },
  ];

  return (
    <div className="bg-brand-black min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 bg-brand-black-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
            {locale === 'fr' ? 'Offres & Tarifs' : 'Offers & Pricing'}
          </h1>
          <div className="h-1 w-32 bg-brand-red mb-8 mx-auto"></div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {locale === 'fr'
              ? 'Des solutions flexibles adaptées à vos besoins'
              : 'Flexible solutions adapted to your needs'}
          </p>
        </div>
      </section>

      {/* Coworking Plans */}
      <section className="py-20 bg-brand-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4 text-center">
            {locale === 'fr' ? 'Espace de Coworking' : 'Coworking Space'}
          </h2>
          <div className="h-1 w-24 bg-brand-red mb-12 mx-auto"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {coworkingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-brand-black-light p-8 rounded-sm border-2 ${
                  plan.featured ? 'border-brand-red' : 'border-brand-black-light'
                } hover:border-brand-red transition-all`}
              >
                {plan.featured && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-brand-red text-white px-4 py-1 rounded-sm text-sm font-bold uppercase">
                      {locale === 'fr' ? 'Populaire' : 'Popular'}
                    </span>
                  </div>
                )}
                <h3 className="text-2xl font-bold text-white mb-4">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-5xl font-black text-brand-red">${plan.price}</span>
                  <span className="text-gray-400 ml-2">/ {plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start text-gray-300">
                      <svg
                        className="w-5 h-5 text-brand-red mr-2 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/${locale}/booking`}
                  className={`block text-center py-3 rounded-sm font-bold transition-colors ${
                    plan.featured
                      ? 'bg-brand-red text-white hover:bg-brand-red-dark'
                      : 'bg-transparent border-2 border-brand-red text-brand-red hover:bg-brand-red hover:text-white'
                  }`}
                >
                  {locale === 'fr' ? 'Réserver' : 'Book Now'}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meeting Room Pricing */}
      <section className="py-20 bg-brand-black-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4 text-center">
            {locale === 'fr' ? 'Salle de Réunion' : 'Meeting Room'}
          </h2>
          <p className="text-center text-gray-400 mb-8">
            {locale === 'fr' ? 'Jusqu\'à 60 personnes' : 'Up to 60 people'}
          </p>
          <div className="h-1 w-24 bg-brand-red mb-12 mx-auto"></div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-brand-red">
                  <th className="py-4 px-6 text-white font-bold">
                    {locale === 'fr' ? 'Participants' : 'Participants'}
                  </th>
                  <th className="py-4 px-6 text-white font-bold">
                    {locale === 'fr' ? '1 heure' : '1 hour'}
                  </th>
                  <th className="py-4 px-6 text-white font-bold">
                    {locale === 'fr' ? 'Demi-journée (4h)' : 'Half-day (4h)'}
                  </th>
                  <th className="py-4 px-6 text-white font-bold">
                    {locale === 'fr' ? 'Journée (8h)' : 'Full day (8h)'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {meetingRoomPricing.map((row, index) => (
                  <tr
                    key={index}
                    className="border-b border-brand-black hover:bg-brand-black transition-colors"
                  >
                    <td className="py-4 px-6 text-gray-300 font-semibold">
                      {row.capacity} {locale === 'fr' ? 'pers.' : 'people'}
                    </td>
                    <td className="py-4 px-6 text-brand-red font-bold">${row.hourly}</td>
                    <td className="py-4 px-6 text-brand-red font-bold">${row.halfDay}</td>
                    <td className="py-4 px-6 text-brand-red font-bold">${row.fullDay}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="py-20 bg-brand-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4 text-center">
            {locale === 'fr' ? 'Options Techniques' : 'Technical Add-ons'}
          </h2>
          <div className="h-1 w-24 bg-brand-red mb-12 mx-auto"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {addOns.map((addon, index) => (
              <div
                key={index}
                className="bg-brand-black-light p-6 rounded-sm border border-brand-black-light hover:border-brand-red transition-all"
              >
                <h3 className="text-xl font-bold text-white mb-2">{addon.name}</h3>
                <p className="text-brand-red font-bold">{addon.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Packs */}
      <section className="py-20 bg-brand-black-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4 text-center">
            {locale === 'fr' ? 'Packs Spéciaux' : 'Special Packs'}
          </h2>
          <div className="h-1 w-24 bg-brand-red mb-12 mx-auto"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specialPacks.map((pack, index) => (
              <div
                key={index}
                className={`relative bg-brand-black p-8 rounded-sm border-2 ${
                  pack.featured ? 'border-brand-red' : 'border-brand-black-light'
                } hover:border-brand-red transition-all`}
              >
                {pack.featured && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-brand-red text-white px-4 py-1 rounded-sm text-sm font-bold uppercase">
                      {locale === 'fr' ? 'Recommandé' : 'Recommended'}
                    </span>
                  </div>
                )}
                <h3 className="text-2xl font-bold text-white mb-2">{pack.name}</h3>
                <p className="text-gray-400 text-sm mb-4">
                  {pack.capacity} {locale === 'fr' ? 'personnes' : 'people'}
                </p>
                <div className="mb-6">
                  <span className="text-5xl font-black text-brand-red">${pack.price}</span>
                  <span className="text-gray-400 ml-2">/ {pack.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {pack.features.map((feature, i) => (
                    <li key={i} className="flex items-start text-gray-300">
                      <svg
                        className="w-5 h-5 text-brand-red mr-2 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/${locale}/booking`}
                  className={`block text-center py-3 rounded-sm font-bold transition-colors ${
                    pack.featured
                      ? 'bg-brand-red text-white hover:bg-brand-red-dark'
                      : 'bg-transparent border-2 border-brand-red text-brand-red hover:bg-brand-red hover:text-white'
                  }`}
                >
                  {locale === 'fr' ? 'Réserver' : 'Book Now'}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-brand-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            {locale === 'fr' ? 'Besoin d\'une solution personnalisée ?' : 'Need a custom solution?'}
          </h2>
          <div className="h-1 w-24 bg-brand-red mb-8 mx-auto"></div>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            {locale === 'fr'
              ? 'Contactez-nous pour discuter de vos besoins spécifiques'
              : 'Contact us to discuss your specific needs'}
          </p>
          <Link
            href={`/${locale}/contact`}
            className="inline-block bg-brand-red text-white px-10 py-4 rounded-sm font-bold hover:bg-brand-red-dark transition-colors text-lg uppercase tracking-wider"
          >
            {locale === 'fr' ? 'Nous contacter' : 'Contact Us'}
          </Link>
        </div>
      </section>
    </div>
  );
}
