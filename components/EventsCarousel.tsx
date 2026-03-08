'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Event } from '@/lib/events';

interface EventWithDescription extends Event {
  shortDescription: string;
}

interface EventsCarouselProps {
  events: EventWithDescription[];
  locale: string;
}

export default function EventsCarousel({ events, locale }: EventsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const touchStartX = useRef<number | null>(null);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % events.length);
  }, [events.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
  }, [events.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || events.length <= 1) return;
    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, goToNext, events.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsAutoPlaying(false);
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

  if (events.length === 0) return null;

  const getVisibleEvents = () => {
    if (events.length === 1) return [events[0]];
    if (events.length === 2) return [events[currentIndex], events[(currentIndex + 1) % events.length]];
    return [
      events[currentIndex],
      events[(currentIndex + 1) % events.length],
      events[(currentIndex + 2) % events.length],
    ];
  };

  const visibleEvents = getVisibleEvents();

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Cards */}
      <div className="overflow-hidden">
        {/* Desktop: 3 cards */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-8">
          {visibleEvents.map((event) => (
            <EventCard key={event.id} event={event} locale={locale} />
          ))}
        </div>

        {/* Mobile: 1 card */}
        <div className="lg:hidden">
          <EventCard event={visibleEvents[0]} locale={locale} />
        </div>
      </div>

      {/* Navigation — inside the container, never clipped */}
      {events.length > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => { goToPrevious(); setIsAutoPlaying(false); }}
            className="bg-brand-black-light hover:bg-brand-red border border-brand-red text-white p-3 rounded-full transition-all touch-manipulation"
            aria-label="Previous event"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Dots */}
          <div className="flex gap-2">
            {events.map((_, index) => (
              <button
                key={index}
                onClick={() => { goToSlide(index); setIsAutoPlaying(false); }}
                className={`h-2 rounded-full transition-all touch-manipulation ${
                  index === currentIndex ? 'w-8 bg-brand-red' : 'w-2 bg-gray-600 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => { goToNext(); setIsAutoPlaying(false); }}
            className="bg-brand-black-light hover:bg-brand-red border border-brand-red text-white p-3 rounded-full transition-all touch-manipulation"
            aria-label="Next event"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      {/* Mobile swipe hint */}
      {events.length > 1 && (
        <p className="text-center text-gray-500 text-xs mt-3 sm:hidden">
          Glissez ou utilisez les flèches pour naviguer
        </p>
      )}
    </div>
  );
}

interface EventCardProps {
  event: EventWithDescription;
  locale: string;
}

function EventCard({ event, locale }: EventCardProps) {
  const eventName = locale === 'fr' ? event.nameFr : event.nameEn;

  return (
    <Link
      href={`/${locale}/events/${event.id}`}
      className="group bg-brand-black-light rounded-sm overflow-hidden border border-brand-black-light hover:border-brand-red transition-all block"
    >
      <div className="relative h-64 overflow-hidden">
        {event.images[0] && (
          <Image
            src={event.images[0]}
            alt={eventName || event.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent" />
        {/* "View event" tap hint — always visible on mobile */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/60 text-white text-xs font-semibold px-2.5 py-1.5 rounded-sm sm:opacity-0 group-hover:opacity-100 transition-opacity">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          {locale === 'fr' ? 'Voir' : 'View'}
        </div>
      </div>
      <div className="p-5 sm:p-6">
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-brand-red transition-colors">
          {eventName || event.name}
        </h3>
        <p className="text-brand-red text-sm mb-3 font-semibold">{event.displayDate}</p>
        <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
          {event.shortDescription}
        </p>
      </div>
    </Link>
  );
}
