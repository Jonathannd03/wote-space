'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, type Variants } from 'framer-motion';

interface GalleryProps {
  images: string[];
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 100,
      damping: 12,
    },
  },
};

export default function Gallery({ images }: GalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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
    <>
      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        {images.map((image, index) => (
          <motion.div
            key={image}
            variants={itemVariants}
            className="relative aspect-square cursor-pointer group overflow-hidden rounded-sm"
            onClick={() => setSelectedIndex(index)}
            onHoverStart={() => setHoveredIndex(index)}
            onHoverEnd={() => setHoveredIndex(null)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Image Container */}
            <div className="relative w-full h-full overflow-hidden">
              <Image
                src={image}
                alt={`Wote Space premises ${index + 1}`}
                fill
                className="object-cover transition-all duration-700 ease-out"
                style={{
                  transform: hoveredIndex === index ? 'scale(1.15)' : 'scale(1)',
                }}
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />

              {/* Gradient Overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredIndex === index ? 0.7 : 0.3 }}
                transition={{ duration: 0.3 }}
              />

              {/* Red Border Animation */}
              <motion.div
                className="absolute inset-0 border-2 border-brand-red"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{
                  opacity: hoveredIndex === index ? 1 : 0,
                  scale: hoveredIndex === index ? 1 : 0.95,
                }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Hover Overlay with Icon */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{
                  scale: hoveredIndex === index ? 1 : 0,
                  rotate: hoveredIndex === index ? 0 : -180,
                }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="bg-brand-red p-4 rounded-full"
              >
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                  />
                </svg>
              </motion.div>
            </motion.div>

            {/* Image Number */}
            <motion.div
              className="absolute bottom-3 left-3 bg-brand-black/80 text-white px-3 py-1 rounded-sm text-xs font-bold"
              initial={{ opacity: 0, x: -20 }}
              animate={{
                opacity: hoveredIndex === index ? 1 : 0,
                x: hoveredIndex === index ? 0 : -20,
              }}
              transition={{ duration: 0.3 }}
            >
              {index + 1} / {images.length}
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

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
    </>
  );
}
