'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

interface EventGalleryProps {
  images: string[];
  eventName: string;
}

export default function EventGallery({ images, eventName }: EventGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  // Touch swipe state for lightbox
  const touchStartX = useRef<number | null>(null);

  const openLightbox = (index: number) => setSelectedImage(index);
  const closeLightbox = () => setSelectedImage(null);

  const goToPrevious = () => {
    if (selectedImage !== null && selectedImage > 0) {
      setSelectedImage(selectedImage - 1);
    }
  };

  const goToNext = () => {
    if (selectedImage !== null && selectedImage < images.length - 1) {
      setSelectedImage(selectedImage + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowLeft') goToPrevious();
    else if (e.key === 'ArrowRight') goToNext();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) {
      if (delta < 0) goToNext();
      else goToPrevious();
    }
    touchStartX.current = null;
  };

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => openLightbox(index)}
            className="relative aspect-square overflow-hidden rounded-sm bg-brand-black-light group cursor-pointer border border-brand-black-light hover:border-brand-red transition-all"
            aria-label={`View photo ${index + 1}`}
          >
            <Image
              src={image}
              alt={`${eventName} - Image ${index + 1}`}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            {/* Always-visible expand icon (bottom-right corner) */}
            <div className="absolute bottom-2 right-2 bg-black/60 rounded-sm p-1 transition-opacity group-hover:opacity-0">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </div>
            {/* Hover overlay with larger icon (desktop) */}
            <div className="absolute inset-0 bg-brand-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      {/* Mobile swipe hint — shown below the grid */}
      <p className="text-center text-gray-500 text-xs mt-4 sm:hidden">
        Appuyez sur une photo pour l&apos;agrandir · Glissez pour naviguer
      </p>

      {/* Lightbox */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center select-none"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          tabIndex={0}
          role="dialog"
          aria-modal="true"
        >
          {/* Top bar: counter + close */}
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/60 to-transparent z-10">
            <span className="text-white text-sm font-semibold">
              {selectedImage + 1} / {images.length}
            </span>
            <button
              onClick={closeLightbox}
              className="text-white hover:text-brand-red transition-colors p-2 -mr-2"
              aria-label="Close"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Previous Button */}
          {selectedImage > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-brand-red text-white p-3 sm:p-4 rounded-full transition-all z-10 touch-manipulation"
              aria-label="Previous image"
            >
              <svg className="w-5 h-5 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Image */}
          <div
            className="relative w-full h-full mx-12 sm:mx-20"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[selectedImage]}
              alt={`${eventName} - Image ${selectedImage + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>

          {/* Next Button */}
          {selectedImage < images.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); goToNext(); }}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-brand-red text-white p-3 sm:p-4 rounded-full transition-all z-10 touch-manipulation"
              aria-label="Next image"
            >
              <svg className="w-5 h-5 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Bottom swipe hint (mobile, first few opens) */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setSelectedImage(i); }}
                className={`h-1.5 rounded-full transition-all ${i === selectedImage ? 'w-6 bg-brand-red' : 'w-1.5 bg-white/40'}`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
