'use client';

import { useState, useEffect, useCallback } from 'react';
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

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
  }, [events.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + events.length) % events.length);
  }, [events.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || events.length <= 1) return;

    const interval = setInterval(() => {
      goToNext();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, goToNext, events.length]);

  // Pause auto-play on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  if (events.length === 0) return null;

  // Show 3 events at a time on desktop, 1 on mobile
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
    <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {/* Carousel Container */}
      <div className="relative overflow-hidden">
        <div className="flex gap-8 transition-transform duration-500 ease-in-out">
          {/* Desktop: Show 3 cards, Mobile: Show 1 card */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-8 w-full">
            {visibleEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                locale={locale}
              />
            ))}
          </div>

          {/* Mobile: Show 1 card at a time */}
          <div className="lg:hidden w-full">
            <EventCard
              event={visibleEvents[0]}
              locale={locale}
            />
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {events.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-brand-red hover:bg-brand-red-dark text-white p-3 rounded-full transition-all hover:scale-110 z-10 shadow-lg"
            aria-label="Previous event"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-brand-red hover:bg-brand-red-dark text-white p-3 rounded-full transition-all hover:scale-110 z-10 shadow-lg"
            aria-label="Next event"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {events.length > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {events.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'w-8 bg-brand-red'
                  : 'w-2 bg-gray-600 hover:bg-gray-500'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
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
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent"></div>
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-brand-red transition-colors">
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
