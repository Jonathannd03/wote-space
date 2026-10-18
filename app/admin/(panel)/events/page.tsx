import { getDbEvents } from '@/lib/admin-data';
import EventsClient from './EventsClient';

export default async function AdminEventsPage() {
  const events = await getDbEvents();
  return <EventsClient events={events} />;
}
