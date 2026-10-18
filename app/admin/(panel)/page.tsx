import Link from 'next/link';
import { getDbEvents, getPartners } from '@/lib/admin-data';

const sections = [
  {
    href: '/admin/events',
    eyebrow: 'Gallery',
    label: 'Events & Gallery',
    description: 'Add event photos, create new events, edit descriptions',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    href: '/admin/partners',
    eyebrow: 'Organisations',
    label: 'Partners',
    description: 'Add or remove partner organisations and logos',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    href: '/admin/pricing',
    eyebrow: 'USD',
    label: 'Pricing',
    description: 'Update space prices — half-day, full-day, session packs',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    href: '/admin/contact',
    eyebrow: 'Info',
    label: 'Contact',
    description: 'Update phone number, email address and location',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
  },
];

export default async function AdminDashboard() {
  const [dbEvents, partners] = await Promise.all([getDbEvents(), getPartners()]);

  const counts: Record<string, string> = {
    '/admin/events': `${dbEvents.length} event${dbEvents.length !== 1 ? 's' : ''}`,
    '/admin/partners': `${partners.length} partner${partners.length !== 1 ? 's' : ''}`,
    '/admin/pricing': 'S · M · L · XL · Co-work',
    '/admin/contact': 'Phone · Email · Address',
  };

  return (
    <main id="main-content" className="px-8 py-8 max-w-3xl">
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#dc2626] font-bold mb-1">Overview</p>
        <h1 className="text-2xl font-black text-gray-900">Dashboard</h1>
        <div className="h-0.5 w-10 bg-[#dc2626] mt-2" />
      </div>

      <nav aria-label="Admin sections">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sections.map(section => (
            <Link
              key={section.href}
              href={section.href}
              className="group bg-white border border-gray-200 hover:border-[#dc2626] rounded-sm p-5 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626] focus-visible:ring-offset-2 flex items-start gap-4"
            >
              <span className="text-gray-400 group-hover:text-[#dc2626] transition-colors mt-0.5 flex-shrink-0">
                {section.icon}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[9px] uppercase tracking-[0.2em] text-[#dc2626] font-bold mb-0.5">
                  {section.eyebrow}
                </p>
                <h2 className="text-sm font-black text-gray-900 group-hover:text-[#dc2626] transition-colors mb-1">
                  {section.label}
                </h2>
                <p className="text-gray-500 text-xs leading-relaxed mb-2">{section.description}</p>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  {counts[section.href]}
                </span>
              </div>
              <svg className="w-4 h-4 text-gray-300 group-hover:text-[#dc2626] transition-colors flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </nav>

      <div className="mt-6 border border-gray-200 bg-white rounded-sm px-5 py-4">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#dc2626] font-bold mb-1.5">Note</p>
        <p className="text-gray-500 text-xs leading-relaxed">
          Changes to partners, pricing and contact info are live immediately.
          New events appear on the website right after you create them.
        </p>
      </div>
    </main>
  );
}
