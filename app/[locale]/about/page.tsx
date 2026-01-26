import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  const t = useTranslations('about');
  const locale = useLocale();

  const values = [
    {
      icon: '🤝',
      title: locale === 'fr' ? 'Collaboration' : 'Collaboration',
      description: locale === 'fr'
        ? 'Nous créons un environnement propice aux échanges et à la collaboration entre professionnels'
        : 'We create an environment conducive to exchanges and collaboration between professionals',
    },
    {
      icon: '💡',
      title: locale === 'fr' ? 'Innovation' : 'Innovation',
      description: locale === 'fr'
        ? 'Des espaces modernes équipés des dernières technologies pour stimuler votre créativité'
        : 'Modern spaces equipped with the latest technologies to stimulate your creativity',
    },
    {
      icon: '✨',
      title: locale === 'fr' ? 'Qualité' : 'Quality',
      description: locale === 'fr'
        ? 'Des services de haute qualité dans un cadre professionnel et inspirant'
        : 'High-quality services in a professional and inspiring setting',
    },
    {
      icon: '🌍',
      title: locale === 'fr' ? 'Communauté' : 'Community',
      description: locale === 'fr'
        ? 'Un réseau de professionnels diversifiés pour élargir vos horizons'
        : 'A network of diverse professionals to broaden your horizons',
    },
  ];

  const features = [
    {
      title: locale === 'fr' ? 'Espaces flexibles' : 'Flexible spaces',
      description: locale === 'fr'
        ? 'Une salle polyvalente avec différentes configurations adaptées à tous vos besoins'
        : 'A versatile room with different configurations adapted to all your needs',
    },
    {
      title: locale === 'fr' ? 'Équipements premium' : 'Premium equipment',
      description: locale === 'fr'
        ? 'Wi-Fi haut débit, imprimantes, projecteurs et tout le nécessaire pour votre productivité'
        : 'High-speed Wi-Fi, printers, projectors and everything you need for your productivity',
    },
    {
      title: locale === 'fr' ? 'Localisation stratégique' : 'Strategic location',
      description: locale === 'fr'
        ? 'Facile d\'accès avec parking et transports en commun à proximité'
        : 'Easy access with parking and public transport nearby',
    },
    {
      title: locale === 'fr' ? 'Services inclus' : 'Included services',
      description: locale === 'fr'
        ? 'Café, espace détente, événements networking et bien plus'
        : 'Coffee, relaxation area, networking events and much more',
    },
  ];

  return (
    <div className="bg-brand-black min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 bg-brand-black-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
              {locale === 'fr' ? 'À propos de Wote Space' : 'About Wote Space'}
            </h1>
            <div className="h-1 w-32 bg-brand-red mb-8 mx-auto"></div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {locale === 'fr'
                ? 'Votre espace de travail collaboratif au cœur de l\'innovation et de la créativité'
                : 'Your collaborative workspace at the heart of innovation and creativity'}
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-brand-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
                {locale === 'fr' ? 'Notre Mission' : 'Our Mission'}
              </h2>
              <div className="h-1 w-24 bg-brand-red mb-6"></div>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                {locale === 'fr'
                  ? 'Wote Space a été créé avec une vision claire : offrir aux entrepreneurs, freelances, startups et entreprises établies un environnement de travail exceptionnel qui favorise la productivité, la collaboration et l\'innovation.'
                  : 'Wote Space was created with a clear vision: to offer entrepreneurs, freelancers, startups and established companies an exceptional work environment that promotes productivity, collaboration and innovation.'}
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                {locale === 'fr'
                  ? 'Nous croyons que le bon environnement de travail peut transformer la façon dont vous travaillez et pensez. C\'est pourquoi nous avons conçu nos espaces pour inspirer, motiver et connecter.'
                  : 'We believe that the right work environment can transform the way you work and think. That\'s why we designed our spaces to inspire, motivate and connect.'}
              </p>
            </div>
            <div className="relative h-96 rounded-sm overflow-hidden">
              <Image
                src="/premises/IMG_2820.jpg"
                alt="Wote Space Interior"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-brand-black-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              {locale === 'fr' ? 'Nos Valeurs' : 'Our Values'}
            </h2>
            <div className="h-1 w-24 bg-brand-red mb-6 mx-auto"></div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              {locale === 'fr'
                ? 'Les principes qui guident notre approche et définissent notre communauté'
                : 'The principles that guide our approach and define our community'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-brand-black p-8 rounded-sm border border-brand-black-light hover:border-brand-red transition-all group"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-brand-red transition-colors">
                  {value.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-brand-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              {locale === 'fr' ? 'Ce qui nous distingue' : 'What sets us apart'}
            </h2>
            <div className="h-1 w-24 bg-brand-red mb-6 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-brand-black-light p-8 rounded-sm border-l-4 border-brand-red hover:bg-brand-black transition-all"
              >
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-brand-black-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-black text-brand-red mb-2">500+</div>
              <p className="text-gray-300">
                {locale === 'fr' ? 'Membres actifs' : 'Active members'}
              </p>
            </div>
            <div>
              <div className="text-5xl font-black text-brand-red mb-2">5</div>
              <p className="text-gray-300">
                {locale === 'fr' ? 'Configurations disponibles' : 'Available setups'}
              </p>
            </div>
            <div>
              <div className="text-5xl font-black text-brand-red mb-2">24/7</div>
              <p className="text-gray-300">
                {locale === 'fr' ? 'Accès flexible' : 'Flexible access'}
              </p>
            </div>
            <div>
              <div className="text-5xl font-black text-brand-red mb-2">100%</div>
              <p className="text-gray-300">
                {locale === 'fr' ? 'Satisfaction client' : 'Client satisfaction'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-brand-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            {locale === 'fr' ? 'Prêt à rejoindre notre communauté ?' : 'Ready to join our community?'}
          </h2>
          <div className="h-1 w-24 bg-brand-red mb-8 mx-auto"></div>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            {locale === 'fr'
              ? 'Découvrez notre espace et réservez votre visite dès aujourd\'hui'
              : 'Discover our space and book your visit today'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/spaces`}
              className="inline-block bg-brand-red text-white px-10 py-4 rounded-sm font-bold hover:bg-brand-red-dark transition-all transform hover:scale-105 uppercase tracking-wider"
            >
              {locale === 'fr' ? 'Voir les configurations' : 'View setups'}
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="inline-block bg-transparent text-white border-2 border-brand-red px-10 py-4 rounded-sm font-bold hover:bg-brand-red hover:border-brand-red transition-all uppercase tracking-wider"
            >
              {locale === 'fr' ? 'Nous contacter' : 'Contact us'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
