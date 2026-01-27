'use client';

import { useState, useEffect } from 'react';

interface AvailabilityCheckerProps {
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  locale: 'en' | 'fr';
  onAvailabilityChange?: (available: boolean) => void;
}

interface Conflict {
  id: string;
  startDate: string;
  endDate: string;
  spaceName: string;
  customerName: string;
}

export default function AvailabilityChecker({
  startDate,
  startTime,
  endDate,
  endTime,
  locale,
  onAvailabilityChange,
}: AvailabilityCheckerProps) {
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [conflicts, setConflicts] = useState<Conflict[]>([]);

  useEffect(() => {
    // Only check if we have all required fields
    if (!startDate || !startTime || !endDate || !endTime) {
      setAvailable(null);
      setConflicts([]);
      if (onAvailabilityChange) onAvailabilityChange(true);
      return;
    }

    const checkAvailability = async () => {
      setChecking(true);
      try {
        const start = `${startDate}T${startTime}`;
        const end = `${endDate}T${endTime}`;

        const response = await fetch('/api/availability/check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            startDate: start,
            endDate: end,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setAvailable(data.available);
          setConflicts(data.conflicts || []);
          if (onAvailabilityChange) {
            onAvailabilityChange(data.available);
          }
        } else {
          setAvailable(null);
          setConflicts([]);
        }
      } catch (error) {
        console.error('Error checking availability:', error);
        setAvailable(null);
        setConflicts([]);
      } finally {
        setChecking(false);
      }
    };

    // Debounce the check to avoid too many API calls
    const timeout = setTimeout(checkAvailability, 500);
    return () => clearTimeout(timeout);
  }, [startDate, startTime, endDate, endTime, onAvailabilityChange]);

  // Don't show anything if we're still waiting for input
  if (!startDate || !startTime || !endDate || !endTime) {
    return null;
  }

  return (
    <div className="mb-6">
      {checking && (
        <div className="flex items-center gap-3 p-4 bg-brand-black border border-brand-black-light rounded-sm">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-brand-red"></div>
          <span className="text-gray-300 text-sm">
            {locale === 'fr' ? 'Vérification de la disponibilité...' : 'Checking availability...'}
          </span>
        </div>
      )}

      {!checking && available === true && (
        <div className="flex items-start gap-3 p-4 bg-green-900/20 border border-green-500/50 rounded-sm">
          <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="text-green-400 font-semibold mb-1">
              {locale === 'fr' ? 'Disponible' : 'Available'}
            </h4>
            <p className="text-green-300 text-sm">
              {locale === 'fr'
                ? 'La salle est disponible pour ces dates'
                : 'The room is available for these dates'}
            </p>
          </div>
        </div>
      )}

      {!checking && available === false && (
        <div className="flex items-start gap-3 p-4 bg-red-900/20 border border-brand-red rounded-sm">
          <svg className="w-6 h-6 text-brand-red flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <h4 className="text-brand-red font-semibold mb-1">
              {locale === 'fr' ? 'Non disponible' : 'Not Available'}
            </h4>
            <p className="text-red-300 text-sm mb-3">
              {locale === 'fr'
                ? 'La salle est déjà réservée pour cette période'
                : 'The room is already booked for this time period'}
            </p>

            {conflicts.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-gray-400 font-semibold uppercase">
                  {locale === 'fr' ? 'Réservations existantes:' : 'Existing bookings:'}
                </p>
                {conflicts.map(conflict => (
                  <div key={conflict.id} className="bg-brand-black/50 p-3 rounded-sm text-sm">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-white font-medium">{conflict.spaceName}</span>
                      <span className="text-gray-400 text-xs">{conflict.customerName}</span>
                    </div>
                    <div className="text-gray-400 text-xs">
                      {new Date(conflict.startDate).toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      {' → '}
                      {new Date(conflict.endDate).toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
