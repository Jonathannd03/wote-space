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

const AUTOPLAY_INTERVAL = 5000; // ms between slides
const RESUME_AFTER = 6000;      // ms after manual interaction before autoplay resumes

export default function EventsCarousel({ events, locale }: EventsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [progress, setProgress] = useState(0);      // 0–100 for the progress bar
  const touchStartX = useRef<number | null>(null);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % events.length);
    setProgress(0);
  }, [events.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
    setProgress(0);
  }, [events.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
    setProgress(0);
  }, []);

  // Pause autoplay and schedule a resume
  const pauseAndScheduleResume = useCallback(() => {
    setIsAutoPlaying(false);
    setProgress(0);
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => {
      setIsAutoPlaying(true);
    }, RESUME_AFTER);
  }, []);

  // Autoplay interval
  useEffect(() => {
    if (!isAutoPlaying || events.length <= 1) return;
    const interval = setInterval(goToNext, AUTOPLAY_INTERVAL);
    return () => clearInterval(interval);
  }, [isAutoPlaying, goToNext, events.length]);

  // Progress bar tick
  useEffect(() => {
    if (!isAutoPlaying || events.length <= 1) {
      setProgress(0);
      return;
    }
    setProgress(0);
    const step = 100 / (AUTOPLAY_INTERVAL / 50); // update every 50ms
    const ticker = setInterval(() => {
      setProgress((p) => Math.min(p + step, 100));
    }, 50);
    return () => clearInterval(ticker);
  }, [isAutoPlaying, currentIndex, events.length]);

  // Cleanup resume timer on unmount
  useEffect(() => () => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
  }, []);

  // Touch swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) {
      pauseAndScheduleResume();
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
      onMouseEnter={() => { setIsAutoPlaying(false); setProgress(0); }}
      onMouseLeave={() => { setIsAutoPlaying(true); }}
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

      {/* Navigation */}
      {events.length > 1 && (
        <div className="flex flex-col items-center gap-3 mt-8">
          {/* Progress bar — shows autoplay state */}
          <div className="w-48 h-0.5 bg-brand-black-light rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-red rounded-full transition-none"
              style={{ width: `${isAutoPlaying ? progress : 0}%` }}
            />
          </div>

          {/* Arrow — Dots — Arrow */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => { goToPrevious(); pauseAndScheduleResume(); }}
              className="bg-brand-black-light hover:bg-brand-red border border-brand-red text-white p-3 rounded-full transition-all touch-manipulation"
              aria-label="Previous event"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex gap-2">
              {events.map((_, index) => (
                <button
                  key={index}
                  onClick={() => { goToSlide(index); pauseAndScheduleResume(); }}
                  className={`h-2 rounded-full transition-all touch-manipulation ${
                    index === currentIndex ? 'w-8 bg-brand-red' : 'w-2 bg-gray-600 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => { goToNext(); pauseAndScheduleResume(); }}
              className="bg-brand-black-light hover:bg-brand-red border border-brand-red text-white p-3 rounded-full transition-all touch-manipulation"
              aria-label="Next event"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
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
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent" />
        {/* "View" badge — always visible on mobile */}
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
