'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useInView } from 'framer-motion';

interface AnimatedGalleryProps {
  images: string[];
  title?: string;
  subtitle?: string;
}

export default function AnimatedGallery({ images, title, subtitle }: AnimatedGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  const nextImage = () => {
    if (selectedImage) {
      const currentIdx = images.indexOf(selectedImage);
      const nextIdx = (currentIdx + 1) % images.length;
      setSelectedImage(images[nextIdx]);
    }
  };

  const prevImage = () => {
    if (selectedImage) {
      const currentIdx = images.indexOf(selectedImage);
      const prevIdx = (currentIdx - 1 + images.length) % images.length;
      setSelectedImage(images[prevIdx]);
    }
  };

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
              onClick={() => setSelectedImage(image)}
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
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/50 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

              {/* Animated Border */}
              <motion.div
                className="absolute inset-0 border-4 border-brand-red"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />

              {/* Content Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  whileHover={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="bg-brand-red/90 p-4 rounded-full mb-4"
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
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </motion.div>

                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-white font-bold text-sm"
                >
                  {index + 1} / {images.length}
                </motion.span>
              </div>

              {/* Index Badge */}
              <div className="absolute top-4 left-4 bg-brand-black/80 text-white px-3 py-1 rounded-sm text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                #{index + 1}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Lightbox with Navigation */}
      <AnimatePresence mode="wait">
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-brand-black/98 z-50 flex items-center justify-center"
            onClick={() => setSelectedImage(null)}
          >
            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ delay: 0.2 }}
              onClick={() => setSelectedImage(null)}
              className="absolute top-8 right-8 z-10 bg-brand-red hover:bg-brand-red-dark p-4 rounded-full transition-colors"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>

            {/* Counter */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-8 left-8 bg-brand-red px-6 py-3 rounded-sm"
            >
              <span className="text-white font-bold text-lg">
                {images.indexOf(selectedImage) + 1} / {images.length}
              </span>
            </motion.div>

            {/* Navigation Buttons */}
            <motion.button
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-8 top-1/2 -translate-y-1/2 bg-brand-red/80 hover:bg-brand-red p-4 rounded-full transition-colors z-10"
            >
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>

            <motion.button
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-8 top-1/2 -translate-y-1/2 bg-brand-red/80 hover:bg-brand-red p-4 rounded-full transition-colors z-10"
            >
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>

            {/* Image Container with 3D Effect */}
            <motion.div
              key={selectedImage}
              initial={{ scale: 0.7, opacity: 0, rotateY: 90 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.7, opacity: 0, rotateY: -90 }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              className="relative w-full h-full max-w-7xl max-h-[80vh] mx-16"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Animated Frame */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute inset-0 border-4 border-brand-red shadow-2xl shadow-brand-red/50"
              />

              <Image
                src={selectedImage}
                alt="Full size"
                fill
                className="object-contain p-2"
                sizes="100vw"
                priority
              />
            </motion.div>

            {/* Navigation Hint */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-6 text-gray-400 text-sm"
            >
              <span className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-brand-black-light rounded">←</kbd> Précédent
              </span>
              <span className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-brand-black-light rounded">→</kbd> Suivant
              </span>
              <span className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-brand-black-light rounded">ESC</kbd> Fermer
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
