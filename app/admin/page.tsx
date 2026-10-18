import Link from 'next/link';
import Image from 'next/image';
import { getDbEvents } from '@/lib/admin-data';
import { getPartners } from '@/lib/admin-data';
import LogoutButton from './LogoutButton';
import eventsManifest from '@/public/events-manifest.json';

export default async function AdminDashboard() {
  const [dbEvents, partners] = await Promise.all([getDbEvents(), getPartners()]);
  const staticEventCount = (eventsManifest as { events: unknown[] }).events.length;
  const totalEvents = staticEventCount + dbEvents.length;

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
      count: 'Setup S · M · L · XL · Co-work',
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
    <div className="min-h-screen">
      <header className="border-b border-[#1a1a1a] bg-[#0a0a0a] sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image src="/Wotespace-logo-01.png" alt="Wote Space" width={120} height={48} />
            <span className="text-gray-500 text-sm border-l border-[#2a2a2a] pl-4">Admin</span>
          </div>
          <LogoutButton />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Manage your website content from here.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map(section => (
            <Link
              key={section.href}
              href={section.href}
              className="group bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#dc2626] rounded-sm p-6 transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl">{section.icon}</span>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-white group-hover:text-[#dc2626] transition-colors mb-1">
                    {section.label}
                  </h2>
                  <p className="text-gray-400 text-sm mb-3">{section.description}</p>
                  <span className="text-xs text-gray-500 bg-[#0a0a0a] px-2 py-1 rounded-sm">
                    {section.count}
                  </span>
                </div>
                <span className="text-gray-600 group-hover:text-[#dc2626] transition-colors text-xl">→</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 bg-[#1a1a1a] border border-[#2a2a2a] rounded-sm p-6">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Quick tip</h2>
          <p className="text-gray-300 text-sm">
            Changes to partners, pricing and contact info are live immediately.
            New events appear on the website right after you create them.
          </p>
        </div>
      </main>
    </div>
  );
}
