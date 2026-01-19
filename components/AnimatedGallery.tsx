'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useInView } from 'framer-motion';

interface AnimatedGalleryProps {
  images: string[];
  title?: string;
  subtitle?: string;
}

export default function AnimatedGallery({ images, title, subtitle }: AnimatedGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  const handlePrevious = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
    }
  };

  const handleNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % images.length);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;

      if (e.key === 'Escape') {
        setSelectedIndex(null);
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex]);

  return (
    <div ref={containerRef} className="w-full">
      {/* Header */}
      {(title || subtitle) && (
        <div className="text-center mb-16">
          {title && (
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-6xl font-black text-white mb-6"
            >
              {title}
            </motion.h2>
          )}
          {title && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="h-2 w-32 bg-brand-red mx-auto mb-6"
            />
          )}
          {subtitle && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-xl text-gray-300 max-w-2xl mx-auto"
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      )}

      {/* Masonry Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((image, index) => {
          const isLarge = index % 5 === 0;
          const colSpan = isLarge ? 'md:col-span-2' : '';
          const rowSpan = isLarge ? 'md:row-span-2' : '';

          return (
            <motion.div
              key={image}
              initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
              animate={isInView ? { opacity: 1, scale: 1, rotateY: 0 } : {}}
              transition={{
                delay: index * 0.1,
                duration: 0.8,
                type: 'spring',
                stiffness: 100,
              }}
              className={`relative ${colSpan} ${rowSpan} aspect-square group cursor-pointer overflow-hidden rounded-sm`}
              onClick={() => setSelectedIndex(index)}
              whileHover={{ scale: 1.05, zIndex: 10 }}
            >
              {/* Image */}
              <Image
                src={image}
                alt={`Gallery image ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 via-brand-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Hover Icon */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-brand-red p-3 rounded-full">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>

              {/* Image Number */}
              <div className="absolute bottom-2 left-2 bg-brand-black/80 text-white px-2 py-1 rounded-sm text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {index + 1}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Enhanced Lightbox with Navigation */}
      <AnimatePresence mode="wait">
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-brand-black/95 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={() => setSelectedIndex(null)}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 md:top-8 md:right-8 text-white hover:text-brand-red transition-colors z-10 bg-brand-black-light/80 p-2 md:p-3 rounded-full hover:bg-brand-red"
              onClick={() => setSelectedIndex(null)}
              aria-label="Close"
            >
              <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Image Counter */}
            <div className="absolute top-4 left-4 md:top-8 md:left-8 bg-brand-red px-3 py-1 md:px-4 md:py-2 rounded-sm text-white text-sm md:text-base font-bold z-10">
              {selectedIndex + 1} / {images.length}
            </div>

            {/* Previous Button */}
            <button
              className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 bg-brand-red hover:bg-brand-red-dark text-white p-3 md:p-4 rounded-full transition-all hover:scale-110 z-10"
              onClick={(e) => {
                e.stopPropagation();
                handlePrevious();
              }}
              aria-label="Previous image"
            >
              <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Next Button */}
            <button
              className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 bg-brand-red hover:bg-brand-red-dark text-white p-3 md:p-4 rounded-full transition-all hover:scale-110 z-10"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              aria-label="Next image"
            >
              <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Image Container */}
            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="relative w-[90vw] h-[70vh] md:w-[80vw] md:h-[80vh] max-w-6xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[selectedIndex]}
                alt={`Wote Space ${selectedIndex + 1}`}
                fill
                className="object-contain"
                sizes="90vw"
                priority
                quality={100}
              />
            </motion.div>

            {/* Navigation Hint */}
            <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 text-gray-400 text-xs md:text-sm text-center px-4">
              <p className="hidden md:block">Use arrow keys or click buttons to navigate • Press ESC or click outside to close</p>
              <p className="md:hidden">Swipe or tap buttons to navigate • Tap outside to close</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
