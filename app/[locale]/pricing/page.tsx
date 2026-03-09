import { getLocale } from 'next-intl/server';
import Link from 'next/link';
import { MOCK_SPACES, SLOTS } from '@/lib/mock-data';
import { formatPrice } from '@/lib/utils';
import InfoTooltip from '@/components/InfoTooltip';

export default async function PricingPage() {
  const locale = await getLocale();
  const fr = locale === 'fr';

  // Room setups (all except coworking)
  const roomSetups = MOCK_SPACES.filter((s) => s.capacity > 1);
  const coworking = MOCK_SPACES.find((s) => s.capacity === 1)!;

  // Tooltip content
  const tooltips = {
    morning: fr
      ? 'Session de 4h de 8h00 à 12h00. La salle doit être libérée à 12h00 précises pour permettre la session suivante.'
      : '4-hour session from 8:00 AM to 12:00 PM. The room must be vacated at 12:00 PM sharp to allow the next session.',
    afternoon: fr
      ? 'Session de 4h30 de 13h00 à 17h30. La salle doit être libérée à 17h30 précises.'
      : '4.5-hour session from 1:00 PM to 5:30 PM. The room must be vacated at 5:30 PM sharp.',
    fullday: fr
      ? 'Accès continu de 8h00 à 17h30 (9h30 au total). Idéal pour les formations longues, conférences ou ateliers en plusieurs parties. Économique comparé à deux demi-journées séparées.'
      : 'Continuous access from 8:00 AM to 5:30 PM (9.5 hours total). Ideal for long trainings, conferences, or multi-part workshops. Saves money vs. two separate half-day slots.',
    bundle5: fr
      ? 'Achetez 5 séances (demi-journées) à l\'avance à un tarif réduit. Les dates sont convenues par téléphone selon vos besoins. Valable pour les créneaux matin ou après-midi. Non remboursable, valable 6 mois.'
      : 'Pre-purchase 5 sessions (half-days) at a reduced rate. Dates are arranged by phone according to your schedule. Valid for morning or afternoon slots. Non-refundable, valid for 6 months.',
    bundle10: fr
      ? 'Achetez 10 séances (demi-journées) à l\'avance — notre tarif le plus avantageux. Les dates sont convenues par téléphone. Non remboursable, valable 12 mois. Idéal pour les organisations à besoins réguliers.'
      : 'Pre-purchase 10 sessions (half-days) — our best-value rate. Dates are arranged by phone. Non-refundable, valid for 12 months. Ideal for organisations with recurring needs.',
    coworkingBundle: fr
      ? 'Les forfaits coworking fonctionnent comme les forfaits salle : achetez un bloc de séances à l\'avance. Chaque séance = une demi-journée (matin ou après-midi). Dates à convenir par téléphone.'
      : 'Coworking packs work like room packs: pre-purchase a block of sessions. Each session = one half-day (morning or afternoon). Dates arranged by phone.',
    addon: fr
      ? 'Ces équipements sont fournis sur demande lors de la réservation. Le tarif s\'ajoute au prix de la session.'
      : 'Equipment is provided on request at the time of booking. The fee is added to the session price.',
  };

  const addOns = [
    {
      name: fr ? 'Vidéoprojecteur / Écran' : 'Projector / Screen',
      price: fr ? 'Inclus selon configuration' : 'Included in most setups',
      note: fr ? 'Inclus dans les configurations M, L et XL' : 'Included in M, L, and XL setups',
    },
    {
      name: fr ? 'Wi-Fi premium dédié' : 'Dedicated premium Wi-Fi',
      price: fr ? '+5 $ / événement' : '+$5 / event',
    },
    {
      name: fr ? 'Sonorisation (micro + haut-parleurs)' : 'Sound system (mic + speakers)',
      price: fr ? '+10 $ / événement' : '+$10 / event',
    },
    {
      name: fr ? 'Assistance technique' : 'Technical assistance',
      price: fr ? '+10 $ / événement' : '+$10 / event',
    },
  ];

  return (
    <div className="bg-brand-black min-h-screen">

      {/* Hero */}
      <section className="relative py-24 bg-brand-black-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
            {fr ? 'Offres & Tarifs' : 'Offers & Pricing'}
          </h1>
          <div className="h-1 w-32 bg-brand-red mb-8 mx-auto" />
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {fr
              ? 'Des créneaux horaires fixes pour des sessions claires et prévisibles'
              : 'Fixed time slots for clear, predictable sessions'}
          </p>
        </div>
      </section>

      {/* How it works callout */}
      <section className="py-12 bg-brand-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-brand-black-light border-l-4 border-brand-red rounded-sm p-6 flex gap-4">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="w-6 h-6 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg mb-2">
                {fr ? 'Comment fonctionne notre tarification ?' : 'How does our pricing work?'}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-3">
                {fr
                  ? 'Nous travaillons avec des créneaux horaires définis — pas de facturation à l\'heure ouverte. Chaque session a une heure de début et une heure de fin fixe, affichées lors de la réservation. Cela garantit que la salle est toujours disponible à temps pour l\'utilisateur suivant.'
                  : 'We work with defined time slots — no open-ended hourly billing. Each session has a fixed start and end time, displayed at booking. This ensures the room is always available on time for the next user.'}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                {(['morning', 'afternoon', 'fullday'] as const).map((key) => (
                  <div key={key} className="bg-brand-black rounded-sm px-3 py-2">
                    <p className="text-brand-red font-semibold">{fr ? SLOTS[key].labelFr : SLOTS[key].labelEn}</p>
                    <p className="text-gray-400 text-xs">{fr ? SLOTS[key].timeFr : SLOTS[key].timeEn}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meeting Room Setups */}
      <section className="py-20 bg-brand-black-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4 text-center">
            {fr ? 'La Salle de Réunion' : 'The Meeting Room'}
          </h2>
          <p className="text-center text-gray-400 mb-4">
            {fr
              ? 'Une salle modulable, 4 configurations selon votre effectif'
              : 'One modular room, 4 configurations for your group size'}
          </p>
          <div className="h-1 w-24 bg-brand-red mb-12 mx-auto" />

          {/* Mobile: one card per setup */}
          <div className="lg:hidden space-y-4">
            {roomSetups.map((space) => (
              <div key={space.id} className="bg-brand-black rounded-sm border border-brand-black-light overflow-hidden">
                {/* Card header */}
                <div className="bg-brand-black-light px-4 py-3 border-b border-brand-black-light flex items-center justify-between">
                  <div>
                    <p className="text-white font-bold">{fr ? space.nameFr : space.nameEn}</p>
                    <p className="text-gray-400 text-xs">
                      {fr ? `jusqu'à ${space.capacity} personnes` : `up to ${space.capacity} people`}
                    </p>
                  </div>
                  <svg className="w-5 h-5 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                {/* Slot rows */}
                <div className="divide-y divide-brand-black-light">
                  {/* Single sessions */}
                  <div className="px-4 py-2">
                    <p className="text-xs text-gray-500 uppercase tracking-wider py-1">
                      {fr ? 'Sessions individuelles' : 'Single sessions'}
                    </p>
                  </div>
                  {(['morning', 'afternoon', 'fullday'] as const).map((key) => (
                    <div key={key} className="px-4 py-3 flex items-center justify-between">
                      <div>
                        <p className="text-white text-sm font-medium flex items-center gap-1">
                          {fr ? SLOTS[key].labelFr : SLOTS[key].labelEn}
                          <InfoTooltip content={tooltips[key]} position="top" />
                        </p>
                        <p className="text-gray-500 text-xs">{fr ? SLOTS[key].timeFr : SLOTS[key].timeEn}</p>
                      </div>
                      <span className="text-brand-red font-black text-lg">
                        {formatPrice(key === 'fullday' ? space.priceFullDay : space.priceHalfDay)}
                      </span>
                    </div>
                  ))}
                  {/* Packs */}
                  <div className="px-4 py-2 bg-brand-black/50">
                    <p className="text-xs text-gray-500 uppercase tracking-wider py-1">
                      {fr ? 'Forfaits multi-séances' : 'Session packs'}
                    </p>
                  </div>
                  {(['bundle5', 'bundle10'] as const).map((key) => {
                    const price = key === 'bundle5' ? space.priceBundle5 : space.priceBundle10;
                    const count = key === 'bundle5' ? 5 : 10;
                    return (
                      <div key={key} className="px-4 py-3 flex items-center justify-between bg-brand-black/50">
                        <div>
                          <p className="text-white text-sm font-medium flex items-center gap-1">
                            {fr ? SLOTS[key].labelFr : SLOTS[key].labelEn}
                            <InfoTooltip content={tooltips[key]} position="top" />
                          </p>
                          <p className="text-gray-500 text-xs">
                            {fr ? SLOTS[key].timeFr : SLOTS[key].timeEn} · {formatPrice(price / count)}/{fr ? 'séance' : 'session'}
                          </p>
                        </div>
                        <span className="text-brand-red font-black text-lg">{formatPrice(price)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: full table */}
          <div className="hidden lg:block overflow-x-auto rounded-sm border border-brand-black-light">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b-2 border-brand-red bg-brand-black">
                  <th className="py-4 px-5 text-white font-bold text-sm">
                    {fr ? 'Configuration' : 'Setup'}
                  </th>
                  <th className="py-4 px-5 text-white font-bold text-sm">
                    {fr ? 'Capacité' : 'Capacity'}
                  </th>
                  <th className="py-4 px-5 text-white font-bold text-sm whitespace-nowrap">
                    <span className="flex items-center">
                      {fr ? SLOTS.morning.labelFr : SLOTS.morning.labelEn}
                      <InfoTooltip content={tooltips.morning} position="bottom" />
                    </span>
                    <span className="text-gray-500 font-normal text-xs block">
                      {fr ? SLOTS.morning.timeFr : SLOTS.morning.timeEn}
                    </span>
                  </th>
                  <th className="py-4 px-5 text-white font-bold text-sm whitespace-nowrap">
                    <span className="flex items-center">
                      {fr ? SLOTS.afternoon.labelFr : SLOTS.afternoon.labelEn}
                      <InfoTooltip content={tooltips.afternoon} position="bottom" />
                    </span>
                    <span className="text-gray-500 font-normal text-xs block">
                      {fr ? SLOTS.afternoon.timeFr : SLOTS.afternoon.timeEn}
                    </span>
                  </th>
                  <th className="py-4 px-5 text-white font-bold text-sm whitespace-nowrap">
                    <span className="flex items-center">
                      {fr ? SLOTS.fullday.labelFr : SLOTS.fullday.labelEn}
                      <InfoTooltip content={tooltips.fullday} position="bottom" />
                    </span>
                    <span className="text-gray-500 font-normal text-xs block">
                      {fr ? SLOTS.fullday.timeFr : SLOTS.fullday.timeEn}
                    </span>
                  </th>
                  <th className="py-4 px-5 text-white font-bold text-sm whitespace-nowrap">
                    <span className="flex items-center">
                      {fr ? SLOTS.bundle5.labelFr : SLOTS.bundle5.labelEn}
                      <InfoTooltip content={tooltips.bundle5} position="bottom" />
                    </span>
                    <span className="text-gray-500 font-normal text-xs block">
                      {fr ? SLOTS.bundle5.timeFr : SLOTS.bundle5.timeEn}
                    </span>
                  </th>
                  <th className="py-4 px-5 text-white font-bold text-sm whitespace-nowrap">
                    <span className="flex items-center">
                      {fr ? SLOTS.bundle10.labelFr : SLOTS.bundle10.labelEn}
                      <InfoTooltip content={tooltips.bundle10} position="bottom" />
                    </span>
                    <span className="text-gray-500 font-normal text-xs block">
                      {fr ? SLOTS.bundle10.timeFr : SLOTS.bundle10.timeEn}
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {roomSetups.map((space, index) => (
                  <tr
                    key={space.id}
                    className={`border-b border-brand-black transition-colors hover:bg-brand-black/40 ${index % 2 === 0 ? 'bg-brand-black-light' : 'bg-brand-black'}`}
                  >
                    <td className="py-4 px-5 text-white font-semibold text-sm">
                      {fr ? space.nameFr : space.nameEn}
                    </td>
                    <td className="py-4 px-5 text-gray-400 text-sm">
                      {fr ? `jusqu'à ${space.capacity} pers.` : `up to ${space.capacity} people`}
                    </td>
                    <td className="py-4 px-5 text-brand-red font-bold">{formatPrice(space.priceHalfDay)}</td>
                    <td className="py-4 px-5 text-brand-red font-bold">{formatPrice(space.priceHalfDay)}</td>
                    <td className="py-4 px-5 font-bold">
                      <span className="text-brand-red">{formatPrice(space.priceFullDay)}</span>
                    </td>
                    <td className="py-4 px-5 font-bold">
                      <span className="text-brand-red">{formatPrice(space.priceBundle5)}</span>
                      <span className="text-gray-500 text-xs block font-normal">
                        {formatPrice(space.priceBundle5 / 5)} / {fr ? 'séance' : 'session'}
                      </span>
                    </td>
                    <td className="py-4 px-5 font-bold">
                      <span className="text-brand-red">{formatPrice(space.priceBundle10)}</span>
                      <span className="text-gray-500 text-xs block font-normal">
                        {formatPrice(space.priceBundle10 / 10)} / {fr ? 'séance' : 'session'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Savings callout */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-brand-black border border-brand-red/30 rounded-sm p-4 flex gap-3">
              <svg className="w-5 h-5 text-brand-red flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <div>
                <p className="text-white text-sm font-semibold mb-1">
                  {fr ? 'Économies avec le Pack 5' : 'Savings with 5-Session Pack'}
                </p>
                <p className="text-gray-400 text-xs">
                  {fr
                    ? 'Le Pack 5 équivaut à 5 demi-journées à un tarif réduit par rapport aux réservations individuelles.'
                    : 'The 5-Session Pack covers 5 half-days at a reduced per-session rate vs. individual bookings.'}
                </p>
              </div>
            </div>
            <div className="bg-brand-black border border-brand-red/30 rounded-sm p-4 flex gap-3">
              <svg className="w-5 h-5 text-brand-red flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <div>
                <p className="text-white text-sm font-semibold mb-1">
                  {fr ? 'Meilleure valeur : Pack 10' : 'Best value: 10-Session Pack'}
                </p>
                <p className="text-gray-400 text-xs">
                  {fr
                    ? 'Le Pack 10 offre le coût par séance le plus bas. Idéal pour les organisations avec des besoins réguliers.'
                    : 'The 10-Session Pack offers the lowest per-session cost. Ideal for organisations with recurring needs.'}
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link
              href={`/${locale}/booking`}
              className="inline-block bg-brand-red text-white px-10 py-4 rounded-sm font-bold hover:bg-brand-red-dark transition-colors uppercase tracking-wider"
            >
              {fr ? 'Réserver un créneau' : 'Book a slot'}
            </Link>
          </div>
        </div>
      </section>

      {/* Coworking Space */}
      <section className="py-20 bg-brand-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4 text-center">
            {fr ? 'Espace de Coworking' : 'Coworking Space'}
          </h2>
          <p className="text-center text-gray-400 mb-4">
            {fr
              ? 'Accès par poste de travail, selon les mêmes créneaux que la salle'
              : 'Per-seat access, using the same fixed time slots as the room'}
          </p>
          <div className="h-1 w-24 bg-brand-red mb-12 mx-auto" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {/* Morning */}
            <div className="bg-brand-black-light border-2 border-brand-black-light hover:border-brand-red transition-all rounded-sm p-6 text-center">
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">{fr ? SLOTS.morning.labelFr : SLOTS.morning.labelEn}</p>
              <p className="text-3xl font-black text-brand-red mb-1">{formatPrice(coworking.priceHalfDay)}</p>
              <p className="text-gray-500 text-xs">{fr ? SLOTS.morning.timeFr : SLOTS.morning.timeEn}</p>
            </div>

            {/* Full day — featured */}
            <div className="relative bg-brand-black-light border-2 border-brand-red rounded-sm p-6 text-center">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-brand-red text-white px-3 py-0.5 rounded-sm text-xs font-bold uppercase tracking-wider">
                  {fr ? 'Journée' : 'Full day'}
                </span>
              </div>
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">{fr ? SLOTS.fullday.labelFr : SLOTS.fullday.labelEn}</p>
              <p className="text-3xl font-black text-brand-red mb-1">{formatPrice(coworking.priceFullDay)}</p>
              <p className="text-gray-500 text-xs">{fr ? SLOTS.fullday.timeFr : SLOTS.fullday.timeEn}</p>
            </div>

            {/* Bundle 5 */}
            <div className="bg-brand-black-light border-2 border-brand-black-light hover:border-brand-red transition-all rounded-sm p-6 text-center">
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-2 flex items-center justify-center">
                {fr ? SLOTS.bundle5.labelFr : SLOTS.bundle5.labelEn}
                <InfoTooltip content={tooltips.coworkingBundle} position="top" />
              </p>
              <p className="text-3xl font-black text-brand-red mb-1">{formatPrice(coworking.priceBundle5)}</p>
              <p className="text-gray-500 text-xs">{fr ? SLOTS.bundle5.timeFr : SLOTS.bundle5.timeEn}</p>
              <p className="text-gray-600 text-xs mt-1">{formatPrice(coworking.priceBundle5 / 5)} / {fr ? 'séance' : 'session'}</p>
            </div>

            {/* Bundle 10 */}
            <div className="bg-brand-black-light border-2 border-brand-black-light hover:border-brand-red transition-all rounded-sm p-6 text-center">
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-2 flex items-center justify-center">
                {fr ? SLOTS.bundle10.labelFr : SLOTS.bundle10.labelEn}
                <InfoTooltip content={tooltips.coworkingBundle} position="top" />
              </p>
              <p className="text-3xl font-black text-brand-red mb-1">{formatPrice(coworking.priceBundle10)}</p>
              <p className="text-gray-500 text-xs">{fr ? SLOTS.bundle10.timeFr : SLOTS.bundle10.timeEn}</p>
              <p className="text-gray-600 text-xs mt-1">{formatPrice(coworking.priceBundle10 / 10)} / {fr ? 'séance' : 'session'}</p>
            </div>
          </div>

          <p className="text-center text-gray-500 text-sm mt-8">
            {fr
              ? '* Tarif par poste de travail. Les forfaits sont à utiliser sur rendez-vous.'
              : '* Price per workstation. Packs are used by appointment.'}
          </p>
        </div>
      </section>

      {/* Technical Add-ons */}
      <section className="py-20 bg-brand-black-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4 text-center flex items-center justify-center">
            {fr ? 'Options Techniques' : 'Technical Add-ons'}
            <InfoTooltip content={tooltips.addon} position="top" />
          </h2>
          <div className="h-1 w-24 bg-brand-red mb-12 mx-auto" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {addOns.map((addon, index) => (
              <div
                key={index}
                className="bg-brand-black p-6 rounded-sm border border-brand-black-light hover:border-brand-red transition-all"
              >
                <h3 className="text-lg font-bold text-white mb-1">{addon.name}</h3>
                <p className="text-brand-red font-bold">{addon.price}</p>
                {addon.note && <p className="text-gray-500 text-xs mt-1">{addon.note}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ callout */}
      <section className="py-16 bg-brand-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-brand-black-light border border-brand-black-light rounded-sm p-5">
              <svg className="w-6 h-6 text-brand-red mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h4 className="text-white font-bold text-sm mb-2">
                {fr ? 'Confirmation par téléphone' : 'Phone confirmation'}
              </h4>
              <p className="text-gray-400 text-xs leading-relaxed">
                {fr
                  ? 'Toute réservation est confirmée par un appel de notre équipe. Les forfaits multi-séances sont planifiés ensemble lors de cet appel.'
                  : 'Every booking is confirmed by a call from our team. Multi-session packs are scheduled together during this call.'}
              </p>
            </div>
            <div className="bg-brand-black-light border border-brand-black-light rounded-sm p-5">
              <svg className="w-6 h-6 text-brand-red mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h4 className="text-white font-bold text-sm mb-2">
                {fr ? 'Horaires stricts' : 'Strict time limits'}
              </h4>
              <p className="text-gray-400 text-xs leading-relaxed">
                {fr
                  ? 'Les créneaux ont des heures de fin définies. Un dépassement peut être facturé au tarif de la session suivante si elle est occupée.'
                  : 'Slots have defined end times. Overtime may be billed at the next session rate if it is occupied.'}
              </p>
            </div>
            <div className="bg-brand-black-light border border-brand-black-light rounded-sm p-5">
              <svg className="w-6 h-6 text-brand-red mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <h4 className="text-white font-bold text-sm mb-2">
                {fr ? 'Paiement & annulation' : 'Payment & cancellation'}
              </h4>
              <p className="text-gray-400 text-xs leading-relaxed">
                {fr
                  ? 'Paiement à la confirmation. Annulation gratuite jusqu\'à 48h avant. Les forfaits ne sont pas remboursables mais les séances sont reportables.'
                  : 'Payment at confirmation. Free cancellation up to 48h before. Packs are non-refundable but sessions can be rescheduled.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-brand-black-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            {fr ? "Besoin d'une solution personnalisée ?" : 'Need a custom solution?'}
          </h2>
          <div className="h-1 w-24 bg-brand-red mb-8 mx-auto" />
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            {fr
              ? 'Contactez-nous pour discuter de vos besoins spécifiques'
              : 'Contact us to discuss your specific needs'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/booking`}
              className="inline-block bg-brand-red text-white px-10 py-4 rounded-sm font-bold hover:bg-brand-red-dark transition-colors text-lg uppercase tracking-wider"
            >
              {fr ? 'Réserver maintenant' : 'Book Now'}
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="inline-block bg-transparent border-2 border-white text-white px-10 py-4 rounded-sm font-bold hover:bg-white hover:text-brand-black transition-all text-lg uppercase tracking-wider"
            >
              {fr ? 'Nous contacter' : 'Contact Us'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
