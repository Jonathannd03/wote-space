'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Event } from '@/lib/events';

interface NewsItem {
  date: string;
  tag: { fr: string; en: string };
  title: { fr: string; en: string };
  excerpt: { fr: string; en: string };
  image?: string;
  isoDate: string;
}

const staticNews: NewsItem[] = [
  {
    isoDate: '2026-02-01',
    date: '2026-02-01',
    tag: { fr: 'Partenariat', en: 'Partnership' },
    title: {
      fr: "Wote Space signe un partenariat avec l'ONG ITC",
      en: 'Wote Space signs a partnership with ONG ITC',
    },
    excerpt: {
      fr: "Nous sommes fiers d'annoncer la signature d'un accord de partenariat avec le Centre de formation humanitaire ONG ITC. Ce partenariat renforce notre engagement à soutenir les acteurs du développement et de l'humanitaire en leur offrant un cadre de travail professionnel et adapté à leurs besoins.",
      en: 'We are proud to announce the signing of a partnership agreement with the Centre de formation humanitaire ONG ITC. This partnership reinforces our commitment to supporting humanitarian and development actors by providing them with a professional workspace tailored to their needs.',
    },
    image: '/partners/Centre de formation humanitaire ONG ITC.jpg',
  },
];

function formatDisplayDate(isoDate: string, locale: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

interface NewsSectionProps {
  locale: string;
  events?: Event[];
  eventShortDescriptions?: Record<string, string>;
}

export default function NewsSection({
  locale,
  events = [],
  eventShortDescriptions = {},
}: NewsSectionProps) {
  const title = locale === 'fr' ? 'Actualités' : 'News';
  const subtitle =
    locale === 'fr'
      ? 'Les dernières nouvelles de Wote Space'
      : 'The latest from Wote Space';

  const loc = locale as 'fr' | 'en';

  // Convert events to news items
  const eventNews: NewsItem[] = events.map((event) => ({
    isoDate: event.date,
    date: event.date,
    tag: { fr: 'Événement', en: 'Event' },
    title: {
      fr: event.nameFr || event.name,
      en: event.nameEn || event.name,
    },
    excerpt: {
      fr: eventShortDescriptions[event.id] || '',
      en: eventShortDescriptions[event.id] || '',
    },
    image: event.images[0],
  }));

  // Merge and sort by date descending
  const allNews = [...staticNews, ...eventNews].sort(
    (a, b) => new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime()
  );

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
          {allNews.map((item, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-brand-black-light border border-brand-black-light hover:border-brand-red rounded-sm overflow-hidden transition-all duration-300 flex flex-col"
            >
              {/* Image */}
              {item.image && (
                <div className="relative h-48 w-full overflow-hidden bg-brand-black flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.title[loc]}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-black/60 to-transparent" />
                </div>
              )}

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                {/* Meta */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-brand-red border border-brand-red px-2 py-1 rounded-sm">
                    {item.tag[loc]}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDisplayDate(item.isoDate, locale)}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-brand-red transition-colors leading-snug">
                  {item.title[loc]}
                </h3>

                {/* Excerpt */}
                <p className="text-gray-400 text-sm leading-relaxed flex-1">
                  {item.excerpt[loc]}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
