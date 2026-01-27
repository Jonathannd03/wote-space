'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { formatPrice } from '@/lib/utils';
import AvailabilityCalendar from '@/components/AvailabilityCalendar';
import AvailabilityChecker from '@/components/AvailabilityChecker';

const bookingSchema = z.object({
  spaceId: z.string().min(1, 'Space is required'),
  startDate: z.string().min(1, 'Start date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endDate: z.string().min(1, 'End date is required'),
  endTime: z.string().min(1, 'End time is required'),
  numberOfPeople: z.number().min(1, 'At least 1 person required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  notes: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface Space {
  id: string;
  nameEn: string;
  nameFr: string;
  capacity: number;
  pricePerHour: number;
  pricePerDay: number;
}

const DURATION_PRESETS = [
  { hours: 2, label: '2 heures', labelEn: '2 hours' },
  { hours: 4, label: '4 heures', labelEn: '4 hours' },
  { hours: 8, label: 'Journée', labelEn: 'Full day' },
  { hours: 16, label: '2 jours', labelEn: '2 days' },
];

export default function BookingPage() {
  const t = useTranslations('booking');
  const locale = useLocale();
  const searchParams = useSearchParams();
  const preselectedSpaceId = searchParams.get('space');

  const [step, setStep] = useState(1);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingRef, setBookingRef] = useState<string | null>(null);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [calculationDetails, setCalculationDetails] = useState<{
    hours: number;
    days: number;
    rateType: 'hourly' | 'daily';
    rate: number;
  } | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean>(true);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    trigger,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      spaceId: preselectedSpaceId || '',
      numberOfPeople: 1,
    },
  });

  const watchedValues = watch();

  // Fetch spaces
  useEffect(() => {
    fetch('/api/spaces')
      .then((res) => res.json())
      .then((data) => {
        setSpaces(data);
        if (preselectedSpaceId) {
          const preselected = data.find((s: Space) => s.id === preselectedSpaceId);
          if (preselected) {
            setSelectedSpace(preselected);
            setValue('spaceId', preselectedSpaceId);
          }
        }
      })
      .catch((err) => console.error('Error fetching spaces:', err));
  }, [preselectedSpaceId, setValue]);

  // Calculate total price
  useEffect(() => {
    if (!watchedValues.spaceId || !watchedValues.startDate || !watchedValues.endDate || !watchedValues.startTime || !watchedValues.endTime) {
      setTotalPrice(0);
      setCalculationDetails(null);
      return;
    }

    const space = spaces.find((s) => s.id === watchedValues.spaceId);
    if (!space) return;

    const start = new Date(`${watchedValues.startDate}T${watchedValues.startTime}`);
    const end = new Date(`${watchedValues.endDate}T${watchedValues.endTime}`);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

    if (hours > 0) {
      if (hours >= 8) {
        const days = Math.ceil(hours / 24);
        const price = days * space.pricePerDay;
        setTotalPrice(price);
        setCalculationDetails({
          hours,
          days,
          rateType: 'daily',
          rate: space.pricePerDay,
        });
      } else {
        const price = hours * space.pricePerHour;
        setTotalPrice(price);
        setCalculationDetails({
          hours,
          days: 0,
          rateType: 'hourly',
          rate: space.pricePerHour,
        });
      }
    } else {
      setTotalPrice(0);
      setCalculationDetails(null);
    }
  }, [watchedValues.spaceId, watchedValues.startDate, watchedValues.endDate, watchedValues.startTime, watchedValues.endTime, spaces]);

  const onSubmit = async (data: BookingFormData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          startDate: `${data.startDate}T${data.startTime}`,
          endDate: `${data.endDate}T${data.endTime}`,
          totalPrice,
          locale,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Booking failed');
      }

      setSuccess(true);
      setBookingRef(result.referenceId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSpaceSelect = (space: Space) => {
    setSelectedSpace(space);
    setValue('spaceId', space.id);
    setStep(2);
  };

  // Helper to format date in local timezone (avoids UTC conversion issues)
  const formatDateLocal = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const applyDurationPreset = (hours: number) => {
    const now = new Date();
    const startDate = new Date(now);
    startDate.setHours(9, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + hours);

    setValue('startDate', formatDateLocal(startDate));
    setValue('startTime', '09:00');
    setValue('endDate', formatDateLocal(endDate));
    setValue('endTime', endDate.toTimeString().slice(0, 5));
  };

  const nextStep = async () => {
    let isValid = false;

    if (step === 1) {
      isValid = await trigger('spaceId');
    } else if (step === 2) {
      isValid = await trigger(['startDate', 'startTime', 'endDate', 'endTime', 'numberOfPeople']);
    }

    if (isValid || step === 3) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-brand-black py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-brand-black-light border border-brand-red rounded-sm p-8 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-3xl font-bold text-white mb-4">{t('success')}</h1>
            <p className="text-lg text-gray-300 mb-2">{t('successMessage')}</p>
            <p className="text-lg font-semibold text-brand-red mb-6">{watchedValues.email}</p>
            <div className="bg-brand-black border border-brand-black-light p-4 rounded-sm mb-6">
              <p className="text-sm text-gray-400 mb-1">{t('reference')}</p>
              <p className="text-2xl font-bold text-white">{bookingRef}</p>
            </div>
            <a
              href={`/${locale}`}
              className="inline-block bg-brand-red text-white px-8 py-3 rounded-sm font-semibold hover:bg-brand-red-dark transition-colors uppercase tracking-wider"
            >
              {t('common.back')}
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-black py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">{t('title')}</h1>
          <div className="h-1 w-24 bg-brand-red mb-6 mx-auto"></div>
        </div>

        {/* Progress Steps */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                      step >= s
                        ? 'bg-brand-red text-white'
                        : 'bg-brand-black-light text-gray-500 border-2 border-brand-black-light'
                    }`}
                  >
                    {s}
                  </div>
                  <p className={`text-sm mt-2 ${step >= s ? 'text-white' : 'text-gray-500'}`}>
                    {s === 1
                      ? locale === 'fr'
                        ? 'Espace'
                        : 'Space'
                      : s === 2
                      ? locale === 'fr'
                        ? 'Date & Durée'
                        : 'Date & Time'
                      : locale === 'fr'
                      ? 'Informations'
                      : 'Details'}
                  </p>
                </div>
                {s < 3 && (
                  <div
                    className={`h-1 flex-1 mx-4 ${
                      step > s ? 'bg-brand-red' : 'bg-brand-black-light'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-brand-black-light border border-brand-black-light rounded-sm p-8">

              {/* Step 1: Select Space */}
              {step === 1 && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">
                    {locale === 'fr' ? 'Choisissez votre espace' : 'Choose your space'}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {spaces.map((space) => (
                      <button
                        key={space.id}
                        type="button"
                        onClick={() => handleSpaceSelect(space)}
                        className={`text-left p-6 rounded-sm border-2 transition-all ${
                          selectedSpace?.id === space.id
                            ? 'border-brand-red bg-brand-red/10'
                            : 'border-brand-black-light hover:border-brand-red/50'
                        }`}
                      >
                        <h3 className="text-xl font-bold text-white mb-2">
                          {locale === 'fr' ? space.nameFr : space.nameEn}
                        </h3>
                        <div className="flex items-center text-gray-400 mb-3">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span>{locale === 'fr' ? 'Jusqu\'à' : 'Up to'} {space.capacity} {locale === 'fr' ? 'personnes' : 'people'}</span>
                        </div>
                        <div className="flex gap-2 text-sm">
                          <span className="bg-brand-black px-3 py-1 rounded-sm text-brand-red font-semibold">
                            {formatPrice(space.pricePerHour)}/h
                          </span>
                          <span className="bg-brand-black px-3 py-1 rounded-sm text-brand-red font-semibold">
                            {formatPrice(space.pricePerDay)}/{locale === 'fr' ? 'jour' : 'day'}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                  {errors.spaceId && (
                    <p className="mt-4 text-sm text-brand-red">{errors.spaceId.message}</p>
                  )}
                </div>
              )}

              {/* Step 2: Select Date & Time */}
              {step === 2 && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">
                    {locale === 'fr' ? 'Date et durée' : 'Date & Duration'}
                  </h2>

                  {/* Availability Calendar */}
                  <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      {locale === 'fr' ? 'Sélectionnez une date' : 'Select a date'}
                    </label>
                    <AvailabilityCalendar
                      locale={locale as 'en' | 'fr'}
                      selectedDate={watchedValues.startDate ? new Date(watchedValues.startDate) : undefined}
                      onDateSelect={(date) => {
                        setValue('startDate', formatDateLocal(date));
                        setValue('endDate', formatDateLocal(date));
                      }}
                    />
                  </div>

                  {/* Quick Presets */}
                  <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      {locale === 'fr' ? 'Durée rapide' : 'Quick Duration'}
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {DURATION_PRESETS.map((preset) => (
                        <button
                          key={preset.hours}
                          type="button"
                          onClick={() => applyDurationPreset(preset.hours)}
                          className="px-4 py-3 bg-brand-black border border-brand-black-light hover:border-brand-red rounded-sm text-white font-semibold transition-all"
                        >
                          {locale === 'fr' ? preset.label : preset.labelEn}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {locale === 'fr' ? 'Date de début' : 'Start Date'} *
                      </label>
                      <input
                        type="date"
                        {...register('startDate')}
                        className="w-full px-4 py-3 bg-brand-black border border-brand-black-light rounded-sm focus:ring-2 focus:ring-brand-red focus:border-brand-red text-white"
                        min={new Date().toISOString().split('T')[0]}
                      />
                      {errors.startDate && (
                        <p className="mt-1 text-sm text-brand-red">{errors.startDate.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {locale === 'fr' ? 'Heure de début' : 'Start Time'} *
                      </label>
                      <input
                        type="time"
                        {...register('startTime')}
                        className="w-full px-4 py-3 bg-brand-black border border-brand-black-light rounded-sm focus:ring-2 focus:ring-brand-red focus:border-brand-red text-white"
                      />
                      {errors.startTime && (
                        <p className="mt-1 text-sm text-brand-red">{errors.startTime.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {locale === 'fr' ? 'Date de fin' : 'End Date'} *
                      </label>
                      <input
                        type="date"
                        {...register('endDate')}
                        className="w-full px-4 py-3 bg-brand-black border border-brand-black-light rounded-sm focus:ring-2 focus:ring-brand-red focus:border-brand-red text-white"
                        min={new Date().toISOString().split('T')[0]}
                      />
                      {errors.endDate && (
                        <p className="mt-1 text-sm text-brand-red">{errors.endDate.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {locale === 'fr' ? 'Heure de fin' : 'End Time'} *
                      </label>
                      <input
                        type="time"
                        {...register('endTime')}
                        className="w-full px-4 py-3 bg-brand-black border border-brand-black-light rounded-sm focus:ring-2 focus:ring-brand-red focus:border-brand-red text-white"
                      />
                      {errors.endTime && (
                        <p className="mt-1 text-sm text-brand-red">{errors.endTime.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {locale === 'fr' ? 'Nombre de personnes' : 'Number of People'} *
                    </label>
                    <input
                      type="number"
                      {...register('numberOfPeople', { valueAsNumber: true })}
                      min="1"
                      max={selectedSpace?.capacity}
                      className="w-full px-4 py-3 bg-brand-black border border-brand-black-light rounded-sm focus:ring-2 focus:ring-brand-red focus:border-brand-red text-white"
                    />
                    {selectedSpace && (
                      <p className="mt-1 text-sm text-gray-400">
                        {locale === 'fr' ? 'Capacité maximale' : 'Maximum capacity'}: {selectedSpace.capacity}
                      </p>
                    )}
                    {errors.numberOfPeople && (
                      <p className="mt-1 text-sm text-brand-red">{errors.numberOfPeople.message}</p>
                    )}
                  </div>

                  {/* Real-time Availability Check */}
                  <AvailabilityChecker
                    startDate={watchedValues.startDate || ''}
                    startTime={watchedValues.startTime || ''}
                    endDate={watchedValues.endDate || ''}
                    endTime={watchedValues.endTime || ''}
                    locale={locale as 'en' | 'fr'}
                    onAvailabilityChange={setIsAvailable}
                  />

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex-1 bg-brand-black border-2 border-brand-red text-white py-4 rounded-sm font-bold hover:bg-brand-red transition-colors uppercase tracking-wider"
                    >
                      {locale === 'fr' ? 'Retour' : 'Back'}
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={!isAvailable}
                      className="flex-1 bg-brand-red text-white py-4 rounded-sm font-bold hover:bg-brand-red-dark transition-colors uppercase tracking-wider disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                      {locale === 'fr' ? 'Continuer' : 'Continue'}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Personal Details */}
              {step === 3 && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">
                    {locale === 'fr' ? 'Vos informations' : 'Your Information'}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {locale === 'fr' ? 'Prénom' : 'First Name'} *
                      </label>
                      <input
                        type="text"
                        {...register('firstName')}
                        className="w-full px-4 py-3 bg-brand-black border border-brand-black-light rounded-sm focus:ring-2 focus:ring-brand-red focus:border-brand-red text-white"
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-brand-red">{errors.firstName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {locale === 'fr' ? 'Nom' : 'Last Name'} *
                      </label>
                      <input
                        type="text"
                        {...register('lastName')}
                        className="w-full px-4 py-3 bg-brand-black border border-brand-black-light rounded-sm focus:ring-2 focus:ring-brand-red focus:border-brand-red text-white"
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-brand-red">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {locale === 'fr' ? 'Email' : 'Email'} *
                      </label>
                      <input
                        type="email"
                        {...register('email')}
                        className="w-full px-4 py-3 bg-brand-black border border-brand-black-light rounded-sm focus:ring-2 focus:ring-brand-red focus:border-brand-red text-white"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-brand-red">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {locale === 'fr' ? 'Téléphone' : 'Phone'}
                      </label>
                      <input
                        type="tel"
                        {...register('phone')}
                        className="w-full px-4 py-3 bg-brand-black border border-brand-black-light rounded-sm focus:ring-2 focus:ring-brand-red focus:border-brand-red text-white"
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {locale === 'fr' ? 'Entreprise' : 'Company'}
                    </label>
                    <input
                      type="text"
                      {...register('company')}
                      className="w-full px-4 py-3 bg-brand-black border border-brand-black-light rounded-sm focus:ring-2 focus:ring-brand-red focus:border-brand-red text-white"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {locale === 'fr' ? 'Notes additionnelles' : 'Additional Notes'}
                    </label>
                    <textarea
                      {...register('notes')}
                      rows={4}
                      className="w-full px-4 py-3 bg-brand-black border border-brand-black-light rounded-sm focus:ring-2 focus:ring-brand-red focus:border-brand-red text-white"
                      placeholder={locale === 'fr' ? 'Besoins spécifiques, équipements, etc.' : 'Special needs, equipment, etc.'}
                    />
                  </div>

                  {error && (
                    <div className="bg-brand-red/10 border border-brand-red rounded-sm p-4 mb-6">
                      <p className="text-brand-red">{error}</p>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex-1 bg-brand-black border-2 border-brand-red text-white py-4 rounded-sm font-bold hover:bg-brand-red transition-colors uppercase tracking-wider"
                    >
                      {locale === 'fr' ? 'Retour' : 'Back'}
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-brand-red text-white py-4 rounded-sm font-bold hover:bg-brand-red-dark transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed uppercase tracking-wider"
                    >
                      {loading ? (locale === 'fr' ? 'Chargement...' : 'Loading...') : (locale === 'fr' ? 'Confirmer la réservation' : 'Confirm Booking')}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Price Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-brand-black-light border-2 border-brand-red rounded-sm p-6">
                <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-wider">
                  {locale === 'fr' ? 'Résumé' : 'Summary'}
                </h3>

                {selectedSpace ? (
                  <>
                    {/* Selected Space */}
                    <div className="mb-6 pb-6 border-b border-brand-black-light">
                      <p className="text-sm text-gray-400 mb-2">
                        {locale === 'fr' ? 'Espace' : 'Space'}
                      </p>
                      <p className="text-lg font-semibold text-white">
                        {locale === 'fr' ? selectedSpace.nameFr : selectedSpace.nameEn}
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        {locale === 'fr' ? 'Capacité' : 'Capacity'}: {selectedSpace.capacity} {locale === 'fr' ? 'personnes' : 'people'}
                      </p>
                    </div>

                    {/* Duration & Price Calculation */}
                    {calculationDetails && (
                      <>
                        <div className="mb-6 pb-6 border-b border-brand-black-light">
                          <p className="text-sm text-gray-400 mb-3">
                            {locale === 'fr' ? 'Durée' : 'Duration'}
                          </p>
                          <div className="space-y-2">
                            <div className="flex justify-between text-white">
                              <span>{locale === 'fr' ? 'Heures' : 'Hours'}:</span>
                              <span className="font-semibold">
                                {calculationDetails.hours.toFixed(1)}h
                              </span>
                            </div>
                            {calculationDetails.days > 0 && (
                              <div className="flex justify-between text-white">
                                <span>{locale === 'fr' ? 'Jours' : 'Days'}:</span>
                                <span className="font-semibold">
                                  {calculationDetails.days}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="mb-6 pb-6 border-b border-brand-black-light">
                          <p className="text-sm text-gray-400 mb-3">
                            {locale === 'fr' ? 'Calcul' : 'Calculation'}
                          </p>
                          <div className="space-y-2">
                            <div className="flex justify-between text-white">
                              <span>
                                {calculationDetails.rateType === 'daily'
                                  ? locale === 'fr'
                                    ? 'Tarif journalier'
                                    : 'Daily rate'
                                  : locale === 'fr'
                                  ? 'Tarif horaire'
                                  : 'Hourly rate'}:
                              </span>
                              <span className="font-semibold">
                                {formatPrice(calculationDetails.rate)}
                              </span>
                            </div>
                            {calculationDetails.rateType === 'daily' ? (
                              <div className="flex justify-between text-gray-400 text-sm">
                                <span>
                                  {calculationDetails.days} {locale === 'fr' ? 'jour(s)' : 'day(s)'} × {formatPrice(calculationDetails.rate)}
                                </span>
                              </div>
                            ) : (
                              <div className="flex justify-between text-gray-400 text-sm">
                                <span>
                                  {calculationDetails.hours.toFixed(1)}h × {formatPrice(calculationDetails.rate)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}

                    {/* Total Price */}
                    <div className="bg-brand-red/10 border border-brand-red rounded-sm p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-white">
                          {locale === 'fr' ? 'Total' : 'Total'}:
                        </span>
                        <span className="text-3xl font-black text-brand-red">
                          {totalPrice > 0 ? formatPrice(totalPrice) : '$0'}
                        </span>
                      </div>
                    </div>

                    {calculationDetails && calculationDetails.rateType === 'daily' && (
                      <p className="text-xs text-gray-400 mt-3 text-center">
                        {locale === 'fr'
                          ? '* Tarif journalier appliqué (≥8h)'
                          : '* Daily rate applied (≥8h)'}
                      </p>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <svg
                      className="w-16 h-16 mx-auto text-gray-600 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    <p className="text-gray-400 text-sm">
                      {locale === 'fr'
                        ? 'Sélectionnez un espace pour commencer'
                        : 'Select a space to get started'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
