'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const partners = [
  {
    name: 'Centre de formation humanitaire ONG ITC',
    logo: '/partners/Centre de formation humanitaire ONG ITC.jpg',
  },
  {
    name: 'Tumaini Jipya',
    logo: '/partners/TumainiJipya-02.png',
  },
  {
    name: 'WAHDI – Women in Action for Human Dignity',
    logo: '/partners/wahdi women in Action for Human Dignity.png',
  },
];

interface PartnersSectionProps {
  locale: string;
}

export default function PartnersSection({ locale }: PartnersSectionProps) {
  const title = locale === 'fr' ? 'Nos Partenaires' : 'Our Partners';
  const subtitle =
    locale === 'fr'
      ? 'Ils nous font confiance et partagent notre vision'
      : 'They trust us and share our vision';

  return (
    <section className="py-20 bg-brand-black-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {title}
          </h2>
          <div className="h-1 w-24 bg-brand-red mx-auto mb-6" />
          <p className="text-gray-400 text-lg max-w-xl mx-auto">{subtitle}</p>
        </motion.div>

        {/* Partner logos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="group flex items-center justify-center p-8 bg-brand-black border border-brand-black-light hover:border-brand-red rounded-sm transition-all duration-300"
            >
              <div className="relative w-full h-24 flex items-center justify-center">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  fill
                  className="object-contain filter brightness-90 group-hover:brightness-110 transition-all duration-300"
                  sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 28vw"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
