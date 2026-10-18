import { notFound } from 'next/navigation';
import { getDbEventById } from '@/lib/admin-data';
import EventDetailClient from './EventDetailClient';

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getDbEventById(id);
  if (!event) notFound();
  return <EventDetailClient event={event} />;
}
