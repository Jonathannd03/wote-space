'use client';

import { useState } from 'react';
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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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
            onClick={() => setSelectedImage(image)}
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

      {/* Enhanced Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-brand-black/98 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.1 }}
              className="absolute top-8 right-8 text-white hover:text-brand-red transition-colors z-10 bg-brand-black-light/50 p-3 rounded-full hover:bg-brand-red/20"
              onClick={() => setSelectedImage(null)}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>

            {/* Image Counter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.1 }}
              className="absolute top-8 left-8 bg-brand-red px-4 py-2 rounded-sm text-white font-bold"
            >
              {images.indexOf(selectedImage) + 1} / {images.length}
            </motion.div>

            {/* Image Container */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotateY: -15 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.8, opacity: 0, rotateY: 15 }}
              transition={{
                type: 'spring',
                stiffness: 100,
                damping: 20,
              }}
              className="relative w-full h-full max-w-7xl max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Red Border Frame */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute inset-0 border-4 border-brand-red rounded-sm pointer-events-none"
              />

              <Image
                src={selectedImage}
                alt="Wote Space"
                fill
                className="object-contain rounded-sm"
                sizes="100vw"
                priority
              />
            </motion.div>

            {/* Navigation Hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-gray-400 text-sm"
            >
              Click outside to close
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
