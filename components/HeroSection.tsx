'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaText: string;
  secondaryCtaText: string;
  locale: string;
}

export default function HeroSection({
  title,
  subtitle,
  ctaText,
  secondaryCtaText,
  locale,
}: HeroSectionProps) {
  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center animate-ken-burns"
          style={{
            backgroundImage: 'url(/premises/IMG_2820.jpg)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-black via-brand-black/95 to-brand-black/70" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-4xl">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <span className="text-brand-red text-sm uppercase tracking-widest font-bold">
                {locale === 'fr' ? 'Espaces de Coworking' : 'Co-working Spaces'}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-6xl md:text-8xl font-black leading-tight text-white mb-6"
            >
              {title}
            </motion.h1>

            {/* Red Accent Line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
              className="h-1 w-32 bg-brand-red mb-8 origin-left"
            />

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-xl md:text-2xl text-gray-300 mb-4 max-w-2xl leading-relaxed"
            >
              {subtitle}
            </motion.p>

            {/* Price Tag */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mb-12 inline-block"
            >
              <div className="bg-brand-red/10 border border-brand-red px-6 py-3 rounded-sm">
                <div className="flex items-baseline gap-2">
                  <span className="text-gray-400 text-sm">
                    {locale === 'fr' ? 'À partir de' : 'From'}
                  </span>
                  <span className="text-4xl font-black text-white">3$</span>
                  <span className="text-gray-400">
                    {locale === 'fr' ? '/ jour' : '/ day'}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href={`/${locale}/booking`}
                className="inline-flex items-center justify-center bg-brand-red text-white px-10 py-4 rounded-sm font-bold hover:bg-brand-red-dark transition-colors text-lg uppercase tracking-wider"
              >
                {ctaText}
              </Link>

              <Link
                href={`/${locale}/spaces`}
                className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white px-10 py-4 rounded-sm font-bold hover:bg-white hover:text-brand-black transition-all text-lg uppercase tracking-wider"
              >
                {secondaryCtaText}
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
}
