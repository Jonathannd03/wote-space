import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

function readJSON<T>(filename: string, fallback: T): T {
  try {
    const content = fs.readFileSync(path.join(DATA_DIR, filename), 'utf8');
    return JSON.parse(content) as T;
  } catch {
    return fallback;
  }
}

function writeJSON(filename: string, data: unknown): void {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(path.join(DATA_DIR, filename), JSON.stringify(data, null, 2), 'utf8');
}

// ── Partners ──────────────────────────────────────────────────────────────────

export interface Partner {
  id: string;
  name: string;
  logo: string;
}

export function getPartners(): Partner[] {
  return readJSON<Partner[]>('partners.json', []);
}

export function savePartners(partners: Partner[]): void {
  writeJSON('partners.json', partners);
}

// ── Contact ───────────────────────────────────────────────────────────────────

export interface ContactInfo {
  phone: string;
  email: string;
  addressFr: string;
  addressEn: string;
}

const DEFAULT_CONTACT: ContactInfo = {
  phone: '+243 980 244 431',
  email: 'info@wote-space.com',
  addressFr: '112, Boulevard Julien Paluku, Karisimbi\nQuartier Murara, Goma - Nord-Kivu, RDC',
  addressEn: '112, Boulevard Julien Paluku, Karisimbi\nMurara Neighborhood, Goma - North Kivu, DRC',
};

export function getContactInfo(): ContactInfo {
  return readJSON<ContactInfo>('contact.json', DEFAULT_CONTACT);
}

export function saveContactInfo(info: ContactInfo): void {
  writeJSON('contact.json', info);
}

// ── Pricing ───────────────────────────────────────────────────────────────────

export interface SpacePrice {
  id: string;
  name: string;
  nameEn: string;
  nameFr: string;
  capacity: number;
  priceHalfDay: number;
  priceFullDay: number;
  priceBundle5: number;
  priceBundle10: number;
  amenities: string[];
}

export function getPricing(): SpacePrice[] {
  return readJSON<SpacePrice[]>('pricing.json', []);
}

export function savePricing(pricing: SpacePrice[]): void {
  writeJSON('pricing.json', pricing);
}

// ── Event descriptions ────────────────────────────────────────────────────────

export interface EventDescription {
  nameEn: string;
  nameFr: string;
  descriptionEn: string;
  descriptionFr: string;
  shortDescriptionEn: string;
  shortDescriptionFr: string;
}

export function getEventDescriptions(): Record<string, EventDescription> {
  return readJSON<Record<string, EventDescription>>('event-descriptions.json', {});
}

export function saveEventDescriptions(data: Record<string, EventDescription>): void {
  writeJSON('event-descriptions.json', data);
}
