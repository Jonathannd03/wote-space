'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const organisations = [
  {
    name: 'WAHDI – Women in Action for Human Dignity',
    logo: '/partners/wahdi women in Action for Human Dignity.png',
  },
  {
    name: 'Tumaini Jipya',
    logo: '/partners/TumainiJipya-02.png',
  },
  {
    name: 'Waza & Act',
    logo: '/partners/waza-and-act.png',
  },
  {
    name: 'Skills Wote',
    logo: '/partners/skills wote.png',
  },
  {
    name: 'Centre for Development and Enterprises',
    logo: '/partners/Centre for development and entreprises.jpg',
  },
  {
    name: 'Mixes From Africa',
    logo: '/partners/294516757_423127039830058_7206967330386121846_n (1).jpg.jpeg',
  },
];

interface PartnersSectionProps {
  locale: string;
}

export default function PartnersSection({ locale }: PartnersSectionProps) {
  const title =
    locale === 'fr'
      ? 'Ils nous font confiance'
      : 'They trust us';
  const subtitle =
    locale === 'fr'
      ? 'ONG, communautés, associations et organisations qui ont utilisé et soutiennent Wote Space'
      : 'NGOs, communities, associations and organisations that used and support Wote Space';

  const doubled = [...organisations, ...organisations];

  return (
    <section className="py-16 bg-brand-black-light overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {title}
          </h2>
          <div className="h-1 w-24 bg-brand-red mx-auto mb-6" />
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">{subtitle}</p>
        </motion.div>
      </div>

      {/* Marquee */}
      <div className="relative w-full">
        {/* fade edges */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-24 z-10 bg-gradient-to-r from-brand-black-light to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-24 z-10 bg-gradient-to-l from-brand-black-light to-transparent" />

        <div className="flex animate-marquee gap-6 w-max">
          {doubled.map((org, index) => (
            <div
              key={`${org.name}-${index}`}
              className="group flex-shrink-0 flex items-center justify-center p-6 bg-brand-black border border-brand-black-light hover:border-brand-red rounded-sm transition-all duration-300 w-44 h-28"
            >
              <div className="relative w-full h-full">
                <Image
                  src={org.logo}
                  alt={org.name}
                  fill
                  className="object-contain filter brightness-90 group-hover:brightness-110 transition-all duration-300"
                  sizes="176px"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
