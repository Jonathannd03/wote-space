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
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-6">
            {fr ? "Offres & Tarifs" : "Offers & Pricing"}
          </h1>
          <div className="h-1 w-32 bg-brand-red mb-8 mx-auto" />
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {fr
              ? "Des créneaux horaires fixes pour des sessions claires et prévisibles"
              : "Fixed time slots for clear, predictable sessions"}
          </p>
        </div>
      </section>

      {/* How it works callout */}
      <section className="py-12 bg-brand-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-brand-black-light border-l-4 border-brand-red rounded-sm p-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-shrink-0 mt-0.5">
              <svg
                className="w-6 h-6 text-brand-red"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg mb-2">
                {fr
                  ? "Comment fonctionne notre tarification ?"
                  : "How does our pricing work?"}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-3">
                {fr
                  ? "Nous travaillons avec des créneaux horaires définis — pas de facturation à l'heure ouverte. Chaque session a une heure de début et une heure de fin fixe, affichées lors de la réservation. Cela garantit que la salle est toujours disponible à temps pour l'utilisateur suivant."
                  : "We work with defined time slots — no open-ended hourly billing. Each session has a fixed start and end time, displayed at booking. This ensures the room is always available on time for the next user."}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                {(["morning", "afternoon", "fullday"] as const).map((key) => (
                  <div
                    key={key}
                    className="bg-brand-black rounded-sm px-3 py-2"
                  >
                    <p className="text-brand-red font-semibold">
                      {fr ? SLOTS[key].labelFr : SLOTS[key].labelEn}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {fr ? SLOTS[key].timeFr : SLOTS[key].timeEn}
                    </p>
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
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 text-center">
            {fr ? "La Salle de Réunion" : "The Meeting Room"}
          </h2>
          <p className="text-center text-gray-400 mb-4">
            {fr
              ? "Des salles modulable, 4 configurations selon votre effectif"
              : "Modular rooms, 4 configurations for your group size"}
          </p>
          <div className="h-1 w-24 bg-brand-red mb-12 mx-auto" />

          {/* Mobile: one card per setup */}
          <div className="lg:hidden space-y-4">
            {roomSetups.map((space) => (
              <div
                key={space.id}
                className="bg-brand-black rounded-sm border border-brand-black-light overflow-hidden"
              >
                {/* Card header */}
                <div className="bg-brand-black-light px-4 py-3 border-b border-brand-black-light flex items-center justify-between">
                  <div>
                    <p className="text-white font-bold">
                      {fr ? space.nameFr : space.nameEn}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {fr
                        ? `jusqu'à ${space.capacity} personnes`
                        : `up to ${space.capacity} people`}
                    </p>
                  </div>
                  <svg
                    className="w-5 h-5 text-brand-red"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                {/* Slot rows */}
                <div className="divide-y divide-brand-black-light">
                  {/* Single sessions */}
                  <div className="px-4 py-2">
                    <p className="text-xs text-gray-500 uppercase tracking-wider py-1">
                      {fr ? "Sessions individuelles" : "Single sessions"}
                    </p>
                  </div>
                  {(["morning", "afternoon", "fullday"] as const).map((key) => (
                    <div
                      key={key}
                      className="px-4 py-3 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-white text-sm font-medium flex items-center gap-1">
                          {fr ? SLOTS[key].labelFr : SLOTS[key].labelEn}
                          <InfoTooltip content={tooltips[key]} position="top" />
                        </p>
                        <p className="text-gray-500 text-xs">
                          {fr ? SLOTS[key].timeFr : SLOTS[key].timeEn}
                        </p>
                      </div>
                      <span className="text-brand-red font-black text-lg">
                        {formatPrice(
                          key === "fullday"
                            ? space.priceFullDay
                            : space.priceHalfDay,
                        )}
                      </span>
                    </div>
                  ))}
                  {/* Packs */}
                  <div className="px-4 py-2 bg-brand-black/50">
                    <p className="text-xs text-gray-500 uppercase tracking-wider py-1">
                      {fr ? "Forfaits multi-séances" : "Session packs"}
                    </p>
                  </div>
                  {(["bundle5", "bundle10"] as const).map((key) => {
                    const price =
                      key === "bundle5"
                        ? space.priceBundle5
                        : space.priceBundle10;
                    const count = key === "bundle5" ? 5 : 10;
                    return (
                      <div
                        key={key}
                        className="px-4 py-3 flex items-center justify-between bg-brand-black/50"
                      >
                        <div>
                          <p className="text-white text-sm font-medium flex items-center gap-1">
                            {fr ? SLOTS[key].labelFr : SLOTS[key].labelEn}
                            <InfoTooltip
                              content={tooltips[key]}
                              position="top"
                            />
                          </p>
                          <p className="text-gray-500 text-xs">
                            {fr ? SLOTS[key].timeFr : SLOTS[key].timeEn} ·{" "}
                            {formatPrice(price / count)}/
                            {fr ? "séance" : "session"}
                          </p>
                        </div>
                        <span className="text-brand-red font-black text-lg">
                          {formatPrice(price)}
                        </span>
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
                    {fr ? "Configuration" : "Setup"}
                  </th>
                  <th className="py-4 px-5 text-white font-bold text-sm">
                    {fr ? "Capacité" : "Capacity"}
                  </th>
                  <th className="py-4 px-5 text-white font-bold text-sm whitespace-nowrap">
                    <span className="flex items-center">
                      {fr ? SLOTS.morning.labelFr : SLOTS.morning.labelEn}
                      <InfoTooltip
                        content={tooltips.morning}
                        position="bottom"
                      />
                    </span>
                    <span className="text-gray-500 font-normal text-xs block">
                      {fr ? SLOTS.morning.timeFr : SLOTS.morning.timeEn}
                    </span>
                  </th>
                  <th className="py-4 px-5 text-white font-bold text-sm whitespace-nowrap">
                    <span className="flex items-center">
                      {fr ? SLOTS.afternoon.labelFr : SLOTS.afternoon.labelEn}
                      <InfoTooltip
                        content={tooltips.afternoon}
                        position="bottom"
                      />
                    </span>
                    <span className="text-gray-500 font-normal text-xs block">
                      {fr ? SLOTS.afternoon.timeFr : SLOTS.afternoon.timeEn}
                    </span>
                  </th>
                  <th className="py-4 px-5 text-white font-bold text-sm whitespace-nowrap">
                    <span className="flex items-center">
                      {fr ? SLOTS.fullday.labelFr : SLOTS.fullday.labelEn}
                      <InfoTooltip
                        content={tooltips.fullday}
                        position="bottom"
                      />
                    </span>
                    <span className="text-gray-500 font-normal text-xs block">
                      {fr ? SLOTS.fullday.timeFr : SLOTS.fullday.timeEn}
                    </span>
                  </th>
                  <th className="py-4 px-5 text-white font-bold text-sm whitespace-nowrap">
                    <span className="flex items-center">
                      {fr ? SLOTS.bundle5.labelFr : SLOTS.bundle5.labelEn}
                      <InfoTooltip
                        content={tooltips.bundle5}
                        position="bottom"
                      />
                    </span>
                    <span className="text-gray-500 font-normal text-xs block">
                      {fr ? SLOTS.bundle5.timeFr : SLOTS.bundle5.timeEn}
                    </span>
                  </th>
                  <th className="py-4 px-5 text-white font-bold text-sm whitespace-nowrap">
                    <span className="flex items-center">
                      {fr ? SLOTS.bundle10.labelFr : SLOTS.bundle10.labelEn}
                      <InfoTooltip
                        content={tooltips.bundle10}
                        position="bottom"
                      />
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
                    className={`border-b border-brand-black transition-colors hover:bg-brand-black/40 ${index % 2 === 0 ? "bg-brand-black-light" : "bg-brand-black"}`}
                  >
                    <td className="py-4 px-5 text-white font-semibold text-sm">
                      {fr ? space.nameFr : space.nameEn}
                    </td>
                    <td className="py-4 px-5 text-gray-400 text-sm">
                      {fr
                        ? `jusqu'à ${space.capacity} pers.`
                        : `up to ${space.capacity} people`}
                    </td>
                    <td className="py-4 px-5 text-brand-red font-bold">
                      {formatPrice(space.priceHalfDay)}
                    </td>
                    <td className="py-4 px-5 text-brand-red font-bold">
                      {formatPrice(space.priceHalfDay)}
                    </td>
                    <td className="py-4 px-5 font-bold">
                      <span className="text-brand-red">
                        {formatPrice(space.priceFullDay)}
                      </span>
                    </td>
                    <td className="py-4 px-5 font-bold">
                      <span className="text-brand-red">
                        {formatPrice(space.priceBundle5)}
                      </span>
                      <span className="text-gray-500 text-xs block font-normal">
                        {formatPrice(space.priceBundle5 / 5)} /{" "}
                        {fr ? "séance" : "session"}
                      </span>
                    </td>
                    <td className="py-4 px-5 font-bold">
                      <span className="text-brand-red">
                        {formatPrice(space.priceBundle10)}
                      </span>
                      <span className="text-gray-500 text-xs block font-normal">
                        {formatPrice(space.priceBundle10 / 10)} /{" "}
                        {fr ? "séance" : "session"}
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
              <svg
                className="w-5 h-5 text-brand-red flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              <div>
                <p className="text-white text-sm font-semibold mb-1">
                  {fr
                    ? "Économies avec le Pack 5"
                    : "Savings with 5-Session Pack"}
                </p>
                <p className="text-gray-400 text-xs">
                  {fr
                    ? "Le Pack 5 équivaut à 5 demi-journées à un tarif réduit par rapport aux réservations individuelles."
                    : "The 5-Session Pack covers 5 half-days at a reduced per-session rate vs. individual bookings."}
                </p>
              </div>
            </div>
            <div className="bg-brand-black border border-brand-red/30 rounded-sm p-4 flex gap-3">
              <svg
                className="w-5 h-5 text-brand-red flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
              <div>
                <p className="text-white text-sm font-semibold mb-1">
                  {fr
                    ? "Meilleure valeur : Pack 10"
                    : "Best value: 10-Session Pack"}
                </p>
                <p className="text-gray-400 text-xs">
                  {fr
                    ? "Le Pack 10 offre le coût par séance le plus bas. Idéal pour les organisations avec des besoins réguliers."
                    : "The 10-Session Pack offers the lowest per-session cost. Ideal for organisations with recurring needs."}
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link
              href={`/${locale}/booking`}
              className="inline-block bg-brand-red text-white px-10 py-4 rounded-sm font-bold hover:bg-brand-red-dark transition-colors uppercase tracking-wider"
            >
              {fr ? "Réserver un créneau" : "Book a slot"}
            </Link>
          </div>
        </div>
      </section>

      {/* Coworking Space */}
      <section className="py-20 bg-brand-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 text-center">
            {fr ? "Espace de Coworking" : "Coworking Space"}
          </h2>
          <p className="text-center text-gray-400 mb-4 max-w-2xl mx-auto">
            {fr
              ? "Un poste de travail partagé à Goma, avec Wi-Fi et accès aux espaces communs. Payez uniquement ce dont vous avez besoin."
              : "A shared workstation in Goma, with Wi-Fi and access to common areas. Pay only for what you need."}
          </p>
          <div className="h-1 w-24 bg-brand-red mb-14 mx-auto" />

          {/* À la carte */}
          <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-5 text-center">
            {fr ? "Sessions à la carte" : "Pay-as-you-go sessions"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto mb-16">
            {/* Half-day */}
            <div className="bg-brand-black-light border border-brand-black-light hover:border-brand-red transition-all rounded-sm p-6">
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">
                {fr ? "Demi-journée" : "Half-day"}
              </p>
              <p className="text-4xl font-black text-brand-red mb-1">
                {formatPrice(coworking.priceHalfDay)}
              </p>
              <p className="text-gray-500 text-xs mb-4">
                {fr ? "Matin 8h–12h  ·  ou  ·  Après-midi 13h–17h30" : "Morning 8–12  ·  or  ·  Afternoon 1–5:30 PM"}
              </p>
              <ul className="space-y-1 text-xs text-gray-400">
                <li className="flex gap-2"><span className="text-brand-red">›</span>{fr ? "1 session de 4h à votre rythme" : "1 session of 4h at your pace"}</li>
                <li className="flex gap-2"><span className="text-brand-red">›</span>{fr ? "Wi-Fi + mobilier inclus" : "Wi-Fi + furniture included"}</li>
                <li className="flex gap-2"><span className="text-brand-red">›</span>{fr ? "Idéal pour un essai ou une journée chargée" : "Ideal for a trial or a busy day"}</li>
              </ul>
            </div>

            {/* Full day */}
            <div className="relative bg-brand-black-light border-2 border-brand-red rounded-sm p-6">
              <div className="absolute -top-3 left-6">
                <span className="bg-brand-red text-white px-3 py-0.5 rounded-sm text-xs font-bold uppercase tracking-wider">
                  {fr ? "Recommandé" : "Recommended"}
                </span>
              </div>
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1 mt-1">
                {fr ? "Journée complète" : "Full day"}
              </p>
              <p className="text-4xl font-black text-brand-red mb-1">
                {formatPrice(coworking.priceFullDay)}
              </p>
              <p className="text-gray-500 text-xs mb-4">
                {fr ? "8h00 – 17h30  ·  9h30 de travail" : "8:00 AM – 5:30 PM  ·  9.5h of work"}
              </p>
              <ul className="space-y-1 text-xs text-gray-400">
                <li className="flex gap-2"><span className="text-brand-red">›</span>{fr ? "Accès toute la journée sans interruption" : "Full-day uninterrupted access"}</li>
                <li className="flex gap-2"><span className="text-brand-red">›</span>{fr ? "Wi-Fi + mobilier inclus" : "Wi-Fi + furniture included"}</li>
                <li className="flex gap-2"><span className="text-brand-red">›</span>{fr ? "Idéal pour télétravailleurs et freelances" : "Ideal for remote workers and freelancers"}</li>
              </ul>
            </div>
          </div>

          {/* Forfaits */}
          <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-2 text-center">
            {fr ? "Forfaits — Économisez en vous engageant" : "Packs — Save by committing"}
          </h3>
          <p className="text-center text-gray-500 text-sm mb-8">
            {fr
              ? "Achetez un bloc de séances à l'avance. Dates à convenir par téléphone selon vos disponibilités."
              : "Pre-purchase a block of sessions. Dates arranged by phone to fit your schedule."}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {/* Pack 5 */}
            <div className="bg-brand-black-light border border-brand-black-light hover:border-brand-red transition-all rounded-sm p-6 flex flex-col">
              <p className="text-brand-red text-xs font-bold uppercase tracking-widest mb-1">Pack 5</p>
              <p className="text-gray-400 text-xs mb-3">{fr ? "5 séances journées complètes" : "5 full-day sessions"}</p>
              <p className="text-4xl font-black text-white mb-1">{formatPrice(coworking.priceBundle5)}</p>
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-brand-red/20 text-brand-red text-xs px-2 py-0.5 rounded-sm font-semibold border border-brand-red/30">
                  {fr ? `Économie : ${formatPrice(coworking.priceFullDay * 5 - coworking.priceBundle5)}` : `Save ${formatPrice(coworking.priceFullDay * 5 - coworking.priceBundle5)}`}
                </span>
              </div>
              <ul className="space-y-1.5 text-xs text-gray-400 flex-1 mb-5">
                <li className="flex gap-2"><span className="text-brand-red">›</span>{fr ? `${formatPrice(coworking.priceBundle5 / 5)} / séance (au lieu de ${formatPrice(coworking.priceFullDay)})` : `${formatPrice(coworking.priceBundle5 / 5)} / session (vs ${formatPrice(coworking.priceFullDay)})`}</li>
                <li className="flex gap-2"><span className="text-brand-red">›</span>{fr ? "5 journées complètes 8h–17h30" : "5 full days 8AM–5:30PM"}</li>
                <li className="flex gap-2"><span className="text-brand-red">›</span>{fr ? "Dates flexibles sur 3 mois" : "Flexible dates over 3 months"}</li>
                <li className="flex gap-2"><span className="text-brand-red">›</span>{fr ? "Idéal pour une utilisation régulière mensuelle" : "Ideal for regular monthly use"}</li>
              </ul>
              <Link href={`/${locale}/contact`} className="block text-center border border-brand-red text-brand-red py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider hover:bg-brand-red hover:text-white transition-colors">
                {fr ? "Nous contacter" : "Contact us"}
              </Link>
            </div>

            {/* Pack 10 */}
            <div className="bg-brand-black-light border border-brand-black-light hover:border-brand-red transition-all rounded-sm p-6 flex flex-col">
              <p className="text-brand-red text-xs font-bold uppercase tracking-widest mb-1">Pack 10</p>
              <p className="text-gray-400 text-xs mb-3">{fr ? "10 séances journées complètes" : "10 full-day sessions"}</p>
              <p className="text-4xl font-black text-white mb-1">{formatPrice(coworking.priceBundle10)}</p>
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-brand-red/20 text-brand-red text-xs px-2 py-0.5 rounded-sm font-semibold border border-brand-red/30">
                  {fr ? `Économie : ${formatPrice(coworking.priceFullDay * 10 - coworking.priceBundle10)}` : `Save ${formatPrice(coworking.priceFullDay * 10 - coworking.priceBundle10)}`}
                </span>
              </div>
              <ul className="space-y-1.5 text-xs text-gray-400 flex-1 mb-5">
                <li className="flex gap-2"><span className="text-brand-red">›</span>{fr ? `${formatPrice(coworking.priceBundle10 / 10)} / séance (au lieu de ${formatPrice(coworking.priceFullDay)})` : `${formatPrice(coworking.priceBundle10 / 10)} / session (vs ${formatPrice(coworking.priceFullDay)})`}</li>
                <li className="flex gap-2"><span className="text-brand-red">›</span>{fr ? "10 journées complètes 8h–17h30" : "10 full days 8AM–5:30PM"}</li>
                <li className="flex gap-2"><span className="text-brand-red">›</span>{fr ? "Dates flexibles sur 6 mois" : "Flexible dates over 6 months"}</li>
                <li className="flex gap-2"><span className="text-brand-red">›</span>{fr ? "Idéal pour freelances et consultants réguliers" : "Ideal for freelancers and regular consultants"}</li>
              </ul>
              <Link href={`/${locale}/contact`} className="block text-center border border-brand-red text-brand-red py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider hover:bg-brand-red hover:text-white transition-colors">
                {fr ? "Nous contacter" : "Contact us"}
              </Link>
            </div>

            {/* Forfait Semaine */}
            <div className="bg-brand-black-light border border-brand-black-light hover:border-brand-red transition-all rounded-sm p-6 flex flex-col">
              <p className="text-brand-red text-xs font-bold uppercase tracking-widest mb-1">{fr ? "Forfait Semaine" : "Weekly Pass"}</p>
              <p className="text-gray-400 text-xs mb-3">{fr ? "5 jours consécutifs (lun–ven)" : "5 consecutive days (Mon–Fri)"}</p>
              <p className="text-4xl font-black text-white mb-1">$12</p>
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-brand-red/20 text-brand-red text-xs px-2 py-0.5 rounded-sm font-semibold border border-brand-red/30">
                  {fr ? "2,40 $ / jour" : "$2.40 / day"}
                </span>
              </div>
              <ul className="space-y-1.5 text-xs text-gray-400 flex-1 mb-5">
                <li className="flex gap-2"><span className="text-brand-red">›</span>{fr ? "Accès journalier sur une semaine entière" : "Daily access for one full work week"}</li>
                <li className="flex gap-2"><span className="text-brand-red">›</span>{fr ? "Semaine au choix, à convenir par téléphone" : "Week of your choice, arranged by phone"}</li>
                <li className="flex gap-2"><span className="text-brand-red">›</span>{fr ? "Wi-Fi + espaces communs inclus" : "Wi-Fi + common areas included"}</li>
                <li className="flex gap-2"><span className="text-brand-red">›</span>{fr ? "Idéal pour missions courtes ou visiteurs" : "Ideal for short missions or visiting workers"}</li>
              </ul>
              <Link href={`/${locale}/contact`} className="block text-center border border-brand-red text-brand-red py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider hover:bg-brand-red hover:text-white transition-colors">
                {fr ? "Nous contacter" : "Contact us"}
              </Link>
            </div>

            {/* Forfait Mensuel — featured */}
            <div className="relative bg-brand-black-light border-2 border-brand-red rounded-sm p-6 flex flex-col">
              <div className="absolute -top-3 left-6">
                <span className="bg-brand-red text-white px-3 py-0.5 rounded-sm text-xs font-bold uppercase tracking-wider">
                  {fr ? "Meilleure valeur" : "Best value"}
                </span>
              </div>
              <p className="text-brand-red text-xs font-bold uppercase tracking-widest mb-1 mt-2">{fr ? "Forfait Mensuel" : "Monthly Pass"}</p>
              <p className="text-gray-400 text-xs mb-3">{fr ? "~20 jours ouvrables (1 mois)" : "~20 working days (1 month)"}</p>
              <p className="text-4xl font-black text-white mb-1">$40</p>
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-brand-red/20 text-brand-red text-xs px-2 py-0.5 rounded-sm font-semibold border border-brand-red/30">
                  {fr ? "2,00 $ / jour" : "$2.00 / day"}
                </span>
              </div>
              <ul className="space-y-1.5 text-xs text-gray-400 flex-1 mb-5">
                <li className="flex gap-2"><span className="text-brand-red">›</span>{fr ? "Accès illimité sur un mois calendaire" : "Unlimited access for one calendar month"}</li>
                <li className="flex gap-2"><span className="text-brand-red">›</span>{fr ? "Entrées/sorties libres chaque jour ouvrable" : "Come and go freely on any working day"}</li>
                <li className="flex gap-2"><span className="text-brand-red">›</span>{fr ? "Wi-Fi + espaces communs inclus" : "Wi-Fi + common areas included"}</li>
                <li className="flex gap-2"><span className="text-brand-red">›</span>{fr ? "Idéal pour télétravailleurs, étudiants, ONGs locales" : "Ideal for remote workers, students, local NGOs"}</li>
              </ul>
              <Link href={`/${locale}/contact`} className="block text-center bg-brand-red text-white py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider hover:bg-brand-red-dark transition-colors">
                {fr ? "Nous contacter" : "Contact us"}
              </Link>
            </div>
          </div>

          <p className="text-center text-gray-600 text-xs mt-8">
            {fr
              ? "* Tous les forfaits sont activés après confirmation téléphonique. Non remboursables mais séances reportables."
              : "* All packs are activated after phone confirmation. Non-refundable but sessions can be rescheduled."}
          </p>
        </div>
      </section>

      {/* Special Packs */}
      <section className="py-20 bg-brand-black-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-brand-red text-xs font-bold uppercase tracking-widest mb-3">
              {fr ? "Offres Spéciales" : "Special Packs"}
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {fr ? "Packs Spéciaux" : "Special Packs"}
            </h2>
            <div className="h-1 w-24 bg-brand-red mb-6 mx-auto" />
            <p className="text-gray-400 max-w-2xl mx-auto">
              {fr
                ? "Des forfaits tout compris pensés pour des usages spécifiques — formation, conférence, ONG, communauté, école. Tout ce dont vous avez besoin dans un seul prix."
                : "All-inclusive packages designed for specific use cases — training, conference, NGO, community, school. Everything you need in a single price."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Pack Étudiants / Écoles */}
            <div className="bg-brand-black rounded-sm border-2 border-brand-black-light hover:border-brand-red transition-all p-7 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-4 h-4 text-brand-red flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
                <p className="text-brand-red text-xs font-bold uppercase tracking-widest">
                  {fr ? "Pack Étudiants / Écoles" : "Students / Schools Pack"}
                </p>
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-5xl font-black text-white">$10</span>
                <span className="text-gray-400 text-sm">/ {fr ? "heure" : "hour"}</span>
              </div>
              <p className="text-gray-500 text-xs mb-5">
                {fr ? "25–40 personnes · Minimum 2h" : "25–40 people · Minimum 2h booking"}
              </p>
              <p className="text-gray-400 text-sm leading-relaxed mb-5">
                {fr
                  ? "Accès à tarif réduit pour les groupes académiques : ateliers, travaux pratiques, sessions de révision ou visites scolaires. Demi-journée à $20, journée complète à $40."
                  : "Reduced-rate access for academic groups: workshops, practical sessions, revision classes or school visits. Half-day $20, full day $40."}
              </p>
              <div className="bg-brand-black-light rounded-sm p-4 mb-5">
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-2 font-semibold">{fr ? "Inclus" : "Included"}</p>
                <ul className="space-y-1.5">
                  {[fr ? "Salle configurée (25–40 pers.)" : "Configured room (25–40 people)", fr ? "Projecteur ou écran" : "Projector or screen", "Wi-Fi"].map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-gray-300">
                      <svg className="w-4 h-4 text-brand-red flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-brand-black-light rounded-sm p-3 mb-5 text-xs text-gray-500">
                <span className="text-brand-red font-semibold">{fr ? "Condition : " : "Condition: "}</span>
                {fr ? "Lettre d'institution scolaire ou universitaire requise." : "School or university letter required."}
              </div>
              <Link href={`/${locale}/contact`} className="mt-auto block text-center border border-brand-red text-brand-red py-3 rounded-sm font-bold uppercase tracking-wider hover:bg-brand-red hover:text-white transition-colors text-sm">
                {fr ? "Nous contacter" : "Contact us"}
              </Link>
            </div>

            {/* Pack Communauté */}
            <div className="bg-brand-black rounded-sm border-2 border-brand-black-light hover:border-brand-red transition-all p-7 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-4 h-4 text-brand-red flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-brand-red text-xs font-bold uppercase tracking-widest">
                  {fr ? "Pack Communauté" : "Community Pack"}
                </p>
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-5xl font-black text-white">$150</span>
                <span className="text-gray-400 text-sm">/ {fr ? "mois" : "month"}</span>
              </div>
              <p className="text-gray-500 text-xs mb-5">
                {fr ? "26–40 personnes · ~4 réunions/mois" : "26–40 people · ~4 meetings/month"}
              </p>
              <p className="text-gray-400 text-sm leading-relaxed mb-5">
                {fr
                  ? "Idéal pour les groupes communautaires qui se réunissent régulièrement — assemblées hebdomadaires, comités de quartier, clubs et associations locales. Revient à $37,50 par réunion."
                  : "Ideal for community groups that meet regularly — weekly assemblies, neighbourhood committees, local clubs and associations. Works out to $37.50 per meeting."}
              </p>
              <div className="bg-brand-black-light rounded-sm p-4 mb-5">
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-2 font-semibold">{fr ? "Inclus" : "Included"}</p>
                <ul className="space-y-1.5">
                  {[fr ? "Salle configurée (26–40 pers.)" : "Configured room (26–40 people)", fr ? "Projecteur ou écran" : "Projector or screen", "Wi-Fi", fr ? "4 séances demi-journée / mois" : "4 half-day sessions / month", fr ? "Planification des dates par téléphone" : "Date scheduling by phone"].map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-gray-300">
                      <svg className="w-4 h-4 text-brand-red flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href={`/${locale}/contact`} className="mt-auto block text-center border border-brand-red text-brand-red py-3 rounded-sm font-bold uppercase tracking-wider hover:bg-brand-red hover:text-white transition-colors text-sm">
                {fr ? "Nous contacter" : "Contact us"}
              </Link>
            </div>

            {/* Pack Réunion ONG */}
            <div className="bg-brand-black rounded-sm border-2 border-brand-black-light hover:border-brand-red transition-all p-7 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-4 h-4 text-brand-red flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <p className="text-brand-red text-xs font-bold uppercase tracking-widest">
                  {fr ? "Pack Réunion ONG" : "NGO Meeting Pack"}
                </p>
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-5xl font-black text-white">$200</span>
                <span className="text-gray-400 text-sm">/ {fr ? "mois" : "month"}</span>
              </div>
              <p className="text-gray-500 text-xs mb-5">
                {fr ? "26–40 personnes · Jusqu'à 6 réunions/mois" : "26–40 people · Up to 6 meetings/month"}
              </p>
              <p className="text-gray-400 text-sm leading-relaxed mb-5">
                {fr
                  ? "Conçu pour les ONG et organisations humanitaires basées à Goma avec des besoins de coordination récurrents. Accès prioritaire, planification flexible, facturation mensuelle. Revient à ~$33 par réunion."
                  : "Designed for NGOs and humanitarian organisations based in Goma with recurring coordination needs. Priority access, flexible scheduling, monthly invoicing. Works out to ~$33 per meeting."}
              </p>
              <div className="bg-brand-black-light rounded-sm p-4 mb-5">
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-2 font-semibold">{fr ? "Inclus" : "Included"}</p>
                <ul className="space-y-1.5">
                  {[fr ? "Salle configurée (26–40 pers.)" : "Configured room (26–40 people)", fr ? "Projecteur ou écran" : "Projector or screen", "Wi-Fi", fr ? "Jusqu'à 6 séances demi-journée / mois" : "Up to 6 half-day sessions / month", fr ? "Accès prioritaire au calendrier" : "Priority calendar access", fr ? "Facturation mensuelle centralisée" : "Centralised monthly invoicing"].map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-gray-300">
                      <svg className="w-4 h-4 text-brand-red flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-brand-black-light rounded-sm p-3 mb-5 text-xs text-gray-500">
                <span className="text-brand-red font-semibold">{fr ? "Condition : " : "Condition: "}</span>
                {fr ? "Justificatif d'enregistrement ONG requis." : "NGO registration document required."}
              </div>
              <Link href={`/${locale}/contact`} className="mt-auto block text-center border border-brand-red text-brand-red py-3 rounded-sm font-bold uppercase tracking-wider hover:bg-brand-red hover:text-white transition-colors text-sm">
                {fr ? "Nous contacter" : "Contact us"}
              </Link>
            </div>

            {/* Pack Formation */}
            <div className="bg-brand-black rounded-sm border-2 border-brand-black-light hover:border-brand-red transition-all p-7 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-4 h-4 text-brand-red flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-brand-red text-xs font-bold uppercase tracking-widest">
                  {fr ? "Pack Formation" : "Training Pack"}
                </p>
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-5xl font-black text-white">$75</span>
                <span className="text-gray-400 text-sm">/ {fr ? "jour" : "day"}</span>
              </div>
              <p className="text-gray-500 text-xs mb-5">
                {fr ? "26–40 personnes · Journée complète (8h–17h30)" : "26–40 people · Full day (8AM–5:30PM)"}
              </p>
              <p className="text-gray-400 text-sm leading-relaxed mb-5">
                {fr
                  ? "Tout ce qu'il faut pour une journée de formation professionnelle clé en main — salle, son, connectivité et documentation photo. Économisez vs. réservation à la carte."
                  : "Everything needed for a professional training day, turnkey — room, sound, connectivity and photo documentation. Save vs. booking à la carte."}
              </p>
              <div className="bg-brand-black-light rounded-sm p-4 mb-5">
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-2 font-semibold">{fr ? "Inclus" : "Included"}</p>
                <ul className="space-y-1.5">
                  {[fr ? "Salle journée complète (26–40 pers.)" : "Full-day room (26–40 people)", fr ? "Projecteur + sonorisation (micro & enceintes)" : "Projector + sound system (mic & speakers)", fr ? "Wi-Fi premium dédié" : "Dedicated premium Wi-Fi", fr ? "Photographie (2 heures incluses)" : "Photography (2 hours included)"].map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-gray-300">
                      <svg className="w-4 h-4 text-brand-red flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-brand-black-light rounded-sm p-3 mb-5 text-xs text-gray-500">
                <span className="text-brand-red font-semibold">{fr ? "Idéal pour : " : "Ideal for: "}</span>
                {fr ? "Centres de formation, équipes RH d'ONG, renforcement de capacités." : "Training centres, NGO HR teams, capacity building programmes."}
              </div>
              <Link href={`/${locale}/booking`} className="mt-auto block text-center border border-brand-red text-brand-red py-3 rounded-sm font-bold uppercase tracking-wider hover:bg-brand-red hover:text-white transition-colors text-sm">
                {fr ? "Réserver" : "Book Now"}
              </Link>
            </div>

            {/* Pack Conférence Pro — featured */}
            <div className="relative bg-brand-black rounded-sm border-2 border-brand-red p-7 flex flex-col">
              <div className="absolute -top-3 left-6">
                <span className="bg-brand-red text-white px-3 py-0.5 rounded-sm text-xs font-bold uppercase tracking-wider">
                  {fr ? "Recommandé" : "Recommended"}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-4 mt-2">
                <svg className="w-4 h-4 text-brand-red flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <p className="text-brand-red text-xs font-bold uppercase tracking-widest">
                  {fr ? "Pack Conférence Pro" : "Pro Conference Pack"}
                </p>
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-5xl font-black text-white">$80</span>
                <span className="text-gray-400 text-sm">/ {fr ? "jour" : "day"}</span>
              </div>
              <p className="text-gray-500 text-xs mb-5">
                {fr ? "41–60 personnes · Journée complète (8h–17h30)" : "41–60 people · Full day (8AM–5:30PM)"}
              </p>
              <p className="text-gray-400 text-sm leading-relaxed mb-5">
                {fr
                  ? "Notre offre la plus complète pour les grandes conférences professionnelles, lancements, sommets ou événements annuels à Goma. Assistance technique sur place incluse pour la tranquillité d'esprit."
                  : "Our most complete offer for large professional conferences, launches, summits or annual events in Goma. On-site technical assistance included for peace of mind."}
              </p>
              <div className="bg-brand-black-light rounded-sm p-4 mb-5">
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-2 font-semibold">{fr ? "Inclus" : "Included"}</p>
                <ul className="space-y-1.5">
                  {[fr ? "Salle journée complète (41–60 pers.)" : "Full-day room (41–60 people)", fr ? "Projecteur + sonorisation complète" : "Projector + full sound system", fr ? "Wi-Fi premium dédié" : "Dedicated premium Wi-Fi", fr ? "Photographie complète (toute la journée)" : "Full-day photography coverage", fr ? "Assistance technique sur place" : "On-site technical assistance"].map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-gray-300">
                      <svg className="w-4 h-4 text-brand-red flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-brand-black-light rounded-sm p-3 mb-5 text-xs text-gray-500">
                <span className="text-brand-red font-semibold">{fr ? "Idéal pour : " : "Ideal for: "}</span>
                {fr ? "Agences ONU, ambassades, grandes entreprises, événements institutionnels." : "UN agencies, embassies, large companies, institutional events."}
              </div>
              <Link href={`/${locale}/booking`} className="mt-auto block text-center bg-brand-red text-white py-3 rounded-sm font-bold uppercase tracking-wider hover:bg-brand-red-dark transition-colors text-sm">
                {fr ? "Réserver" : "Book Now"}
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Technical Add-ons */}
      <section className="py-20 bg-brand-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 text-center flex items-center justify-center">
            {fr ? "Options Techniques" : "Technical Add-ons"}
            <InfoTooltip content={tooltips.addon} position="top" />
          </h2>
          <div className="h-1 w-24 bg-brand-red mb-12 mx-auto" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {addOns.map((addon, index) => (
              <div
                key={index}
                className="bg-brand-black p-6 rounded-sm border border-brand-black-light hover:border-brand-red transition-all"
              >
                <h3 className="text-lg font-bold text-white mb-1">
                  {addon.name}
                </h3>
                <p className="text-brand-red font-bold">{addon.price}</p>
                {addon.note && (
                  <p className="text-gray-500 text-xs mt-1">{addon.note}</p>
                )}
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
              <svg
                className="w-6 h-6 text-brand-red mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h4 className="text-white font-bold text-sm mb-2">
                {fr ? "Confirmation par téléphone" : "Phone confirmation"}
              </h4>
              <p className="text-gray-400 text-xs leading-relaxed">
                {fr
                  ? "Toute réservation est confirmée par un appel de notre équipe. Les forfaits multi-séances sont planifiés ensemble lors de cet appel."
                  : "Every booking is confirmed by a call from our team. Multi-session packs are scheduled together during this call."}
              </p>
            </div>
            <div className="bg-brand-black-light border border-brand-black-light rounded-sm p-5">
              <svg
                className="w-6 h-6 text-brand-red mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h4 className="text-white font-bold text-sm mb-2">
                {fr ? "Horaires stricts" : "Strict time limits"}
              </h4>
              <p className="text-gray-400 text-xs leading-relaxed">
                {fr
                  ? "Les créneaux ont des heures de fin définies. Un dépassement peut être facturé au tarif de la session suivante si elle est occupée."
                  : "Slots have defined end times. Overtime may be billed at the next session rate if it is occupied."}
              </p>
            </div>
            <div className="bg-brand-black-light border border-brand-black-light rounded-sm p-5">
              <svg
                className="w-6 h-6 text-brand-red mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
              <h4 className="text-white font-bold text-sm mb-2">
                {fr ? "Paiement & annulation" : "Payment & cancellation"}
              </h4>
              <p className="text-gray-400 text-xs leading-relaxed">
                {fr
                  ? "Paiement à la confirmation. Annulation gratuite jusqu'à 48h avant. Les forfaits ne sont pas remboursables mais les séances sont reportables."
                  : "Payment at confirmation. Free cancellation up to 48h before. Packs are non-refundable but sessions can be rescheduled."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-brand-black-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {fr
              ? "Besoin d'une solution personnalisée ?"
              : "Need a custom solution?"}
          </h2>
          <div className="h-1 w-24 bg-brand-red mb-8 mx-auto" />
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            {fr
              ? "Contactez-nous pour discuter de vos besoins spécifiques"
              : "Contact us to discuss your specific needs"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/booking`}
              className="inline-block bg-brand-red text-white px-10 py-4 rounded-sm font-bold hover:bg-brand-red-dark transition-colors text-lg uppercase tracking-wider"
            >
              {fr ? "Réserver maintenant" : "Book Now"}
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="inline-block bg-transparent border-2 border-white text-white px-10 py-4 rounded-sm font-bold hover:bg-white hover:text-brand-black transition-all text-lg uppercase tracking-wider"
            >
              {fr ? "Nous contacter" : "Contact Us"}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
