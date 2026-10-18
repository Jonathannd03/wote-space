import { getContactInfo } from '@/lib/admin-data';
import ContactPageClient from './ContactPageClient';

export default async function ContactPage() {
  const contactInfo = await getContactInfo();
  return <ContactPageClient contactInfo={contactInfo} />;
}
