jest.mock('@/lib/prisma', () => ({
  prisma: {
    partner: {
      findMany: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    contactInfo: {
      findMany: jest.fn(),
      upsert: jest.fn(),
    },
    space: {
      findMany: jest.fn(),
      update: jest.fn(),
    },
    eventEntry: {
      findMany: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
    eventImage: {
      count: jest.fn(),
      createMany: jest.fn(),
    },
  },
}));

import { prisma } from '@/lib/prisma';
import {
  getPartners,
  addPartner,
  deletePartner,
  getContactInfo,
  saveContactInfo,
  getPricing,
  savePricing,
  getDbEvents,
  createDbEvent,
  addImagesToEvent,
  deleteDbEvent,
} from '@/lib/admin-data';

const mock = prisma as {
  partner: Record<string, jest.Mock>;
  contactInfo: Record<string, jest.Mock>;
  space: Record<string, jest.Mock>;
  eventEntry: Record<string, jest.Mock>;
  eventImage: Record<string, jest.Mock>;
};

beforeEach(() => jest.clearAllMocks());

// ── Partners ─────────────────────────────────────────────────────────────────

describe('getPartners', () => {
  it('returns mapped partners in order', async () => {
    mock.partner.findMany.mockResolvedValue([
      { id: '1', name: 'Org A', logoUrl: '/logo-a.png', order: 0 },
      { id: '2', name: 'Org B', logoUrl: '/logo-b.png', order: 1 },
    ]);
    const result = await getPartners();
    expect(result).toEqual([
      { id: '1', name: 'Org A', logo: '/logo-a.png' },
      { id: '2', name: 'Org B', logo: '/logo-b.png' },
    ]);
    expect(mock.partner.findMany).toHaveBeenCalledWith({ orderBy: { order: 'asc' } });
  });

  it('returns empty array when no partners exist', async () => {
    mock.partner.findMany.mockResolvedValue([]);
    expect(await getPartners()).toEqual([]);
  });
});

describe('addPartner', () => {
  it('creates a partner with order = current count', async () => {
    mock.partner.count.mockResolvedValue(3);
    mock.partner.create.mockResolvedValue({});
    await addPartner('New Org', '/new-logo.png');
    expect(mock.partner.create).toHaveBeenCalledWith({
      data: { name: 'New Org', logoUrl: '/new-logo.png', order: 3 },
    });
  });
});

describe('deletePartner', () => {
  it('deletes by id', async () => {
    mock.partner.delete.mockResolvedValue({});
    await deletePartner('abc123');
    expect(mock.partner.delete).toHaveBeenCalledWith({ where: { id: 'abc123' } });
  });
});

// ── Contact info ──────────────────────────────────────────────────────────────

describe('getContactInfo', () => {
  it('returns defaults when the table is empty', async () => {
    mock.contactInfo.findMany.mockResolvedValue([]);
    const info = await getContactInfo();
    expect(info.phone).toBe('+243 980 244 431');
    expect(info.email).toBe('info@wote-space.com');
    expect(info.addressFr).toBeTruthy();
    expect(info.addressEn).toBeTruthy();
  });

  it('returns DB values when rows exist', async () => {
    mock.contactInfo.findMany.mockResolvedValue([
      { key: 'phone', value: '+1 555 000 0000' },
      { key: 'email', value: 'new@example.com' },
      { key: 'addressFr', value: 'Adresse FR' },
      { key: 'addressEn', value: 'Address EN' },
    ]);
    const info = await getContactInfo();
    expect(info.phone).toBe('+1 555 000 0000');
    expect(info.email).toBe('new@example.com');
    expect(info.addressFr).toBe('Adresse FR');
    expect(info.addressEn).toBe('Address EN');
  });

  it('falls back to defaults for missing keys', async () => {
    mock.contactInfo.findMany.mockResolvedValue([
      { key: 'phone', value: '+1 555 000 0000' },
    ]);
    const info = await getContactInfo();
    expect(info.phone).toBe('+1 555 000 0000');
    expect(info.email).toBe('info@wote-space.com');
  });
});

describe('saveContactInfo', () => {
  it('upserts all four contact fields', async () => {
    mock.contactInfo.upsert.mockResolvedValue({});
    await saveContactInfo({
      phone: '+1 555',
      email: 'a@b.com',
      addressFr: 'FR',
      addressEn: 'EN',
    });
    expect(mock.contactInfo.upsert).toHaveBeenCalledTimes(4);
    expect(mock.contactInfo.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ where: { key: 'phone' } })
    );
  });
});

// ── Pricing ───────────────────────────────────────────────────────────────────

describe('getPricing', () => {
  const mockSpaces = [
    {
      id: 's1', name: 'Setup S', nameEn: 'Setup S (1–10)', nameFr: 'Config S',
      capacity: 10, priceHalfDay: 30, pricePerDay: 60,
      priceBundle5: 125, priceBundle10: 225,
      amenities: '["Wi-Fi"]',
    },
    {
      id: 's2', name: 'Setup M', nameEn: 'Setup M (11–25)', nameFr: 'Config M',
      capacity: 25, priceHalfDay: 45, pricePerDay: 90,
      priceBundle5: 185, priceBundle10: 335,
      amenities: '["Wi-Fi","Video Conferencing"]',
    },
  ];

  it('maps DB rows to SpacePrice objects', async () => {
    mock.space.findMany.mockResolvedValue(mockSpaces);
    const pricing = await getPricing();
    expect(pricing).toHaveLength(2);
    expect(pricing[0]).toMatchObject({
      id: 's1',
      name: 'Setup S',
      priceHalfDay: 30,
      priceFullDay: 60,
      priceBundle5: 125,
      priceBundle10: 225,
      amenities: ['Wi-Fi'],
    });
  });

  it('queries only available spaces ordered by capacity', async () => {
    mock.space.findMany.mockResolvedValue([]);
    await getPricing();
    expect(mock.space.findMany).toHaveBeenCalledWith({
      where: { available: true },
      orderBy: { capacity: 'asc' },
    });
  });
});

describe('savePricing', () => {
  it('updates each space with new prices', async () => {
    mock.space.update.mockResolvedValue({});
    await savePricing([
      { id: 's1', name: 'Setup S', nameEn: '', nameFr: '', capacity: 10,
        priceHalfDay: 35, priceFullDay: 65, priceBundle5: 130, priceBundle10: 230, amenities: [] },
    ]);
    expect(mock.space.update).toHaveBeenCalledWith({
      where: { id: 's1' },
      data: { priceHalfDay: 35, pricePerDay: 65, priceBundle5: 130, priceBundle10: 230 },
    });
  });
});

// ── DB Events ─────────────────────────────────────────────────────────────────

describe('getDbEvents', () => {
  it('returns events with mapped image URLs', async () => {
    mock.eventEntry.findMany.mockResolvedValue([
      {
        id: 'ev1', nameFr: 'Événement', nameEn: 'Event',
        date: new Date('2026-03-01'),
        descriptionFr: 'Desc FR', descriptionEn: 'Desc EN',
        shortDescFr: 'Short FR', shortDescEn: 'Short EN',
        images: [{ url: 'https://blob.example.com/img.jpg', order: 0 }],
      },
    ]);
    const events = await getDbEvents();
    expect(events).toHaveLength(1);
    expect(events[0].id).toBe('ev1');
    expect(events[0].images).toEqual(['https://blob.example.com/img.jpg']);
    expect(events[0].date).toBe(new Date('2026-03-01').toISOString());
  });

  it('returns empty array when no events exist', async () => {
    mock.eventEntry.findMany.mockResolvedValue([]);
    expect(await getDbEvents()).toEqual([]);
  });
});

describe('createDbEvent', () => {
  it('creates an event and returns the new id', async () => {
    mock.eventEntry.create.mockResolvedValue({ id: 'new-ev-id' });
    const id = await createDbEvent({
      nameFr: 'Nouveau', nameEn: 'New',
      date: new Date('2026-04-01'),
      descriptionFr: 'Desc FR', descriptionEn: 'Desc EN',
      imageUrls: ['https://blob.example.com/a.jpg'],
    });
    expect(id).toBe('new-ev-id');
    expect(mock.eventEntry.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ nameFr: 'Nouveau', nameEn: 'New' }),
      })
    );
  });
});

describe('addImagesToEvent', () => {
  it('creates image records with correct order offset', async () => {
    mock.eventImage.count.mockResolvedValue(2);
    mock.eventImage.createMany.mockResolvedValue({ count: 2 });
    await addImagesToEvent('ev1', ['https://blob/img1.jpg', 'https://blob/img2.jpg']);
    expect(mock.eventImage.createMany).toHaveBeenCalledWith({
      data: [
        { eventId: 'ev1', url: 'https://blob/img1.jpg', order: 2 },
        { eventId: 'ev1', url: 'https://blob/img2.jpg', order: 3 },
      ],
    });
  });
});

describe('deleteDbEvent', () => {
  it('deletes event by id', async () => {
    mock.eventEntry.delete.mockResolvedValue({});
    await deleteDbEvent('ev-to-delete');
    expect(mock.eventEntry.delete).toHaveBeenCalledWith({ where: { id: 'ev-to-delete' } });
  });
});
