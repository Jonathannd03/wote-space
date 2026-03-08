'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface NewsItem {
  date: { fr: string; en: string };
  tag: { fr: string; en: string };
  title: { fr: string; en: string };
  excerpt: { fr: string; en: string };
  image?: string;
}

const news: NewsItem[] = [
  {
    date: { fr: 'Mars 2026', en: 'March 2026' },
    tag: { fr: 'Partenariat', en: 'Partnership' },
    title: {
      fr: 'Wote Space signe un partenariat avec l\'ONG ITC',
      en: 'Wote Space signs a partnership with ONG ITC',
    },
    excerpt: {
      fr: 'Nous sommes fiers d\'annoncer la signature d\'un accord de partenariat avec le Centre de formation humanitaire ONG ITC. Ce partenariat renforce notre engagement à soutenir les acteurs du développement et de l\'humanitaire en leur offrant un cadre de travail professionnel et adapté à leurs besoins.',
      en: 'We are proud to announce the signing of a partnership agreement with the Centre de formation humanitaire ONG ITC. This partnership reinforces our commitment to supporting humanitarian and development actors by providing them with a professional workspace tailored to their needs.',
    },
    image: '/partners/Centre de formation humanitaire ONG ITC.jpg',
  },
];

interface NewsSectionProps {
  locale: string;
}

export default function NewsSection({ locale }: NewsSectionProps) {
  const title = locale === 'fr' ? 'Actualités' : 'News';
  const subtitle =
    locale === 'fr'
      ? 'Les dernières nouvelles de Wote Space'
      : 'The latest from Wote Space';

  return (
    <section className="py-20 bg-brand-black">
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

        {/* News cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="group bg-brand-black-light border border-brand-black-light hover:border-brand-red rounded-sm overflow-hidden transition-all duration-300 flex flex-col"
            >
              {/* Image */}
              {item.image && (
                <div className="relative h-48 w-full overflow-hidden bg-brand-black flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.title[locale as 'fr' | 'en']}
                    fill
                    className="object-contain p-4 filter brightness-90 group-hover:brightness-110 group-hover:scale-105 transition-all duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                {/* Meta */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-brand-red border border-brand-red px-2 py-1 rounded-sm">
                    {item.tag[locale as 'fr' | 'en']}
                  </span>
                  <span className="text-xs text-gray-500">
                    {item.date[locale as 'fr' | 'en']}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-brand-red transition-colors leading-snug">
                  {item.title[locale as 'fr' | 'en']}
                </h3>

                {/* Excerpt */}
                <p className="text-gray-400 text-sm leading-relaxed flex-1">
                  {item.excerpt[locale as 'fr' | 'en']}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
