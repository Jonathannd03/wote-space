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
      ? 'ONG, associations et organisations qui utilisent et soutiennent Wote Space'
      : 'NGOs, associations and organisations that use and support Wote Space';

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
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">{subtitle}</p>
        </motion.div>

        {/* Logos grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {organisations.map((org, index) => (
            <motion.div
              key={org.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group flex items-center justify-center p-6 bg-brand-black border border-brand-black-light hover:border-brand-red rounded-sm transition-all duration-300"
            >
              <div className="relative w-full h-20">
                <Image
                  src={org.logo}
                  alt={org.name}
                  fill
                  className="object-contain filter brightness-90 group-hover:brightness-110 transition-all duration-300"
                  sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 20vw"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
