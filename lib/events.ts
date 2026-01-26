import eventsManifest from '@/public/events-manifest.json';

export interface Event {
  id: string; // slug-friendly version of the folder name
  name: string; // parsed event name (fallback)
  nameEn?: string; // English name
  nameFr?: string; // French name
  date: string; // ISO date string
  displayDate: string; // formatted date for display
  folder: string; // original folder name
  images: string[]; // array of image paths
  totalImages: number;
}

interface EventManifestEntry {
  folder: string;
  name: string;
  year: number;
  month: number;
  day: number;
  imageCount: number;
  imageFiles: string[];
}

/**
 * Get all events from the pre-generated manifest
 * This works in both development and production (including Vercel)
 */
export function getEvents(): Event[] {
  try {
    const manifest = eventsManifest as { events: EventManifestEntry[] };
    const events: Event[] = [];

    for (const entry of manifest.events) {
      const eventId = entry.folder.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const date = new Date(entry.year, entry.month - 1, entry.day);

      // Map image filenames to full paths
      const images = entry.imageFiles.map(file => `/events/${entry.folder}/${file}`);

      events.push({
        id: eventId,
        name: entry.name,
        nameEn: getEventName(eventId, 'en'),
        nameFr: getEventName(eventId, 'fr'),
        date: date.toISOString(),
        displayDate: date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        folder: entry.folder,
        images,
        totalImages: entry.imageCount,
      });
    }

    return events;
  } catch (error) {
    console.error('Error getting events from manifest:', error);
    return [];
  }
}

/**
 * Get a single event by ID
 */
export function getEventById(id: string): Event | null {
  const events = getEvents();
  return events.find(event => event.id === id) || null;
}

/**
 * Get internationalized event names (can be expanded with a JSON file later)
 */
export function getEventName(eventId: string, locale: 'en' | 'fr'): string {
  const names: Record<string, { en: string; fr: string }> = {
    'opening-ceremony-25-01-2026': {
      en: 'Opening Ceremony',
      fr: 'Cérémonie d\'Ouverture',
    },
    'public-speaking-training-16-01-2026': {
      en: 'Public Speaking Training',
      fr: 'Master Class en Art Oratoire',
    },
  };

  return names[eventId]?.[locale] || eventId.replace(/-/g, ' ');
}

/**
 * Get event descriptions (can be expanded with a JSON file later)
 */
export function getEventDescription(eventId: string, locale: 'en' | 'fr'): string {
  // Default descriptions - can be moved to a JSON file or database later
  const descriptions: Record<string, { en: string; fr: string }> = {
    'opening-ceremony-25-01-2026': {
      en: 'We celebrated the grand opening of Wote Space! This memorable event marked the launch of our collaborative workspace in the heart of the city. Professionals gathered to network, enjoy refreshments, and explore our versatile space for the first time.',
      fr: 'Nous avons célébré la grande ouverture de Wote Space ! Cet événement mémorable a marqué le lancement de notre espace de travail collaboratif au cœur de la ville. Les professionnels se sont réunis pour réseauter, profiter de rafraîchissements et découvrir notre espace polyvalent pour la première fois.',
    },
    'public-speaking-training-16-01-2026': {
      en: 'An intensive training workshop was held to help participants enhance their public speaking skills. Attendees learned valuable techniques to captivate audiences, overcome stage fright, and deliver powerful presentations. This session was perfect for professionals looking to improve their communication abilities.',
      fr: 'Un atelier de formation intensif a été organisé pour aider les participants à améliorer leurs compétences en prise de parole en public. Les participants ont appris des techniques précieuses pour captiver leur public, surmonter le trac et livrer des présentations percutantes. Cette session était parfaite pour les professionnels cherchant à améliorer leurs compétences en communication.',
    },
  };

  return descriptions[eventId]?.[locale] || (locale === 'fr'
    ? 'Un événement mémorable qui s\'est tenu à Wote Space.'
    : 'A memorable event that took place at Wote Space.');
}

/**
 * Get short event description for cards (can be expanded with a JSON file later)
 */
export function getEventShortDescription(eventId: string, locale: 'en' | 'fr'): string {
  // Short descriptions for event cards
  const shortDescriptions: Record<string, { en: string; fr: string }> = {
    'opening-ceremony-25-01-2026': {
      en: 'We celebrated the grand opening of Wote Space with networking, refreshments, and tours of our collaborative workspace.',
      fr: 'Nous avons célébré la grande ouverture de Wote Space avec réseautage, rafraîchissements et visites de notre espace collaboratif.',
    },
    'public-speaking-training-16-01-2026': {
      en: 'An intensive workshop helped participants enhance their public speaking skills and overcome stage fright.',
      fr: 'Un atelier intensif a aidé les participants à améliorer leurs compétences en prise de parole en public et surmonter le trac.',
    },
  };

  return shortDescriptions[eventId]?.[locale] || (locale === 'fr'
    ? 'Un événement qui s\'est tenu à Wote Space.'
    : 'An event that took place at Wote Space.');
}
