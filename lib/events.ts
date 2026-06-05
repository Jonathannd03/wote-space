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
      en: "Public Speaking Training: Second Edition",
      fr: "Master Class en Art Oratoire : Deuxième Édition",
    },
    "wahdi-training-conference-07-03-2026": {
      en: "WAHDI Training Conference",
      fr: "Conférence de Formation WAHDI",
    },
    'workshop-young-leader-for-an-equal-future-08-03-2026': {
      en: 'Young Leader for an Equal Future',
      fr: 'Jeune Leader pour un Avenir Égal',
    },
    'special-femmes-28-03-2026': {
      en: 'Special Women',
      fr: 'Spécial Femmes',
    },
    'formation-en-marketing-digital-29-04-2026': {
      en: 'Digital Marketing Training',
      fr: 'Formation en Marketing Digital',
    },
    'journee-internationale-du-vivre-ensemble-16-05-2026': {
      en: 'International Day of Living Together in Peace',
      fr: 'Journée Internationale du Vivre Ensemble en Paix',
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
      en: 'On International Women\'s Day, Wote Space hosted the "Young Leader for an Equal Future" workshop, organised by Waza & Act. The session focused on capacity building to combat gender-based violence and implement UN Security Council Resolution 1325 on Women, Peace and Security. Young leaders and community actors explored practical tools for prevention, protection and advocacy, strengthening their role in building lasting peace in the region.',
      fr: 'À l\'occasion de la Journée Internationale des Femmes, Wote Space a accueilli l\'atelier « Jeune Leader pour un Avenir Égal », organisé par Waza & Act. La session était axée sur le renforcement des capacités pour lutter contre les violences basées sur le genre et mettre en œuvre la Résolution 1325 du Conseil de Sécurité des Nations Unies sur les Femmes, la Paix et la Sécurité. De jeunes leaders et acteurs communautaires ont exploré des outils pratiques de prévention, de protection et de plaidoyer, renforçant leur rôle dans la construction d\'une paix durable dans la région.',
    },
    'special-femmes-28-03-2026': {
      en: 'In its mission to host impactful initiatives and foster knowledge sharing within communities, Wote Space had the pleasure of welcoming Session 4 of Wote VirtuSkills Spéciale Femmes 2026, an initiative led by Skill Wote Initiative. After three online sessions, this gathering held on March 28, 2026 at Wote Space marked a special moment: bringing together, in person, women leaders, entrepreneurs and change-makers for an authentic and inspiring dialogue. Moderated by Madame Ines Busime Kasanani, the session brought together Madame Nadine Kasonia (Waza and Act), Madame Godi Chochi (OSPDU), Madame Grace Butseme (Thanks Foundation) and Madame Annette Vivuya (Vivuya Afro). Through the theme "Success Stories: Women Entrepreneurs and Leaders", the speakers shared their own stories, challenges and experiences that shaped their journeys, turning this space into a moment of collective learning and inspiration. For Wote Space, hosting this gathering was a beautiful way to close Women\'s Month, offering a setting where women\'s voices can be heard, celebrated and amplified. By opening its doors to this kind of initiative, Wote Space continues to position itself as a living space of dialogue, innovation and collaboration, contributing to building stronger communities.',
      fr: 'Dans sa mission d\'accueillir des initiatives porteuses d\'impact et de favoriser le partage de connaissances au sein des communautés, Wote Space a eu le plaisir d\'accueillir la Session 4 de Wote VirtuSkills Spéciale Femmes 2026, une initiative portée par Skill Wote Initiative. Après trois sessions organisées en ligne, cette rencontre tenue le 28 mars 2026 à Wote Space a marqué un moment particulier : celui de rassembler, en présentiel, des femmes leaders, entrepreneures et actrices du changement autour d\'un dialogue authentique et inspirant. Modérée par Madame Ines Busime Kasanani, la session a réuni Madame Nadine Kasonia (Waza and Act), Madame Godi Chochi (OSPDU), Madame Grace Butseme (Thanks Foundation) et Madame Annette Vivuya (Vivuya Afro). À travers le thème « Histoires de Réussite : Femmes Entrepreneurs et Leaders », les intervenantes ont partagé leurs propres histoires, leurs défis et les expériences qui ont façonné leurs parcours, transformant cet espace en un moment d\'apprentissage collectif et d\'inspiration. Pour Wote Space, accueillir cette rencontre a représenté une belle manière de clôturer le Mois des Femmes, en offrant un cadre où les voix féminines peuvent être entendues, célébrées et amplifiées. En ouvrant ses portes à ce type d\'initiatives, Wote Space continue de se positionner comme un lieu vivant de dialogue, d\'innovation et de collaboration, contribuant à bâtir des communautés plus fortes.',
    },
    'formation-en-marketing-digital-29-04-2026': {
      en: 'Wote Space welcomed David Bolton, visual artist and content creator based in Goma, specialist in hyperrealistic drawing and storytelling. Over three days (April 28–30, 2026), he led a Digital Marketing & Boosting training where he shared his content creation techniques, boosting tips and a concrete action plan to help participants grow their online visibility.',
      fr: 'Wote Space a accueilli David Bolton, artiste visuel et créateur de contenu basé à Goma, spécialiste du dessin hyperréaliste et du storytelling. Pour cette formation en Marketing Digital & Boosting organisée du 28 au 30 avril 2026, il a partagé ses techniques de création de contenu, ses astuces de boosting et un plan d\'action concret pour propulser la visibilité en ligne des participants.',
    },
    'journee-internationale-du-vivre-ensemble-16-05-2026': {
      en: 'On the International Day of Living Together in Peace, Wote Space brought together community actors, organisations and citizens to celebrate diversity, dialogue and peaceful coexistence. The event featured exchanges on the values of solidarity and mutual respect as foundations for lasting peace in the Great Lakes region.',
      fr: 'À l\'occasion de la Journée Internationale du Vivre Ensemble en Paix, Wote Space a rassemblé des acteurs communautaires, des organisations et des citoyens pour célébrer la diversité, le dialogue et la coexistence pacifique. L\'événement a été marqué par des échanges sur les valeurs de solidarité et de respect mutuel comme fondements d\'une paix durable dans la région des Grands Lacs.',
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
      en: 'Organised by Waza & Act, a capacity-building workshop on combating gender-based violence and implementing Resolution 1325 on Women, Peace and Security, held on International Women\'s Day.',
      fr: 'Organisé par Waza & Act, un atelier de renforcement des capacités sur la lutte contre les violences basées sur le genre et la mise en œuvre de la Résolution 1325 sur les Femmes, la Paix et la Sécurité, tenu à l\'occasion de la Journée Internationale des Femmes.',
    },
    'special-femmes-28-03-2026': {
      en: 'Session 4 of Wote VirtuSkills Spéciale Femmes 2026 by Skill Wote Initiative, where women leaders, entrepreneurs and change-makers gathered in person around the theme "Success Stories: Women Entrepreneurs and Leaders", moderated by Ines Busime Kasanani.',
      fr: 'Session 4 de Wote VirtuSkills Spéciale Femmes 2026 par Skill Wote Initiative, où des femmes leaders, entrepreneures et actrices du changement se sont réunies en présentiel autour du thème « Histoires de Réussite : Femmes Entrepreneurs et Leaders », modérée par Ines Busime Kasanani.',
    },
    'formation-en-marketing-digital-29-04-2026': {
      en: 'A Digital Marketing & Boosting training led by David Bolton, visual artist and content creator based in Goma, sharing practical techniques to boost online visibility. April 28–30, 2026.',
      fr: 'Une formation en Marketing Digital & Boosting animée par David Bolton, artiste visuel et créateur de contenu basé à Goma, partageant des techniques pratiques pour propulser la visibilité en ligne. 28–30 avril 2026.',
    },
    'journee-internationale-du-vivre-ensemble-16-05-2026': {
      en: 'A gathering celebrating diversity, dialogue and peaceful coexistence on the International Day of Living Together in Peace, with exchanges on solidarity and mutual respect.',
      fr: 'Un rassemblement célébrant la diversité, le dialogue et la coexistence pacifique à l\'occasion de la Journée Internationale du Vivre Ensemble, avec des échanges sur la solidarité et le respect mutuel.',
    },
  };

  return shortDescriptions[eventId]?.[locale] || (locale === 'fr'
    ? 'Un événement qui s\'est tenu à Wote Space.'
    : 'An event that took place at Wote Space.');
}
