'use client';

import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, startOfWeek, endOfWeek, addMonths, subMonths } from 'date-fns';

interface Booking {
  id: string;
  startDate: string;
  endDate: string;
  spaceName: string;
  customerName: string;
}

interface AvailabilityCalendarProps {
  locale: 'en' | 'fr';
  onDateSelect?: (date: Date) => void;
  selectedDate?: Date;
}

export default function AvailabilityCalendar({
  locale,
  onDateSelect,
  selectedDate,
}: AvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch bookings for the current month
  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const response = await fetch(`/api/availability/calendar?year=${year}&month=${month}`);
        const data = await response.json();
        setBookings(data.bookings || []);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [currentMonth]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const weekDays = locale === 'fr'
    ? ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
    : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const isDayBooked = (day: Date) => {
    return bookings.some(booking => {
      const bookingStart = new Date(booking.startDate);
      const bookingEnd = new Date(booking.endDate);
      return day >= bookingStart && day <= bookingEnd;
    });
  };

  const isPastDay = (day: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return day < today;
  };

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleDayClick = (day: Date) => {
    if (!isPastDay(day) && !isDayBooked(day) && onDateSelect) {
      onDateSelect(day);
    }
  };

  return (
    <div className="bg-brand-black-light border border-brand-black-light rounded-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="p-2 hover:bg-brand-black rounded-sm transition-colors"
          aria-label="Previous month"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <h3 className="text-xl font-bold text-white">
          {format(currentMonth, 'MMMM yyyy', { locale: locale === 'fr' ? undefined : undefined })}
        </h3>

        <button
          type="button"
          onClick={handleNextMonth}
          className="p-2 hover:bg-brand-black rounded-sm transition-colors"
          aria-label="Next month"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="text-center py-4 text-gray-400">
          {locale === 'fr' ? 'Chargement...' : 'Loading...'}
        </div>
      )}

      {/* Calendar grid */}
      {!loading && (
        <div className="grid grid-cols-7 gap-1">
          {/* Week day headers */}
          {weekDays.map(day => (
            <div
              key={day}
              className="text-center text-sm font-semibold text-gray-400 py-2"
            >
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {days.map(day => {
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isBooked = isDayBooked(day);
            const isPast = isPastDay(day);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isToday = isSameDay(day, new Date());

            return (
              <button
                key={day.toISOString()}
                type="button"
                onClick={() => handleDayClick(day)}
                disabled={isPast || isBooked}
                className={`
                  aspect-square p-2 rounded-sm text-sm font-medium transition-all relative
                  ${!isCurrentMonth ? 'text-gray-600' : ''}
                  ${isToday ? 'ring-2 ring-brand-red' : ''}
                  ${isSelected ? 'bg-brand-red text-white' : ''}
                  ${isBooked ? 'bg-red-900/30 text-gray-600 cursor-not-allowed' : ''}
                  ${isPast ? 'text-gray-700 cursor-not-allowed' : ''}
                  ${!isPast && !isBooked && !isSelected ? 'text-white hover:bg-brand-red/20' : ''}
                `}
              >
                {format(day, 'd')}

                {/* Booked indicator */}
                {isBooked && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                    <div className="w-1 h-1 bg-brand-red rounded-full"></div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-brand-black-light">
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-brand-red rounded-sm"></div>
            <span className="text-gray-400">
              {locale === 'fr' ? 'Sélectionné' : 'Selected'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-900/30 rounded-sm relative">
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-brand-red rounded-full"></div>
            </div>
            <span className="text-gray-400">
              {locale === 'fr' ? 'Réservé' : 'Booked'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-brand-black-light border-2 border-brand-red rounded-sm"></div>
            <span className="text-gray-400">
              {locale === 'fr' ? 'Aujourd\'hui' : 'Today'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
