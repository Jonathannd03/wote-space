import fs from 'fs';
import path from 'path';

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

/**
 * Parse event folder name to extract name and date
 * Format: "event name_DD_MM_YYYY"
 */
function parseEventFolder(folderName: string): { name: string; date: Date } | null {
  const parts = folderName.split('_');

  if (parts.length < 4) {
    return null;
  }

  // Last three parts should be DD_MM_YYYY
  const year = parts[parts.length - 1];
  const month = parts[parts.length - 2];
  const day = parts[parts.length - 3];

  // Everything before the date is the event name
  const name = parts.slice(0, parts.length - 3).join(' ');

  // Validate date parts
  const yearNum = parseInt(year);
  const monthNum = parseInt(month);
  const dayNum = parseInt(day);

  if (isNaN(yearNum) || isNaN(monthNum) || isNaN(dayNum)) {
    return null;
  }

  // Create date (month is 0-indexed in JS Date)
  const date = new Date(yearNum, monthNum - 1, dayNum);

  return { name, date };
}

/**
 * Get all images from an event folder
 */
function getEventImages(eventFolder: string): string[] {
  const eventsDir = path.join(process.cwd(), 'public', 'events', eventFolder);

  try {
    const files = fs.readdirSync(eventsDir);
    return files
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .sort((a, b) => {
        // Sort by number in filename (img_1.jpg, img_2.jpg, etc.)
        const numA = parseInt(a.match(/\d+/)?.[0] || '0');
        const numB = parseInt(b.match(/\d+/)?.[0] || '0');
        return numA - numB;
      })
      .map(file => `/events/${eventFolder}/${file}`);
  } catch (error) {
    console.error(`Error reading event folder ${eventFolder}:`, error);
    return [];
  }
}

/**
 * Get all events from the events directory
 */
export function getEvents(): Event[] {
  const eventsDir = path.join(process.cwd(), 'public', 'events');

  try {
    if (!fs.existsSync(eventsDir)) {
      return [];
    }

    const folders = fs.readdirSync(eventsDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    const events: Event[] = [];

    for (const folder of folders) {
      const parsed = parseEventFolder(folder);

      if (!parsed) {
        console.warn(`Could not parse event folder: ${folder}`);
        continue;
      }

      const images = getEventImages(folder);
      const eventId = folder.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      events.push({
        id: eventId,
        name: parsed.name,
        nameEn: getEventName(eventId, 'en'),
        nameFr: getEventName(eventId, 'fr'),
        date: parsed.date.toISOString(),
        displayDate: parsed.date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        folder,
        images,
        totalImages: images.length,
      });
    }

    // Sort by date, most recent first
    return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error getting events:', error);
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
