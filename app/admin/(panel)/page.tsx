import Link from 'next/link';
import Image from 'next/image';
import { cookies } from 'next/headers';
import { getDbEvents, getPartners, getPricing } from '@/lib/admin-data';
import translations from '@/lib/admin-i18n';
import type { AdminLang } from '@/lib/admin-i18n';

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const rawLang = cookieStore.get('admin-lang')?.value;
  const lang: AdminLang = rawLang === 'en' ? 'en' : 'fr';
  const t = translations[lang].dashboard;

  const [dbEvents, partners, pricing] = await Promise.all([
    getDbEvents(),
    getPartners(),
    getPricing(),
  ]);

  const totalPhotos = dbEvents.reduce((sum, e) => sum + e.images.length, 0);
  const recentEvents = [...dbEvents]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const stats = [
    { label: t.stats.events, value: dbEvents.length, href: '/admin/events' },
    { label: t.stats.photos, value: totalPhotos, href: '/admin/events' },
    { label: t.stats.partners, value: partners.length, href: '/admin/partners' },
    { label: t.stats.spaces, value: pricing.length, href: '/admin/pricing' },
  ];

  const sections = [
    {
      href: '/admin/events',
      eyebrow: t.sections.events.eyebrow,
      label: t.sections.events.label,
      description: t.sections.events.desc,
      count: t.event(dbEvents.length),
    },
    {
      href: '/admin/partners',
      eyebrow: t.sections.partners.eyebrow,
      label: t.sections.partners.label,
      description: t.sections.partners.desc,
      count: t.partner(partners.length),
    },
    {
      href: '/admin/pricing',
      eyebrow: t.sections.pricing.eyebrow,
      label: t.sections.pricing.label,
      description: t.sections.pricing.desc,
      count: 'S · M · L · XL · Co-work',
    },
    {
      href: '/admin/contact',
      eyebrow: t.sections.contact.eyebrow,
      label: t.sections.contact.label,
      description: t.sections.contact.desc,
      count: lang === 'fr' ? 'Tél · E-mail · Adresse' : 'Phone · Email · Address',
    },
  ];

  const icons = [
    <svg key="events" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    <svg key="partners" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
    <svg key="pricing" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    <svg key="contact" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
  ];

  return (
    <main id="main-content" className="px-8 py-8">

      {/* Header */}
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#dc2626] font-bold mb-1">{t.eyebrow}</p>
        <h1 className="text-2xl font-black text-gray-900">{t.title}</h1>
        <div className="h-0.5 w-10 bg-[#dc2626] mt-2" />
      </div>

      {/* Stat bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {stats.map(stat => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group bg-white border border-gray-200 hover:border-[#dc2626] rounded-sm px-5 py-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626] focus-visible:ring-offset-2"
          >
            <p className="text-3xl font-black text-gray-900 group-hover:text-[#dc2626] transition-colors leading-none mb-1">
              {stat.value}
            </p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Nav cards */}
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-3">{t.manage}</p>
        <nav aria-label="Admin sections">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
            {sections.map((section, i) => (
              <Link
                key={section.href}
                href={section.href}
                className="group bg-white border border-gray-200 hover:border-[#dc2626] rounded-sm p-5 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626] focus-visible:ring-offset-2 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between">
                  <span className="text-gray-400 group-hover:text-[#dc2626] transition-colors">
                    {icons[i]}
                  </span>
                  <svg className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#dc2626] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-[#dc2626] font-bold mb-0.5">{section.eyebrow}</p>
                  <h2 className="text-sm font-black text-gray-900 group-hover:text-[#dc2626] transition-colors mb-1">{section.label}</h2>
                  <p className="text-gray-500 text-xs leading-relaxed">{section.description}</p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-auto">{section.count}</span>
              </Link>
            ))}
          </div>
        </nav>
      </div>

      {/* Recent events */}
      {recentEvents.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">{t.recentEvents}</p>
            <Link href="/admin/events" className="text-[10px] uppercase tracking-[0.2em] text-[#dc2626] font-bold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626] rounded-sm">
              {t.viewAll}
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
            {recentEvents.map(event => {
              const cover = event.images[0] ?? null;
              const date = new Date(event.date).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' });
              return (
                <Link
                  key={event.id}
                  href={`/admin/events/${event.id}`}
                  className="group bg-white border border-gray-200 hover:border-[#dc2626] rounded-sm overflow-hidden transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626] focus-visible:ring-offset-2"
                >
                  <div className="relative h-28 bg-gray-100 overflow-hidden">
                    {cover ? (
                      <Image src={cover} alt="" role="presentation" fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 20vw" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="px-3 py-2.5">
                    <p className="text-xs font-bold text-gray-900 truncate group-hover:text-[#dc2626] transition-colors">{event.nameFr}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{date} · {t.photo(event.images.length)}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Note */}
      <div className="mt-8 border border-gray-200 bg-white rounded-sm px-5 py-4">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#dc2626] font-bold mb-1.5">{t.noteLabel}</p>
        <p className="text-gray-500 text-xs leading-relaxed">{t.note}</p>
      </div>
    </main>
  );
}
