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
    "opening-ceremony-25-01-2026": {
      en: "Opening Ceremony",
      fr: "Cérémonie d'Ouverture",
    },
    "public-speaking-training-16-01-2026": {
      en: "Public Speaking Training",
      fr: "Master Class en Art Oratoire",
    },
    "great-lakes-graphic-designers-exhibition-23-02-2026": {
      en: "Great Lakes Graphic Designers Exhibition",
      fr: "Salon des Graphistes des Grands Lacs",
    },
    "public-speaking-training-second-edition-06-03-2026": {
      en: "Public Speaking Training — Second Edition",
      fr: "Master Class en Art Oratoire — Deuxième Édition",
    },
    "wahdi-training-conference-07-03-2026": {
      en: "WAHDI Training Conference",
      fr: "Conférence de Formation WAHDI",
    },
    'workshop-young-leader-for-an-equal-future-08-03-2026': {
      en: 'Young Leader for an Equal Future',
      fr: 'Jeune Leader pour un Avenir Égal',
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
    "opening-ceremony-25-01-2026": {
      en: "We celebrated the grand opening of Wote Space, marking the launch of a humanitarian coordination space in the heart of Goma. Organisations, associations and community actors gathered to discover the space and share their vision for collective action.",
      fr: "Nous avons célébré l'ouverture de Wote Space, marquant le lancement d'un espace de coordination humanitaire au cœur de Goma. Organisations, associations et acteurs communautaires se sont réunis pour découvrir le lieu et partager leur vision d'une action collective.",
    },
    "public-speaking-training-16-01-2026": {
      en: "An intensive workshop to help participants strengthen their public speaking and advocacy skills. Attendees learned techniques to captivate audiences, deliver powerful messages and represent their organisations with confidence.",
      fr: "Un atelier intensif pour aider les participants à renforcer leurs compétences en prise de parole et en plaidoyer. Les participants ont appris à captiver leur public, délivrer des messages percutants et représenter leur organisation avec assurance.",
    },
    "great-lakes-graphic-designers-exhibition-23-02-2026": {
      en: "Wote Space hosted the Great Lakes Graphic Designers Exhibition, bringing together talented visual artists and designers from across the region. The exhibition showcased creative work at the crossroads of art, identity and social impact.",
      fr: "Wote Space a accueilli le Salon des Graphistes des Grands Lacs, rassemblant des artistes visuels et designers talentueux de toute la région. Le\ salon a mis en valeur des créations à la croisée de l'art, de l'identité et de l'impact social.",
    },
    "public-speaking-training-second-edition-06-03-2026": {
      en: "Following the success of the first edition, the Public Speaking Training returned for a second session. Participants deepened their skills in communication, storytelling and advocacy, with a focus on representing their communities effectively.",
      fr: "Suite au succès de la première édition, la Master Class en Art Oratoire est revenue pour une deuxième session. Les participants ont approfondi leurs compétences en communication, narration et plaidoyer, avec un accent sur la représentation efficace de leurs communautés.",
    },
    "wahdi-training-conference-07-03-2026": {
      en: "Wote Space hosted a training workshop organised by WAHDI, Women in Action for Human Dignity, focused on monitoring, analysing and understanding security issues and violence linked to the climate crisis. Participants developed practical tools to better grasp the links between environmental degradation and conflict, and to strengthen their advocacy and protection responses.",
      fr: "Wote Space a accueilli un atelier de formation organisé par WAHDI, Femmes en Action pour la Dignité Humaine, axé sur le suivi, l'analyse et la compréhension des questions de sécurité et des violences liées à la crise climatique. Les participants ont développé des outils pratiques pour mieux saisir les liens entre dégradation environnementale et conflits, et renforcer leurs réponses en matière de plaidoyer et de protection.",
    },
    'workshop-young-leader-for-an-equal-future-08-03-2026': {
      en: 'On International Women\'s Day, Wote Space hosted the "Young Leader for an Equal Future" workshop — a capacity-building session focused on combating gender-based violence and implementing UN Security Council Resolution 1325 on Women, Peace and Security. Young leaders and community actors explored practical tools for prevention, protection and advocacy, strengthening their role in building lasting peace in the region.',
      fr: 'À l\'occasion de la Journée Internationale des Femmes, Wote Space a accueilli l\'atelier « Jeune Leader pour un Avenir Égal » — une session de renforcement des capacités axée sur la lutte contre les violences basées sur le genre et la mise en œuvre de la Résolution 1325 du Conseil de Sécurité des Nations Unies sur les Femmes, la Paix et la Sécurité. De jeunes leaders et acteurs communautaires ont exploré des outils pratiques de prévention, de protection et de plaidoyer, renforçant leur rôle dans la construction d\'une paix durable dans la région.',
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
    "opening-ceremony-25-01-2026": {
      en: "The launch of Wote Space as a humanitarian coordination hub in Goma, bringing together organisations and community actors.",
      fr: "Le lancement de Wote Space comme espace de coordination humanitaire à Goma, réunissant organisations et acteurs communautaires.",
    },
    "public-speaking-training-16-01-2026": {
      en: "An intensive workshop to strengthen public speaking and advocacy skills for humanitarian and community actors.",
      fr: "Un atelier intensif pour renforcer les compétences en prise de parole et en plaidoyer des acteurs humanitaires et communautaires.",
    },
    "great-lakes-graphic-designers-exhibition-23-02-2026": {
      en: "An exhibition showcasing the creative work of graphic designers from across the Great Lakes region.",
      fr: "Un Salon mettant en valeur le travail créatif des graphistes de la région des Grands Lacs.",
    },
    "public-speaking-training-second-edition-06-03-2026": {
      en: "The second edition of our public speaking training, focused on advocacy and community representation.",
      fr: "La deuxième édition de notre formation en art oratoire, axée sur le plaidoyer et la représentation communautaire.",
    },
    "wahdi-training-conference-07-03-2026": {
      en: "A WAHDI training workshop on monitoring and understanding security issues and violence linked to the climate crisis, with practical tools for advocacy and protection.",
      fr: "Un atelier de formation WAHDI sur le suivi et la compréhension des questions de sécurité et des violences liées à la crise climatique, avec des outils pratiques pour le plaidoyer et la protection.",
    },
    'workshop-young-leader-for-an-equal-future-08-03-2026': {
      en: 'A capacity-building workshop on combating gender-based violence and implementing Resolution 1325 on Women, Peace and Security, held on International Women\'s Day.',
      fr: 'Un atelier de renforcement des capacités sur la lutte contre les violences basées sur le genre et la mise en œuvre de la Résolution 1325 sur les Femmes, la Paix et la Sécurité, tenu à l\'occasion de la Journée Internationale des Femmes.',
    },
  };

  return shortDescriptions[eventId]?.[locale] || (locale === 'fr'
    ? 'Un événement qui s\'est tenu à Wote Space.'
    : 'An event that took place at Wote Space.');
}
