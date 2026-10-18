import { getContactInfo } from '@/lib/admin-data';
import ContactPageClient from './ContactPageClient';

export default function ContactPage() {
  const contactInfo = getContactInfo();
  return <ContactPageClient contactInfo={contactInfo} />;
}
