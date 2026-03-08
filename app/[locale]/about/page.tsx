import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  const t = useTranslations('about');
  const locale = useLocale();

  const values = [
    {
      icon: '🕊️',
      title: locale === 'fr' ? 'Dignité humaine' : 'Human dignity',
      description: locale === 'fr'
        ? 'Toute personne mérite d\'être traitée avec respect et humanité — c\'est la conviction fondatrice de Wote Space'
        : 'Every person deserves to be treated with respect and humanity — this is the founding conviction of Wote Space',
    },
    {
      icon: '🤝',
      title: locale === 'fr' ? 'Solidarité' : 'Solidarity',
      description: locale === 'fr'
        ? 'Nous croyons que les défis humanitaires se surmontent ensemble, en unissant les forces des acteurs locaux et internationaux'
        : 'We believe humanitarian challenges are overcome together, by uniting the strengths of local and international actors',
    },
    {
      icon: '🔓',
      title: locale === 'fr' ? 'Inclusion' : 'Inclusion',
      description: locale === 'fr'
        ? 'Un espace ouvert à toutes et à tous — ONG, associations, défenseurs des droits, groupes communautaires'
        : 'A space open to everyone — NGOs, associations, rights defenders and community groups',
    },
    {
      icon: '🌍',
      title: locale === 'fr' ? 'Impact local' : 'Local impact',
      description: locale === 'fr'
        ? 'Chaque action menée ici contribue directement au bien-être des communautés vulnérables de Goma et de la région'
        : 'Every action taken here directly contributes to the well-being of vulnerable communities in Goma and the region',
    },
  ];

  const features = [
    {
      title: locale === 'fr' ? 'Espace de coordination humanitaire' : 'Humanitarian coordination space',
      description: locale === 'fr'
        ? 'Des salles polyvalentes conçues pour les réunions de coordination, les clusters humanitaires, les formations et les ateliers de renforcement des capacités'
        : 'Versatile rooms designed for coordination meetings, humanitarian clusters, trainings and capacity-building workshops',
    },
    {
      title: locale === 'fr' ? 'Équipements adaptés aux missions' : 'Mission-ready equipment',
      description: locale === 'fr'
        ? 'Wi-Fi fiable, projecteur, tableau, imprimante : tout ce qu\'il faut pour mener vos opérations sans contrainte matérielle'
        : 'Reliable Wi-Fi, projector, whiteboard, printer: everything needed to run your operations without material constraints',
    },
    {
      title: locale === 'fr' ? 'Au cœur du terrain' : 'At the heart of the field',
      description: locale === 'fr'
        ? 'Situé dans le quartier Murara à Goma, Wote Space est accessible à l\'ensemble des acteurs humanitaires présents dans la ville'
        : 'Located in the Murara district in Goma, Wote Space is accessible to all humanitarian actors present in the city',
    },
    {
      title: locale === 'fr' ? 'Un écosystème partenarial' : 'A partner ecosystem',
      description: locale === 'fr'
        ? 'En rejoignant Wote Space, vous intégrez un réseau d\'organisations engagées qui collaborent, se soutiennent et amplifient leur impact humanitaire'
        : 'By joining Wote Space, you become part of a network of committed organisations that collaborate, support each other and amplify their humanitarian impact',
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
                ? 'Un espace au service de la dignité humaine et de l\'action humanitaire à Goma'
                : 'A space in service of human dignity and humanitarian action in Goma'}
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
                  ? 'Wote Space a été créé avec une conviction profonde : les acteurs humanitaires — ONG, associations, défenseurs des droits, groupes communautaires — méritent un cadre de travail digne de leurs missions, au service des populations les plus vulnérables.'
                  : 'Wote Space was created with a deep conviction: humanitarian actors — NGOs, associations, rights defenders, community groups — deserve a workspace worthy of their missions, in service of the most vulnerable populations.'}
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                {locale === 'fr'
                  ? 'Nous mettons à disposition un espace sûr, accessible et équipé pour que chaque organisation puisse coordonner, former et agir avec plus d\'efficacité — parce que derrière chaque réunion, il y a des vies qui comptent.'
                  : 'We provide a safe, accessible and equipped space so that every organisation can coordinate, train and act more effectively — because behind every meeting, there are lives that matter.'}
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
              <div className="text-5xl font-black text-brand-red mb-2">3+</div>
              <p className="text-gray-300">
                {locale === 'fr' ? 'Organisations partenaires' : 'Partner organisations'}
              </p>
            </div>
            <div>
              <div className="text-5xl font-black text-brand-red mb-2">5</div>
              <p className="text-gray-300">
                {locale === 'fr' ? 'Configurations disponibles' : 'Available setups'}
              </p>
            </div>
            <div>
              <div className="text-5xl font-black text-brand-red mb-2">2024</div>
              <p className="text-gray-300">
                {locale === 'fr' ? 'Fondé à Goma' : 'Founded in Goma'}
              </p>
            </div>
            <div>
              <div className="text-5xl font-black text-brand-red mb-2">100%</div>
              <p className="text-gray-300">
                {locale === 'fr' ? 'Dédié aux communautés' : 'Dedicated to communities'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-brand-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            {locale === 'fr' ? 'Votre mission mérite un espace à la hauteur' : 'Your mission deserves the right space'}
          </h2>
          <div className="h-1 w-24 bg-brand-red mb-8 mx-auto"></div>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            {locale === 'fr'
              ? 'Rejoignez les organisations qui font confiance à Wote Space pour coordonner et amplifier leur action humanitaire'
              : 'Join the organisations that trust Wote Space to coordinate and amplify their humanitarian action'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/spaces`}
              className="inline-block bg-brand-red text-white px-10 py-4 rounded-sm font-bold hover:bg-brand-red-dark transition-all transform hover:scale-105 uppercase tracking-wider"
            >
              {locale === 'fr' ? 'Découvrir nos espaces' : 'Discover our spaces'}
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="inline-block bg-transparent text-white border-2 border-brand-red px-10 py-4 rounded-sm font-bold hover:bg-brand-red hover:border-brand-red transition-all uppercase tracking-wider"
            >
              {locale === 'fr' ? 'Nous rejoindre' : 'Get in touch'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
