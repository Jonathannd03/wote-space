'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { formatPrice } from '@/lib/utils';
import AvailabilityCalendar from '@/components/AvailabilityCalendar';
import { SLOTS, SlotKey } from '@/lib/mock-data';

// ─── Special packs ────────────────────────────────────────────────────────────
type SpecialPackKey = 'students' | 'community' | 'ngo' | 'training' | 'conference_pro' | 'weekly_coworking' | 'monthly_coworking';

const SPECIAL_PACKS: Record<SpecialPackKey, {
  labelFr: string; labelEn: string;
  descFr: string;  descEn: string;
  price: number;   periodFr: string; periodEn: string;
  includedFr: string[]; includedEn: string[];
  coworkingOnly?: boolean;
}> = {
  students:         { labelFr: 'Pack Étudiants / Écoles',      labelEn: 'Students / Schools Pack',    price: 40,  periodFr: 'demi-journée', periodEn: 'half-day', descFr: '25–40 personnes · $10/h (min. 2h)', descEn: '25–40 people · $10/h (min. 2h)', includedFr: ['Salle configurée (25–40 pers.)', 'Projecteur ou écran', 'Wi-Fi'], includedEn: ['Configured room (25–40 people)', 'Projector or screen', 'Wi-Fi'] },
  community:        { labelFr: 'Pack Communauté',               labelEn: 'Community Pack',             price: 150, periodFr: 'mois',        periodEn: 'month',    descFr: '26–40 personnes · ~4 réunions/mois', descEn: '26–40 people · ~4 meetings/month', includedFr: ['Salle configurée', 'Projecteur ou écran', 'Wi-Fi', '4 séances demi-journée / mois'], includedEn: ['Configured room', 'Projector or screen', 'Wi-Fi', '4 half-day sessions / month'] },
  ngo:              { labelFr: 'Pack Réunion ONG',              labelEn: 'NGO Meeting Pack',           price: 200, periodFr: 'mois',        periodEn: 'month',    descFr: '26–40 personnes · jusqu\'à 6 réunions/mois', descEn: '26–40 people · up to 6 meetings/month', includedFr: ['Salle configurée', 'Projecteur ou écran', 'Wi-Fi', 'Jusqu\'à 6 séances / mois', 'Accès prioritaire', 'Facturation mensuelle'], includedEn: ['Configured room', 'Projector or screen', 'Wi-Fi', 'Up to 6 sessions / month', 'Priority access', 'Monthly invoicing'] },
  training:         { labelFr: 'Pack Formation',                labelEn: 'Training Pack',              price: 130, periodFr: 'jour',        periodEn: 'day',      descFr: '26–40 personnes · journée complète', descEn: '26–40 people · full day', includedFr: ['Salle journée complète', 'Projecteur + sonorisation', 'Wi-Fi premium', 'Photographie (2h)'], includedEn: ['Full-day room', 'Projector + sound system', 'Premium Wi-Fi', 'Photography (2h)'] },
  conference_pro:   { labelFr: 'Pack Conférence Pro',           labelEn: 'Pro Conference Pack',        price: 180, periodFr: 'jour',        periodEn: 'day',      descFr: '41–60 personnes · journée complète', descEn: '41–60 people · full day', includedFr: ['Salle XL journée complète', 'Projecteur + sonorisation', 'Wi-Fi premium', 'Photographie complète', 'Assistance technique'], includedEn: ['Full-day XL room', 'Projector + sound', 'Premium Wi-Fi', 'Full photography', 'Technical assistance'] },
  weekly_coworking: { labelFr: 'Forfait Semaine — Coworking',   labelEn: 'Weekly Pass — Coworking',    price: 12,  periodFr: 'semaine',     periodEn: 'week',     descFr: '5 jours consécutifs (lun–ven)', descEn: '5 consecutive days (Mon–Fri)', includedFr: ['Accès journalier illimité sur 1 semaine', 'Wi-Fi + espaces communs'], includedEn: ['Unlimited daily access for 1 week', 'Wi-Fi + common areas'], coworkingOnly: true },
  monthly_coworking:{ labelFr: 'Forfait Mensuel — Coworking',   labelEn: 'Monthly Pass — Coworking',   price: 40,  periodFr: 'mois',        periodEn: 'month',    descFr: '~20 jours ouvrables (1 mois)', descEn: '~20 working days (1 month)', includedFr: ['Accès illimité sur 1 mois calendaire', 'Wi-Fi + espaces communs'], includedEn: ['Unlimited access for 1 calendar month', 'Wi-Fi + common areas'], coworkingOnly: true },
};

const isSpecialPack = (slot: string): slot is SpecialPackKey => slot in SPECIAL_PACKS;
// ──────────────────────────────────────────────────────────────────────────────

const bookingSchema = z.object({
  spaceId: z.string().min(1, 'Space is required'),
  slot: z.enum(['morning', 'afternoon', 'fullday', 'bundle5', 'bundle10', 'students', 'community', 'ngo', 'training', 'conference_pro', 'weekly_coworking', 'monthly_coworking'] as const),
  date: z.string().optional(),
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
  priceHalfDay: number;
  priceFullDay: number;
  priceBundle5: number;
  priceBundle10: number;
}

const STEPS = [
  { fr: 'Espace', en: 'Space' },
  { fr: 'Créneau', en: 'Slot' },
  { fr: 'Infos', en: 'Details' },
  { fr: 'Confirm.', en: 'Review' },
];

function getSlotPrice(space: Space, slot: string): number {
  if (isSpecialPack(slot)) return SPECIAL_PACKS[slot].price;
  switch (slot) {
    case 'morning':
    case 'afternoon': return space.priceHalfDay;
    case 'fullday':   return space.priceFullDay;
    case 'bundle5':   return space.priceBundle5;
    case 'bundle10':  return space.priceBundle10;
    default:          return 0;
  }
}

const isBundle = (slot: string) => ['bundle5', 'bundle10', 'community', 'ngo', 'weekly_coworking', 'monthly_coworking'].includes(slot);

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
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);

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
  const selectedSlot = watchedValues.slot as SlotKey | SpecialPackKey | undefined;
  const totalPrice = selectedSpace && selectedSlot ? getSlotPrice(selectedSpace, selectedSlot) : 0;

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

  const onSubmit = async (data: BookingFormData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDateLocal = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const nextStep = async () => {
    let isValid = false;
    if (step === 1) {
      isValid = await trigger('spaceId');
    } else if (step === 2) {
      isValid = await trigger(['slot', 'numberOfPeople']);
      if (isValid && !watchedValues.date) {
        isValid = false;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
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

  // Slot card config
  const slotCards: { key: SlotKey; icon: React.ReactNode; badge?: string }[] = [
    {
      key: 'morning',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-13l-.87.5M4.21 17.5l-.87.5M20.66 17.5l-.87-.5M4.21 6.5l-.87-.5M21 12h-1M4 12H3m15.36-6.36l-.7.7M6.34 17.66l-.7.7M17.66 17.66l.7.7M6.34 6.34l.7.7" />
          <circle cx="12" cy="12" r="4" strokeWidth={2} />
        </svg>
      ),
    },
    {
      key: 'afternoon',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      key: 'fullday',
      badge: fr ? 'Meilleure valeur' : 'Best value',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      key: 'bundle5',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      key: 'bundle10',
      badge: fr ? 'Le plus économique' : 'Best deal',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
    },
  ];

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
                {fr ? "Mentionnez votre numéro de référence lors de l'appel." : 'Please mention your reference number when you call.'}
              </p>
            </div>

            <a
              href={`/${locale}`}
              className="inline-block bg-brand-red text-white px-8 py-3 rounded-sm font-semibold hover:bg-brand-red-dark transition-colors uppercase tracking-wider"
            >
              {fr ? "Retour à l'accueil" : 'Back to home'}
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
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-3">{t('title')}</h1>
          <div className="h-1 w-24 bg-brand-red mb-0 mx-auto"></div>
        </div>


        {/* Progress Steps */}
        <div className="max-w-2xl mx-auto mb-8 px-2">
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
                <p className="text-xs text-gray-400">{fr ? 'Tarif' : 'Price'}</p>
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
                              <span>{fr ? "Jusqu'à" : 'Up to'} {space.capacity} {fr ? 'personnes' : 'people'}</span>
                            </div>
                            <div className="flex flex-wrap gap-2 text-xs">
                              <span className="bg-brand-black px-2 py-1 rounded-sm text-brand-red font-semibold">
                                {formatPrice(space.priceHalfDay)} / {fr ? 'demi-j.' : 'half-day'}
                              </span>
                              <span className="bg-brand-black px-2 py-1 rounded-sm text-brand-red font-semibold">
                                {formatPrice(space.priceFullDay)} / {fr ? 'journée' : 'day'}
                              </span>
                              <span className="bg-brand-black px-2 py-1 rounded-sm text-gray-400">
                                {fr ? 'Pack 5 :' : '5-pack:'} {formatPrice(space.priceBundle5)}
                              </span>
                              <span className="bg-brand-black px-2 py-1 rounded-sm text-gray-400">
                                {fr ? 'Pack 10 :' : '10-pack:'} {formatPrice(space.priceBundle10)}
                              </span>
                            </div>
                          </div>
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

              {/* Step 2: Select Slot */}
              {step === 2 && (
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                    {fr ? 'Date & créneau' : 'Date & time slot'}
                  </h2>
                  <p className="text-gray-400 text-sm mb-6">
                    {fr
                      ? 'Choisissez une date puis sélectionnez votre créneau.'
                      : 'Pick a date then choose your time slot.'}
                  </p>

                  {/* Date picker — always visible */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-300 mb-3">
                      {selectedSlot && isBundle(selectedSlot)
                        ? (fr ? 'Date de début souhaitée *' : 'Preferred start date *')
                        : (fr ? 'Date de la session *' : 'Session date *')}
                    </label>
                    {selectedSlot && isBundle(selectedSlot) && (
                      <p className="text-xs text-gray-500 mb-3">
                        {fr
                          ? 'Les dates des séances suivantes seront convenues par téléphone.'
                          : 'Dates for subsequent sessions will be arranged by phone.'}
                      </p>
                    )}
                    <AvailabilityCalendar
                      locale={locale as 'en' | 'fr'}
                      selectedDate={watchedValues.date ? new Date(watchedValues.date) : undefined}
                      onDateSelect={(date) => setValue('date', formatDateLocal(date))}
                    />
                    {!watchedValues.date && (
                      <p className="mt-2 text-xs text-brand-red">
                        {fr ? 'Veuillez sélectionner une date.' : 'Please select a date.'}
                      </p>
                    )}
                  </div>

                  {/* Slot cards */}
                  <div className="space-y-3 mb-6">
                    {/* Single sessions */}
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      {fr ? 'Sessions individuelles' : 'Single sessions'}
                    </p>
                    {slotCards.slice(0, 3).map(({ key, icon, badge }) => {
                      const slot = SLOTS[key];
                      const price = selectedSpace ? getSlotPrice(selectedSpace, key) : 0;
                      const isSelected = selectedSlot === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setValue('slot', key)}
                          className={`w-full text-left p-4 rounded-sm border-2 transition-all active:scale-[0.99] ${
                            isSelected
                              ? 'border-brand-red bg-brand-red/10'
                              : 'border-brand-black-light hover:border-brand-red/40'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className={`flex-shrink-0 p-2 rounded-sm ${isSelected ? 'bg-brand-red text-white' : 'bg-brand-black text-gray-400'}`}>
                                {icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-bold text-white text-sm">
                                    {fr ? slot.labelFr : slot.labelEn}
                                  </span>
                                  {badge && (
                                    <span className="text-xs bg-brand-red text-white px-2 py-0.5 rounded-sm font-semibold uppercase tracking-wide">
                                      {badge}
                                    </span>
                                  )}
                                </div>
                                <span className="text-xs text-gray-400">
                                  {fr ? slot.timeFr : slot.timeEn}
                                </span>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <span className={`text-lg font-black ${isSelected ? 'text-brand-red' : 'text-white'}`}>
                                {formatPrice(price)}
                              </span>
                            </div>
                          </div>
                        </button>
                      );
                    })}

                    {/* Session packs */}
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-5 mb-2">
                      {fr ? 'Forfaits multi-séances' : 'Session packs'}
                    </p>
                    <div className="bg-brand-black rounded-sm p-1">
                      {slotCards.slice(3).map(({ key, icon, badge }) => {
                        const slot = SLOTS[key];
                        const price = selectedSpace ? getSlotPrice(selectedSpace, key) : 0;
                        const isSelected = selectedSlot === key;
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setValue('slot', key)}
                            className={`w-full text-left p-4 rounded-sm border-2 transition-all active:scale-[0.99] mb-2 last:mb-0 ${
                              isSelected
                                ? 'border-brand-red bg-brand-red/10'
                                : 'border-transparent hover:border-brand-red/40 bg-brand-black-light'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className={`flex-shrink-0 p-2 rounded-sm ${isSelected ? 'bg-brand-red text-white' : 'bg-brand-black text-gray-400'}`}>
                                  {icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-bold text-white text-sm">
                                      {fr ? slot.labelFr : slot.labelEn}
                                    </span>
                                    {badge && (
                                      <span className="text-xs bg-brand-red text-white px-2 py-0.5 rounded-sm font-semibold uppercase tracking-wide">
                                        {badge}
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-xs text-gray-400">
                                    {fr ? slot.timeFr : slot.timeEn}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <span className={`text-lg font-black ${isSelected ? 'text-brand-red' : 'text-white'}`}>
                                  {formatPrice(price)}
                                </span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Special packs */}
                  {(() => {
                    const isCoworking = selectedSpace?.capacity === 1;
                    const packs = (Object.entries(SPECIAL_PACKS) as [SpecialPackKey, typeof SPECIAL_PACKS[SpecialPackKey]][])
                      .filter(([, p]) => !p.coworkingOnly || isCoworking);
                    return (
                      <>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-5 mb-2">
                          {fr ? 'Packs spéciaux' : 'Special packs'}
                        </p>
                        <div className="space-y-2">
                          {packs.map(([key, pack]) => {
                            const isSelected = selectedSlot === key;
                            return (
                              <button
                                key={key}
                                type="button"
                                onClick={() => setValue('slot', key as any)}
                                className={`w-full text-left p-4 rounded-sm border-2 transition-all active:scale-[0.99] ${isSelected ? 'border-brand-red bg-brand-red/10' : 'border-brand-black-light hover:border-brand-red/40'}`}
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                      <span className="font-bold text-white text-sm">{fr ? pack.labelFr : pack.labelEn}</span>
                                    </div>
                                    <p className="text-xs text-gray-400 mb-2">{fr ? pack.descFr : pack.descEn}</p>
                                    {isSelected && (
                                      <ul className="space-y-0.5 mt-2">
                                        {(fr ? pack.includedFr : pack.includedEn).map((item, i) => (
                                          <li key={i} className="flex items-center gap-1.5 text-xs text-gray-300">
                                            <svg className="w-3 h-3 text-brand-red flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                            {item}
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                  </div>
                                  <div className="text-right flex-shrink-0">
                                    <span className={`text-lg font-black ${isSelected ? 'text-brand-red' : 'text-white'}`}>
                                      {formatPrice(pack.price)}
                                    </span>
                                    <p className="text-xs text-gray-500">/ {fr ? pack.periodFr : pack.periodEn}</p>
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </>
                    );
                  })()}

                  {errors.slot && (
                    <p className="text-sm text-brand-red mb-4">{errors.slot.message}</p>
                  )}

                  {/* Number of participants */}
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

                  {/* Desktop buttons */}
                  <div className="hidden sm:flex gap-4 mt-6">
                    <button type="button" onClick={prevStep} className="flex-1 bg-brand-black border-2 border-brand-red text-white py-4 rounded-sm font-bold hover:bg-brand-red transition-colors uppercase tracking-wider">
                      {fr ? 'Retour' : 'Back'}
                    </button>
                    <button type="button" onClick={nextStep} className="flex-1 bg-brand-red text-white py-4 rounded-sm font-bold hover:bg-brand-red-dark transition-colors uppercase tracking-wider">
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
                      <h3 className="text-sm font-semibold text-brand-red mb-3 uppercase tracking-wider">{fr ? 'Créneau' : 'Time Slot'}</h3>
                      {selectedSlot && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">{fr ? 'Type' : 'Type'}:</span>
                            <span className="text-white font-semibold">
                              {isSpecialPack(selectedSlot)
                                ? (fr ? SPECIAL_PACKS[selectedSlot].labelFr : SPECIAL_PACKS[selectedSlot].labelEn)
                                : (fr ? SLOTS[selectedSlot as SlotKey].labelFr : SLOTS[selectedSlot as SlotKey].labelEn)}
                            </span>
                          </div>
                          {isSpecialPack(selectedSlot) && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">{fr ? 'Détails' : 'Details'}:</span>
                              <span className="text-white font-semibold text-right max-w-[60%]">
                                {fr ? SPECIAL_PACKS[selectedSlot].descFr : SPECIAL_PACKS[selectedSlot].descEn}
                              </span>
                            </div>
                          )}
                          {!isSpecialPack(selectedSlot) && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">{fr ? 'Horaires' : 'Hours'}:</span>
                              <span className="text-white font-semibold">
                                {fr ? SLOTS[selectedSlot as SlotKey].timeFr : SLOTS[selectedSlot as SlotKey].timeEn}
                              </span>
                            </div>
                          )}
                          {watchedValues.date && !isBundle(selectedSlot) && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">{fr ? 'Date' : 'Date'}:</span>
                              <span className="text-white font-semibold">
                                {new Date(watchedValues.date).toLocaleDateString(fr ? 'fr-FR' : 'en-US', {
                                  weekday: 'short', day: 'numeric', month: 'long', year: 'numeric',
                                })}
                              </span>
                            </div>
                          )}
                          {isBundle(selectedSlot) && (
                            <p className="text-xs text-gray-400 italic mt-1">
                              {fr ? 'Les dates seront convenues par téléphone.' : 'Dates will be arranged by phone.'}
                            </p>
                          )}
                        </div>
                      )}
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
                        <span className="text-lg font-bold text-white">{fr ? 'Total' : 'Total'}:</span>
                        <span className="text-3xl font-black text-brand-red">{formatPrice(totalPrice)}</span>
                      </div>
                      {selectedSlot && (
                        <p className="text-xs text-gray-400 mt-2">
                          {isSpecialPack(selectedSlot)
                            ? (fr ? SPECIAL_PACKS[selectedSlot].labelFr : SPECIAL_PACKS[selectedSlot].labelEn)
                            : (fr ? SLOTS[selectedSlot as SlotKey].labelFr : SLOTS[selectedSlot as SlotKey].labelEn)}
                          {!isSpecialPack(selectedSlot) && ' · '}
                          {!isSpecialPack(selectedSlot) && (fr ? SLOTS[selectedSlot as SlotKey].timeFr : SLOTS[selectedSlot as SlotKey].timeEn)}
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

                    {selectedSlot && (
                      <div className="mb-6 pb-6 border-b border-brand-black-light">
                        <p className="text-sm text-gray-400 mb-2">{fr ? 'Créneau' : 'Slot'}</p>
                        <p className="text-white font-semibold">
                          {isSpecialPack(selectedSlot)
                            ? (fr ? SPECIAL_PACKS[selectedSlot].labelFr : SPECIAL_PACKS[selectedSlot].labelEn)
                            : (fr ? SLOTS[selectedSlot as SlotKey].labelFr : SLOTS[selectedSlot as SlotKey].labelEn)}
                        </p>
                        <p className="text-sm text-gray-400">
                          {isSpecialPack(selectedSlot)
                            ? (fr ? SPECIAL_PACKS[selectedSlot].descFr : SPECIAL_PACKS[selectedSlot].descEn)
                            : (fr ? SLOTS[selectedSlot as SlotKey].timeFr : SLOTS[selectedSlot as SlotKey].timeEn)}
                        </p>
                        {watchedValues.date && !isBundle(selectedSlot) && (
                          <p className="text-sm text-gray-300 mt-1">
                            {new Date(watchedValues.date).toLocaleDateString(fr ? 'fr-FR' : 'en-US', {
                              day: 'numeric', month: 'long', year: 'numeric',
                            })}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="bg-brand-red/10 border border-brand-red rounded-sm p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-white">Total:</span>
                        <span className="text-3xl font-black text-brand-red">
                          {totalPrice > 0 ? formatPrice(totalPrice) : '—'}
                        </span>
                      </div>
                    </div>

                    {/* Pricing reference */}
                    <div className="mt-5 space-y-1.5">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">{fr ? 'Tarifs' : 'Rates'}</p>
                      {(['morning', 'fullday', 'bundle5', 'bundle10'] as SlotKey[]).map((k) => (
                        <div key={k} className="flex justify-between text-xs">
                          <span className="text-gray-400">{fr ? SLOTS[k].labelFr : SLOTS[k].labelEn}</span>
                          <span className={selectedSlot === k ? 'text-brand-red font-bold' : 'text-gray-300'}>
                            {selectedSpace ? formatPrice(getSlotPrice(selectedSpace, k)) : '—'}
                          </span>
                        </div>
                      ))}
                    </div>
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
                className="flex-1 bg-brand-red text-white py-3.5 rounded-sm font-bold transition-colors active:bg-brand-red-dark uppercase tracking-wider text-sm"
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
