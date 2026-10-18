jest.mock('@/public/events-manifest.json', () => ({
  events: [
    {
      folder: 'opening-ceremony_25_01_2026',
      name: 'opening-ceremony',
      year: 2026,
      month: 1,
      day: 25,
      imageCount: 2,
      imageFiles: ['img1.jpg', 'img2.jpg'],
    },
    {
      folder: 'public-speaking-training_16_01_2026',
      name: 'public-speaking-training',
      year: 2026,
      month: 1,
      day: 16,
      imageCount: 1,
      imageFiles: ['photo.jpg'],
    },
  ],
}));

import { getEvents, getEventById, getEventName, getEventDescription, getEventShortDescription } from '@/lib/events';

describe('getEvents', () => {
  it('returns one Event per manifest entry', () => {
    expect(getEvents()).toHaveLength(2);
  });

  it('builds the correct event id from the folder name', () => {
    const events = getEvents();
    expect(events[0].id).toBe('opening-ceremony-25-01-2026');
    expect(events[1].id).toBe('public-speaking-training-16-01-2026');
  });

  it('maps image filenames to full /events/{folder}/{file} paths', () => {
    const event = getEvents()[0];
    expect(event.images).toEqual([
      '/events/opening-ceremony_25_01_2026/img1.jpg',
      '/events/opening-ceremony_25_01_2026/img2.jpg',
    ]);
  });

  it('sets totalImages to the manifest imageCount', () => {
    expect(getEvents()[0].totalImages).toBe(2);
    expect(getEvents()[1].totalImages).toBe(1);
  });

  it('includes an ISO date string', () => {
    const event = getEvents()[0];
    expect(() => new Date(event.date)).not.toThrow();
    expect(new Date(event.date).getFullYear()).toBe(2026);
    expect(new Date(event.date).getMonth()).toBe(0); // January = 0
  });

  it('includes a human-readable displayDate', () => {
    expect(getEvents()[0].displayDate).toMatch(/2026/);
  });
});

describe('getEventById', () => {
  it('finds an event by id', () => {
    const event = getEventById('opening-ceremony-25-01-2026');
    expect(event).not.toBeNull();
    expect(event?.id).toBe('opening-ceremony-25-01-2026');
  });

  it('returns null for an unknown id', () => {
    expect(getEventById('does-not-exist')).toBeNull();
  });
});

describe('getEventName', () => {
  it('returns the English name for a known event', () => {
    expect(getEventName('opening-ceremony-25-01-2026', 'en')).toBe('Opening Ceremony');
  });

  it('returns the French name for a known event', () => {
    expect(getEventName('opening-ceremony-25-01-2026', 'fr')).toBe("Cérémonie d'Ouverture");
  });

  it('falls back to a humanised slug for an unknown event', () => {
    const result = getEventName('unknown-event-id', 'en');
    expect(result).toBe('unknown event id');
  });
});

describe('getEventDescription', () => {
  it('returns an English description for a known event', () => {
    const desc = getEventDescription('opening-ceremony-25-01-2026', 'en');
    expect(typeof desc).toBe('string');
    expect(desc.length).toBeGreaterThan(20);
  });

  it('returns a French description for a known event', () => {
    const desc = getEventDescription('opening-ceremony-25-01-2026', 'fr');
    expect(desc).toContain('Wote Space');
  });

  it('returns a fallback string for an unknown event (en)', () => {
    const desc = getEventDescription('unknown-event', 'en');
    expect(desc).toMatch(/Wote Space/i);
  });

  it('returns a fallback string for an unknown event (fr)', () => {
    const desc = getEventDescription('unknown-event', 'fr');
    expect(desc).toMatch(/Wote Space/i);
  });
});

describe('getEventShortDescription', () => {
  it('returns a short English description for a known event', () => {
    const desc = getEventShortDescription('opening-ceremony-25-01-2026', 'en');
    expect(typeof desc).toBe('string');
    expect(desc.length).toBeGreaterThan(10);
  });

  it('returns a short French description for a known event', () => {
    const desc = getEventShortDescription('opening-ceremony-25-01-2026', 'fr');
    expect(typeof desc).toBe('string');
    expect(desc.length).toBeGreaterThan(10);
  });

  it('returns a fallback for an unknown event', () => {
    const en = getEventShortDescription('unknown-event', 'en');
    const fr = getEventShortDescription('unknown-event', 'fr');
    expect(en).toMatch(/Wote Space/i);
    expect(fr).toMatch(/Wote Space/i);
  });
});
