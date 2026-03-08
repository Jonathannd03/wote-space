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

const STEPS = [
  { fr: 'Espace', en: 'Space' },
  { fr: 'Date', en: 'Date' },
  { fr: 'Infos', en: 'Details' },
  { fr: 'Confirm.', en: 'Review' },
];

export default function BookingPage() {
  const t = useTranslations('booking');
  const tCommon = useTranslations('common');
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
        setCalculationDetails({ hours, days, rateType: 'daily', rate: space.pricePerDay });
      } else {
        const price = hours * space.pricePerHour;
        setTotalPrice(price);
        setCalculationDetails({ hours, days: 0, rateType: 'hourly', rate: space.pricePerHour });
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
    // Scroll to top of page on mobile after selecting
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
    } else if (step === 3) {
      isValid = await trigger(['firstName', 'lastName', 'email']);
    }
    if (isValid) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fr = locale === 'fr';

  if (success) {
    return (
      <div className="min-h-screen bg-brand-black py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-brand-black-light border border-brand-red rounded-sm p-8 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h1 className="text-3xl font-bold text-white mb-3">
              {fr ? 'Demande reçue !' : 'Request received!'}
            </h1>
            <p className="text-gray-300 mb-6">
              {fr
                ? 'Votre demande de réservation a bien été transmise à notre équipe.'
                : 'Your booking request has been sent to our team.'}
            </p>

            <div className="bg-brand-black border border-brand-black-light p-4 rounded-sm mb-8">
              <p className="text-sm text-gray-400 mb-1">{t('reference')}</p>
              <p className="text-2xl font-bold text-white">{bookingRef}</p>
            </div>

            <div className="bg-brand-red/10 border-2 border-brand-red rounded-sm p-6 mb-8">
              <p className="text-white font-semibold text-lg mb-2">
                {fr ? 'Pour finaliser votre réservation, appelez-nous :' : 'To complete your booking, please call us:'}
              </p>
              <a href="tel:+243980244431" className="text-3xl font-black text-brand-red hover:text-brand-red-light transition-colors">
                +243 980 244 431
              </a>
              <p className="text-gray-400 text-sm mt-3">
                {fr ? 'Mentionnez votre numéro de référence lors de l\'appel.' : 'Please mention your reference number when you call.'}
              </p>
            </div>

            <a
              href={`/${locale}`}
              className="inline-block bg-brand-red text-white px-8 py-3 rounded-sm font-semibold hover:bg-brand-red-dark transition-colors uppercase tracking-wider"
            >
              {fr ? 'Retour à l\'accueil' : 'Back to home'}
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-black pb-24 lg:pb-16 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-3">{t('title')}</h1>
          <div className="h-1 w-24 bg-brand-red mb-0 mx-auto"></div>
        </div>

        {/* Progress Steps */}
        <div className="max-w-2xl mx-auto mb-8 px-2">
          {/* Mobile: step label */}
          <p className="text-center text-brand-red text-sm font-semibold uppercase tracking-widest mb-4 sm:hidden">
            {fr ? `Étape ${step} sur 4` : `Step ${step} of 4`} — {STEPS[step - 1][fr ? 'fr' : 'en']}
          </p>

          <div className="flex items-center">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-9 h-9 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-sm sm:text-base transition-all ${
                      step > s
                        ? 'bg-brand-red text-white'
                        : step === s
                        ? 'bg-brand-red text-white ring-4 ring-brand-red/30'
                        : 'bg-brand-black-light text-gray-500 border-2 border-brand-black-light'
                    }`}
                  >
                    {step > s ? (
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : s}
                  </div>
                  <p className={`hidden sm:block text-xs mt-2 font-medium ${step >= s ? 'text-white' : 'text-gray-500'}`}>
                    {STEPS[s - 1][fr ? 'fr' : 'en']}
                  </p>
                </div>
                {s < 4 && (
                  <div className={`h-0.5 flex-1 mx-1 sm:mx-3 transition-all ${step > s ? 'bg-brand-red' : 'bg-brand-black-light'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: compact selected space banner (steps 2-4) */}
        {selectedSpace && step > 1 && (
          <div className="lg:hidden mb-4 bg-brand-black-light border border-brand-red/40 rounded-sm px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">{fr ? 'Espace sélectionné' : 'Selected space'}</p>
              <p className="text-white font-semibold text-sm">{fr ? selectedSpace.nameFr : selectedSpace.nameEn}</p>
            </div>
            {totalPrice > 0 && (
              <div className="text-right">
                <p className="text-xs text-gray-400">{fr ? 'Estimation' : 'Estimate'}</p>
                <p className="text-brand-red font-black text-lg">{formatPrice(totalPrice)}</p>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-brand-black-light border border-brand-black-light rounded-sm p-5 sm:p-8">

              {/* Step 1: Select Space */}
              {step === 1 && (
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                    {fr ? 'Choisissez votre espace' : 'Choose your space'}
                  </h2>
                  <p className="text-gray-400 text-sm mb-6">
                    {fr ? 'Appuyez sur un espace pour le sélectionner et continuer.' : 'Tap a space to select it and continue.'}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {spaces.map((space) => (
                      <button
                        key={space.id}
                        type="button"
                        onClick={() => handleSpaceSelect(space)}
                        className={`text-left p-5 rounded-sm border-2 transition-all active:scale-95 ${
                          selectedSpace?.id === space.id
                            ? 'border-brand-red bg-brand-red/10'
                            : 'border-brand-black-light hover:border-brand-red/50 active:border-brand-red'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-white mb-2 leading-tight">
                              {fr ? space.nameFr : space.nameEn}
                            </h3>
                            <div className="flex items-center text-gray-400 mb-3 text-sm">
                              <svg className="w-4 h-4 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              <span>{fr ? 'Jusqu\'à' : 'Up to'} {space.capacity} {fr ? 'personnes' : 'people'}</span>
                            </div>
                            <div className="flex flex-wrap gap-2 text-sm">
                              <span className="bg-brand-black px-2 py-1 rounded-sm text-brand-red font-semibold">
                                {formatPrice(space.pricePerHour)}/h
                              </span>
                              <span className="bg-brand-black px-2 py-1 rounded-sm text-brand-red font-semibold">
                                {formatPrice(space.pricePerDay)}/{fr ? 'jour' : 'day'}
                              </span>
                            </div>
                          </div>
                          {/* Arrow indicating tappable */}
                          <svg className="w-5 h-5 text-brand-red flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
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
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                    {fr ? 'Date et durée' : 'Date & Duration'}
                  </h2>
                  <p className="text-gray-400 text-sm mb-6">
                    {fr ? 'Sélectionnez une date puis choisissez vos horaires.' : 'Pick a date then set your start and end times.'}
                  </p>

                  {/* Availability Calendar */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-300 mb-3">
                      {fr ? 'Sélectionnez une date' : 'Select a date'}
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
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-300 mb-3">
                      {fr ? 'Durée rapide (optionnel)' : 'Quick duration (optional)'}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {DURATION_PRESETS.map((preset) => (
                        <button
                          key={preset.hours}
                          type="button"
                          onClick={() => applyDurationPreset(preset.hours)}
                          className="px-3 py-3 bg-brand-black border border-brand-black-light hover:border-brand-red active:bg-brand-red/10 rounded-sm text-white text-sm font-semibold transition-all"
                        >
                          {fr ? preset.label : preset.labelEn}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        {fr ? 'Date de début' : 'Start date'} *
                      </label>
                      <input
                        type="date"
                        {...register('startDate')}
                        className="w-full px-3 py-3 bg-brand-black border border-brand-black-light rounded-sm focus:ring-2 focus:ring-brand-red focus:border-brand-red text-white text-sm"
                        min={new Date().toISOString().split('T')[0]}
                      />
                      {errors.startDate && <p className="mt-1 text-xs text-brand-red">{errors.startDate.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        {fr ? 'Heure de début' : 'Start time'} *
                      </label>
                      <input
                        type="time"
                        {...register('startTime')}
                        className="w-full px-3 py-3 bg-brand-black border border-brand-black-light rounded-sm focus:ring-2 focus:ring-brand-red focus:border-brand-red text-white text-sm"
                      />
                      {errors.startTime && <p className="mt-1 text-xs text-brand-red">{errors.startTime.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        {fr ? 'Date de fin' : 'End date'} *
                      </label>
                      <input
                        type="date"
                        {...register('endDate')}
                        className="w-full px-3 py-3 bg-brand-black border border-brand-black-light rounded-sm focus:ring-2 focus:ring-brand-red focus:border-brand-red text-white text-sm"
                        min={new Date().toISOString().split('T')[0]}
                      />
                      {errors.endDate && <p className="mt-1 text-xs text-brand-red">{errors.endDate.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        {fr ? 'Heure de fin' : 'End time'} *
                      </label>
                      <input
                        type="time"
                        {...register('endTime')}
                        className="w-full px-3 py-3 bg-brand-black border border-brand-black-light rounded-sm focus:ring-2 focus:ring-brand-red focus:border-brand-red text-white text-sm"
                      />
                      {errors.endTime && <p className="mt-1 text-xs text-brand-red">{errors.endTime.message}</p>}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      {fr ? 'Nombre de participants' : 'Number of participants'} *
                    </label>
                    <input
                      type="number"
                      {...register('numberOfPeople', { valueAsNumber: true })}
                      min="1"
                      max={selectedSpace?.capacity}
                      className="w-full px-3 py-3 bg-brand-black border border-brand-black-light rounded-sm focus:ring-2 focus:ring-brand-red focus:border-brand-red text-white text-sm"
                    />
                    {selectedSpace && (
                      <p className="mt-1 text-xs text-gray-400">
                        {fr ? 'Capacité maximale' : 'Maximum capacity'}: {selectedSpace.capacity}
                      </p>
                    )}
                    {errors.numberOfPeople && <p className="mt-1 text-xs text-brand-red">{errors.numberOfPeople.message}</p>}
                  </div>

                  <AvailabilityChecker
                    startDate={watchedValues.startDate || ''}
                    startTime={watchedValues.startTime || ''}
                    endDate={watchedValues.endDate || ''}
                    endTime={watchedValues.endTime || ''}
                    locale={locale as 'en' | 'fr'}
                    onAvailabilityChange={setIsAvailable}
                  />

                  {/* Desktop buttons */}
                  <div className="hidden sm:flex gap-4 mt-6">
                    <button type="button" onClick={prevStep} className="flex-1 bg-brand-black border-2 border-brand-red text-white py-4 rounded-sm font-bold hover:bg-brand-red transition-colors uppercase tracking-wider">
                      {fr ? 'Retour' : 'Back'}
                    </button>
                    <button type="button" onClick={nextStep} disabled={!isAvailable} className="flex-1 bg-brand-red text-white py-4 rounded-sm font-bold hover:bg-brand-red-dark transition-colors uppercase tracking-wider disabled:bg-gray-600 disabled:cursor-not-allowed">
                      {fr ? 'Continuer' : 'Continue'}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Personal Details */}
              {step === 3 && (
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                    {fr ? 'Vos informations' : 'Your information'}
                  </h2>
                  <p className="text-gray-400 text-sm mb-6">
                    {fr ? 'Renseignez vos coordonnées pour que nous puissions vous contacter.' : 'Fill in your details so we can reach you to confirm.'}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">{fr ? 'Prénom' : 'First name'} *</label>
                      <input
                        type="text"
                        {...register('firstName')}
                        className="w-full px-3 py-3 bg-brand-black border border-brand-black-light rounded-sm focus:ring-2 focus:ring-brand-red focus:border-brand-red text-white"
                      />
                      {errors.firstName && <p className="mt-1 text-xs text-brand-red">{errors.firstName.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">{fr ? 'Nom' : 'Last name'} *</label>
                      <input
                        type="text"
                        {...register('lastName')}
                        className="w-full px-3 py-3 bg-brand-black border border-brand-black-light rounded-sm focus:ring-2 focus:ring-brand-red focus:border-brand-red text-white"
                      />
                      {errors.lastName && <p className="mt-1 text-xs text-brand-red">{errors.lastName.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Email *</label>
                      <input
                        type="email"
                        {...register('email')}
                        className="w-full px-3 py-3 bg-brand-black border border-brand-black-light rounded-sm focus:ring-2 focus:ring-brand-red focus:border-brand-red text-white"
                      />
                      {errors.email && <p className="mt-1 text-xs text-brand-red">{errors.email.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">{fr ? 'Téléphone' : 'Phone'}</label>
                      <input
                        type="tel"
                        {...register('phone')}
                        className="w-full px-3 py-3 bg-brand-black border border-brand-black-light rounded-sm focus:ring-2 focus:ring-brand-red focus:border-brand-red text-white"
                      />
                    </div>
                  </div>

                  <div className="mb-5">
                    <label className="block text-sm font-semibold text-gray-300 mb-2">{fr ? 'Organisation' : 'Organisation'}</label>
                    <input
                      type="text"
                      {...register('company')}
                      className="w-full px-3 py-3 bg-brand-black border border-brand-black-light rounded-sm focus:ring-2 focus:ring-brand-red focus:border-brand-red text-white"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-300 mb-2">{fr ? 'Notes additionnelles' : 'Additional notes'}</label>
                    <textarea
                      {...register('notes')}
                      rows={3}
                      className="w-full px-3 py-3 bg-brand-black border border-brand-black-light rounded-sm focus:ring-2 focus:ring-brand-red focus:border-brand-red text-white"
                      placeholder={fr ? 'Besoins spécifiques, équipements, etc.' : 'Special needs, equipment, etc.'}
                    />
                  </div>

                  {/* Desktop buttons */}
                  <div className="hidden sm:flex gap-4">
                    <button type="button" onClick={prevStep} className="flex-1 bg-brand-black border-2 border-brand-red text-white py-4 rounded-sm font-bold hover:bg-brand-red transition-colors uppercase tracking-wider">
                      {fr ? 'Retour' : 'Back'}
                    </button>
                    <button type="button" onClick={nextStep} className="flex-1 bg-brand-red text-white py-4 rounded-sm font-bold hover:bg-brand-red-dark transition-colors uppercase tracking-wider">
                      {fr ? 'Continuer' : 'Continue'}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Review & Confirm */}
              {step === 4 && (
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                    {fr ? 'Vérifiez vos informations' : 'Review your booking'}
                  </h2>
                  <p className="text-gray-400 text-sm mb-6">
                    {fr ? 'Tout est correct ? Confirmez pour envoyer votre demande.' : 'Everything looks good? Confirm to send your request.'}
                  </p>

                  <div className="space-y-4">
                    <div className="bg-brand-black border border-brand-black-light rounded-sm p-5">
                      <h3 className="text-sm font-semibold text-brand-red mb-3 uppercase tracking-wider">{fr ? 'Espace' : 'Space'}</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">{fr ? 'Espace' : 'Space'}:</span>
                          <span className="text-white font-semibold">{selectedSpace && (fr ? selectedSpace.nameFr : selectedSpace.nameEn)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">{fr ? 'Participants' : 'Participants'}:</span>
                          <span className="text-white font-semibold">{watchedValues.numberOfPeople}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-brand-black border border-brand-black-light rounded-sm p-5">
                      <h3 className="text-sm font-semibold text-brand-red mb-3 uppercase tracking-wider">{fr ? 'Date & Heure' : 'Date & Time'}</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">{fr ? 'Début' : 'Start'}:</span>
                          <span className="text-white font-semibold text-right">
                            {watchedValues.startDate && new Date(watchedValues.startDate).toLocaleDateString(fr ? 'fr-FR' : 'en-US', { weekday: 'short', day: 'numeric', month: 'short' })} {watchedValues.startTime}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">{fr ? 'Fin' : 'End'}:</span>
                          <span className="text-white font-semibold text-right">
                            {watchedValues.endDate && new Date(watchedValues.endDate).toLocaleDateString(fr ? 'fr-FR' : 'en-US', { weekday: 'short', day: 'numeric', month: 'short' })} {watchedValues.endTime}
                          </span>
                        </div>
                        {calculationDetails && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">{fr ? 'Durée' : 'Duration'}:</span>
                            <span className="text-white font-semibold">
                              {calculationDetails.hours.toFixed(1)}h{calculationDetails.days > 0 && ` (${calculationDetails.days} ${fr ? 'jour(s)' : 'day(s)'})`}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-brand-black border border-brand-black-light rounded-sm p-5">
                      <h3 className="text-sm font-semibold text-brand-red mb-3 uppercase tracking-wider">{fr ? 'Vos Informations' : 'Your Details'}</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">{fr ? 'Nom' : 'Name'}:</span>
                          <span className="text-white font-semibold">{watchedValues.firstName} {watchedValues.lastName}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Email:</span>
                          <span className="text-white font-semibold break-all text-right">{watchedValues.email}</span>
                        </div>
                        {watchedValues.phone && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">{fr ? 'Téléphone' : 'Phone'}:</span>
                            <span className="text-white font-semibold">{watchedValues.phone}</span>
                          </div>
                        )}
                        {watchedValues.company && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">{fr ? 'Organisation' : 'Organisation'}:</span>
                            <span className="text-white font-semibold">{watchedValues.company}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-brand-red/10 border-2 border-brand-red rounded-sm p-5">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-white">{fr ? 'Prix estimé' : 'Estimated price'}:</span>
                        <span className="text-3xl font-black text-brand-red">{formatPrice(totalPrice)}</span>
                      </div>
                      {calculationDetails && (
                        <p className="text-xs text-gray-400 mt-2">
                          {calculationDetails.rateType === 'daily'
                            ? `${formatPrice(calculationDetails.rate)} × ${calculationDetails.days} ${fr ? 'jour(s)' : 'day(s)'}`
                            : `${formatPrice(calculationDetails.rate)} × ${calculationDetails.hours.toFixed(1)}h`}
                        </p>
                      )}
                    </div>
                  </div>

                  {error && (
                    <div className="bg-brand-red/10 border border-brand-red rounded-sm p-4 mt-4">
                      <p className="text-brand-red text-sm">{error}</p>
                    </div>
                  )}

                  {/* Desktop buttons */}
                  <div className="hidden sm:flex gap-4 mt-6">
                    <button type="button" onClick={prevStep} className="flex-1 bg-brand-black border-2 border-brand-red text-white py-4 rounded-sm font-bold hover:bg-brand-red transition-colors uppercase tracking-wider">
                      {fr ? 'Modifier' : 'Edit'}
                    </button>
                    <button type="submit" disabled={loading} className="flex-1 bg-brand-red text-white py-4 rounded-sm font-bold hover:bg-brand-red-dark transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed uppercase tracking-wider">
                      {loading ? (fr ? 'Envoi...' : 'Sending...') : (fr ? 'Confirmer la demande' : 'Send request')}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Price Summary Sidebar — desktop only */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-brand-black-light border-2 border-brand-red rounded-sm p-6">
                <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-wider">
                  {fr ? 'Résumé' : 'Summary'}
                </h3>

                {selectedSpace ? (
                  <>
                    <div className="mb-6 pb-6 border-b border-brand-black-light">
                      <p className="text-sm text-gray-400 mb-1">{fr ? 'Espace' : 'Space'}</p>
                      <p className="text-lg font-semibold text-white">{fr ? selectedSpace.nameFr : selectedSpace.nameEn}</p>
                      <p className="text-sm text-gray-400 mt-1">{fr ? 'Capacité' : 'Capacity'}: {selectedSpace.capacity} {fr ? 'personnes' : 'people'}</p>
                    </div>

                    {calculationDetails && (
                      <>
                        <div className="mb-6 pb-6 border-b border-brand-black-light">
                          <p className="text-sm text-gray-400 mb-2">{fr ? 'Durée' : 'Duration'}</p>
                          <p className="text-white font-semibold">{calculationDetails.hours.toFixed(1)}h{calculationDetails.days > 0 && ` · ${calculationDetails.days} ${fr ? 'jour(s)' : 'day(s)'}`}</p>
                        </div>
                        <div className="mb-6 pb-6 border-b border-brand-black-light">
                          <p className="text-sm text-gray-400 mb-2">{fr ? 'Tarif' : 'Rate'}</p>
                          <p className="text-white">
                            {formatPrice(calculationDetails.rate)}/{calculationDetails.rateType === 'daily' ? (fr ? 'jour' : 'day') : 'h'}
                          </p>
                        </div>
                      </>
                    )}

                    <div className="bg-brand-red/10 border border-brand-red rounded-sm p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-white">Total:</span>
                        <span className="text-3xl font-black text-brand-red">{totalPrice > 0 ? formatPrice(totalPrice) : '$0'}</span>
                      </div>
                    </div>

                    {calculationDetails?.rateType === 'daily' && (
                      <p className="text-xs text-gray-400 mt-3 text-center">
                        {fr ? '* Tarif journalier appliqué (≥8h)' : '* Daily rate applied (≥8h)'}
                      </p>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <svg className="w-12 h-12 mx-auto text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <p className="text-gray-400 text-sm">{fr ? 'Sélectionnez un espace pour commencer' : 'Select a space to get started'}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky bottom action bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-brand-black-light border-t border-brand-black-light px-4 py-3 z-40">
        {step === 1 ? (
          <p className="text-center text-gray-400 text-sm py-1">
            {fr ? 'Appuyez sur un espace ci-dessus pour continuer' : 'Tap a space above to continue'}
          </p>
        ) : (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={prevStep}
              className="flex-none bg-brand-black border-2 border-brand-red text-white px-5 py-3.5 rounded-sm font-bold transition-colors active:bg-brand-red uppercase text-sm"
            >
              {fr ? 'Retour' : 'Back'}
            </button>
            {step < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={step === 2 && !isAvailable}
                className="flex-1 bg-brand-red text-white py-3.5 rounded-sm font-bold transition-colors active:bg-brand-red-dark uppercase tracking-wider text-sm disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                {fr ? 'Continuer' : 'Continue'}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={loading}
                className="flex-1 bg-brand-red text-white py-3.5 rounded-sm font-bold transition-colors active:bg-brand-red-dark uppercase tracking-wider text-sm disabled:bg-gray-600"
              >
                {loading ? (fr ? 'Envoi...' : 'Sending...') : (fr ? 'Confirmer' : 'Confirm')}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
