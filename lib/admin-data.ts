import { prisma } from '@/lib/prisma';

// ── Partners ──────────────────────────────────────────────────────────────────

export interface Partner {
  id: string;
  name: string;
  logo: string;
}

export async function getPartners(): Promise<Partner[]> {
  const rows = await prisma.partner.findMany({ orderBy: { order: 'asc' } });
  return rows.map(r => ({ id: r.id, name: r.name, logo: r.logoUrl }));
}

export async function addPartner(name: string, logoUrl: string): Promise<void> {
  const count = await prisma.partner.count();
  await prisma.partner.create({ data: { name, logoUrl, order: count } });
}

export async function deletePartner(id: string): Promise<void> {
  await prisma.partner.delete({ where: { id } });
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

export async function getContactInfo(): Promise<ContactInfo> {
  const rows = await prisma.contactInfo.findMany();
  if (rows.length === 0) return DEFAULT_CONTACT;
  const map = Object.fromEntries(rows.map(r => [r.key, r.value]));
  return {
    phone: map.phone ?? DEFAULT_CONTACT.phone,
    email: map.email ?? DEFAULT_CONTACT.email,
    addressFr: map.addressFr ?? DEFAULT_CONTACT.addressFr,
    addressEn: map.addressEn ?? DEFAULT_CONTACT.addressEn,
  };
}

export async function saveContactInfo(info: ContactInfo): Promise<void> {
  await Promise.all(
    Object.entries(info).map(([key, value]) =>
      prisma.contactInfo.upsert({
        where: { key },
        create: { key, value },
        update: { value },
      })
    )
  );
}

// ── Pricing ───────────────────────────────────────────────────────────────────

export interface SpacePrice {
  id: string;
  name: string;
  nameEn: string;
  nameFr: string;
  descriptionEn: string;
  descriptionFr: string;
  capacity: number;
  priceHalfDay: number;
  priceFullDay: number;
  priceBundle5: number;
  priceBundle10: number;
  amenities: string[];
}

export async function getPricing(): Promise<SpacePrice[]> {
  const spaces = await prisma.space.findMany({
    where: { available: true },
    orderBy: { capacity: 'asc' },
  });
  return spaces.map(s => ({
    id: s.id,
    name: s.name,
    nameEn: s.nameEn,
    nameFr: s.nameFr,
    descriptionEn: s.descriptionEn,
    descriptionFr: s.descriptionFr,
    capacity: s.capacity,
    priceHalfDay: Number(s.priceHalfDay),
    priceFullDay: Number(s.pricePerDay),
    priceBundle5: Number(s.priceBundle5),
    priceBundle10: Number(s.priceBundle10),
    amenities: JSON.parse(s.amenities) as string[],
  }));
}

export async function savePricing(pricing: SpacePrice[]): Promise<void> {
  await Promise.all(
    pricing.map(p =>
      prisma.space.update({
        where: { id: p.id },
        data: {
          priceHalfDay: p.priceHalfDay,
          pricePerDay: p.priceFullDay,
          priceBundle5: p.priceBundle5,
          priceBundle10: p.priceBundle10,
        },
      })
    )
  );
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

export async function getEventDescriptions(): Promise<Record<string, EventDescription>> {
  const rows = await prisma.eventEntry.findMany();
  return Object.fromEntries(
    rows.map(r => [
      r.id,
      {
        nameEn: r.nameEn,
        nameFr: r.nameFr,
        descriptionEn: r.descriptionEn,
        descriptionFr: r.descriptionFr,
        shortDescriptionEn: r.shortDescEn,
        shortDescriptionFr: r.shortDescFr,
      },
    ])
  );
}

// ── Public events (DB as single source of truth) ─────────────────────────────

export interface PublicEvent {
  id: string;
  name: string;
  nameFr: string;
  nameEn: string;
  date: string;
  displayDate: string;
  images: string[];
  totalImages: number;
  shortDescFr: string;
  shortDescEn: string;
  descriptionFr: string;
  descriptionEn: string;
}

function toPublicEvent(r: {
  id: string; nameFr: string; nameEn: string; date: Date;
  shortDescFr: string; shortDescEn: string;
  descriptionFr: string; descriptionEn: string;
  images: { url: string; order: number }[];
}): PublicEvent {
  const images = r.images.map(i => i.url);
  return {
    id: r.id,
    name: r.nameFr,
    nameFr: r.nameFr,
    nameEn: r.nameEn,
    date: r.date.toISOString(),
    displayDate: r.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    images,
    totalImages: images.length,
    shortDescFr: r.shortDescFr,
    shortDescEn: r.shortDescEn,
    descriptionFr: r.descriptionFr,
    descriptionEn: r.descriptionEn,
  };
}

export async function getAllPublicEvents(): Promise<PublicEvent[]> {
  const rows = await prisma.eventEntry.findMany({
    include: { images: { orderBy: { order: 'asc' } } },
    orderBy: { date: 'desc' },
  });
  return rows.map(toPublicEvent);
}

export async function getPublicEventById(id: string): Promise<PublicEvent | null> {
  const row = await prisma.eventEntry.findUnique({
    where: { id },
    include: { images: { orderBy: { order: 'asc' } } },
  });
  return row ? toPublicEvent(row) : null;
}

// ── DB Events (admin-created, stored in Neon + Blob) ─────────────────────────

export interface DbEvent {
  id: string;
  nameFr: string;
  nameEn: string;
  date: string;
  descriptionFr: string;
  descriptionEn: string;
  shortDescFr: string;
  shortDescEn: string;
  images: string[];
}

export async function getDbEvents(): Promise<DbEvent[]> {
  const rows = await prisma.eventEntry.findMany({
    include: { images: { orderBy: { order: 'asc' } } },
    orderBy: { date: 'desc' },
  });
  return rows.map(r => ({
    id: r.id,
    nameFr: r.nameFr,
    nameEn: r.nameEn,
    date: r.date.toISOString(),
    descriptionFr: r.descriptionFr,
    descriptionEn: r.descriptionEn,
    shortDescFr: r.shortDescFr,
    shortDescEn: r.shortDescEn,
    images: r.images.map(i => i.url),
  }));
}

export async function createDbEvent(data: {
  nameFr: string;
  nameEn: string;
  date: Date;
  descriptionFr: string;
  descriptionEn: string;
  imageUrls: string[];
}): Promise<string> {
  const event = await prisma.eventEntry.create({
    data: {
      nameFr: data.nameFr,
      nameEn: data.nameEn,
      date: data.date,
      descriptionFr: data.descriptionFr,
      descriptionEn: data.descriptionEn,
      shortDescFr: data.descriptionFr.slice(0, 200),
      shortDescEn: data.descriptionEn.slice(0, 200),
      images: {
        create: data.imageUrls.map((url, i) => ({ url, order: i })),
      },
    },
  });
  return event.id;
}

export async function addImagesToEvent(eventId: string, urls: string[]): Promise<void> {
  const count = await prisma.eventImage.count({ where: { eventId } });
  await prisma.eventImage.createMany({
    data: urls.map((url, i) => ({ eventId, url, order: count + i })),
  });
}

export async function deleteDbEvent(id: string): Promise<void> {
  await prisma.eventEntry.delete({ where: { id } });
}

export interface DbEventDetail {
  id: string;
  nameFr: string;
  nameEn: string;
  date: string;
  descriptionFr: string;
  descriptionEn: string;
  shortDescFr: string;
  shortDescEn: string;
  images: { id: string; url: string; order: number }[];
}

export async function getDbEventById(id: string): Promise<DbEventDetail | null> {
  const row = await prisma.eventEntry.findUnique({
    where: { id },
    include: { images: { orderBy: { order: 'asc' } } },
  });
  if (!row) return null;
  return {
    id: row.id,
    nameFr: row.nameFr,
    nameEn: row.nameEn,
    date: row.date.toISOString(),
    descriptionFr: row.descriptionFr,
    descriptionEn: row.descriptionEn,
    shortDescFr: row.shortDescFr,
    shortDescEn: row.shortDescEn,
    images: row.images.map(i => ({ id: i.id, url: i.url, order: i.order })),
  };
}

export async function deleteEventImage(imageId: string): Promise<void> {
  await prisma.eventImage.delete({ where: { id: imageId } });
}
