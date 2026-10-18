import Link from 'next/link';
import Image from 'next/image';
import { getDbEvents, getPartners } from '@/lib/admin-data';
import LogoutButton from './LogoutButton';

export default async function AdminDashboard() {
  const [dbEvents, partners] = await Promise.all([getDbEvents(), getPartners()]);
  const totalEvents = dbEvents.length;

  const sections = [
    {
      href: '/admin/events',
      label: 'Events & Gallery',
      description: 'Add event photos, create new events, edit descriptions',
      count: `${totalEvents} events`,
      icon: '🖼️',
    },
    {
      href: '/admin/partners',
      label: 'Partners',
      description: 'Add or remove partner organisations and logos',
      count: `${partners.length} partners`,
      icon: '🤝',
    },
    {
      href: '/admin/pricing',
      label: 'Pricing',
      description: 'Update space prices (half-day, full-day, packs)',
      count: 'S · M · L · XL · Co-work',
      icon: '💰',
    },
    {
      href: '/admin/contact',
      label: 'Contact Info',
      description: 'Update phone number, email address and location',
      count: 'Phone · Email · Address',
      icon: '📞',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image src="/Wotespace-logo-01.png" alt="Wote Space" width={110} height={44} />
            <span className="text-gray-500 text-sm border-l border-gray-200 pl-4">Admin</span>
          </div>
          <LogoutButton />
        </div>
      </header>

      <main id="main-content" className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your website content from here.</p>
        </div>

        <nav aria-label="Admin sections">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sections.map(section => (
              <Link
                key={section.href}
                href={section.href}
                className="group bg-white border border-gray-200 hover:border-red-500 hover:shadow-sm rounded-lg p-6 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
              >
                <div className="flex items-start gap-4">
                  <span className="text-2xl" aria-hidden="true">{section.icon}</span>
                  <div className="flex-1">
                    <h2 className="text-base font-semibold text-gray-900 group-hover:text-red-600 transition-colors mb-0.5">
                      {section.label}
                    </h2>
                    <p className="text-gray-500 text-sm mb-3">{section.description}</p>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      {section.count}
                    </span>
                  </div>
                  <span className="text-gray-400 group-hover:text-red-500 transition-colors text-lg mt-0.5" aria-hidden="true">→</span>
                </div>
              </Link>
            ))}
          </div>
        </nav>

        <div className="mt-6 bg-blue-50 border border-blue-100 rounded-lg p-5">
          <p className="text-blue-700 text-sm">
            <span className="font-semibold">Tip:</span> Changes to partners, pricing and contact info are live immediately.
            New events appear on the website right after you create them.
          </p>
        </div>
      </main>
    </div>
  );
}
