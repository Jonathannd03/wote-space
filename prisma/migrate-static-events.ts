/**
 * One-time migration: inserts all static filesystem events into Neon so the
 * admin panel and public site can both use the database as the single source
 * of truth.
 *
 * Run with:
 *   export $(grep -E "^(DATABASE_URL|DATABASE_URL_UNPOOLED)=" .env.local | xargs)
 *   npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/migrate-static-events.ts
 */

import { PrismaClient } from '@prisma/client';
import eventsManifest from '../public/events-manifest.json';

const prisma = new PrismaClient();

interface ManifestEntry {
  folder: string;
  name: string;
  year: number;
  month: number;
  day: number;
  imageCount: number;
  imageFiles: string[];
}

// All copy from lib/events.ts — kept inline so the script is self-contained
const NAMES: Record<string, { en: string; fr: string }> = {
  'opening-ceremony-25-01-2026': { en: 'Opening Ceremony', fr: "Cérémonie d'Ouverture" },
  'public-speaking-training-16-01-2026': { en: 'Public Speaking Training', fr: 'Master Class en Art Oratoire' },
  'great-lakes-graphic-designers-exhibition-23-02-2026': { en: 'Great Lakes Graphic Designers Exhibition', fr: 'Salon des Graphistes des Grands Lacs' },
  'public-speaking-training-second-edition-06-03-2026': { en: 'Public Speaking Training: Second Edition', fr: 'Master Class en Art Oratoire : Deuxième Édition' },
  'wahdi-training-conference-07-03-2026': { en: 'WAHDI Training Conference', fr: 'Conférence de Formation WAHDI' },
  'workshop-young-leader-for-an-equal-future-08-03-2026': { en: 'Young Leader for an Equal Future', fr: 'Jeune Leader pour un Avenir Égal' },
  'special-femmes-28-03-2026': { en: 'Special Women', fr: 'Spécial Femmes' },
  'formation-en-marketing-digital-29-04-2026': { en: 'Digital Marketing Training', fr: 'Formation en Marketing Digital' },
  'journee-internationale-du-vivre-ensemble-16-05-2026': { en: 'International Day of Living Together in Peace', fr: 'Journée Internationale du Vivre Ensemble en Paix' },
};

const DESCRIPTIONS: Record<string, { en: string; fr: string }> = {
  'opening-ceremony-25-01-2026': {
    en: 'We celebrated the grand opening of Wote Space, marking the launch of a humanitarian coordination space in the heart of Goma. Organisations, associations and community actors gathered to discover the space and share their vision for collective action.',
    fr: "Nous avons célébré l'ouverture de Wote Space, marquant le lancement d'un espace de coordination humanitaire au cœur de Goma. Organisations, associations et acteurs communautaires se sont réunis pour découvrir le lieu et partager leur vision d'une action collective.",
  },
  'public-speaking-training-16-01-2026': {
    en: 'An intensive workshop to help participants strengthen their public speaking and advocacy skills. Attendees learned techniques to captivate audiences, deliver powerful messages and represent their organisations with confidence.',
    fr: "Un atelier intensif pour aider les participants à renforcer leurs compétences en prise de parole et en plaidoyer. Les participants ont appris à captiver leur public, délivrer des messages percutants et représenter leur organisation avec assurance.",
  },
  'great-lakes-graphic-designers-exhibition-23-02-2026': {
    en: 'Wote Space hosted the Great Lakes Graphic Designers Exhibition, bringing together talented visual artists and designers from across the region. The exhibition showcased creative work at the crossroads of art, identity and social impact.',
    fr: "Wote Space a accueilli le Salon des Graphistes des Grands Lacs, rassemblant des artistes visuels et designers talentueux de toute la région. Le salon a mis en valeur des créations à la croisée de l'art, de l'identité et de l'impact social.",
  },
  'public-speaking-training-second-edition-06-03-2026': {
    en: 'Following the success of the first edition, the Public Speaking Training returned for a second session. Participants deepened their skills in communication, storytelling and advocacy, with a focus on representing their communities effectively.',
    fr: "Suite au succès de la première édition, la Master Class en Art Oratoire est revenue pour une deuxième session. Les participants ont approfondi leurs compétences en communication, narration et plaidoyer, avec un accent sur la représentation efficace de leurs communautés.",
  },
  'wahdi-training-conference-07-03-2026': {
    en: 'Wote Space hosted a training workshop organised by WAHDI, Women in Action for Human Dignity, focused on monitoring, analysing and understanding security issues and violence linked to the climate crisis. Participants developed practical tools to better grasp the links between environmental degradation and conflict, and to strengthen their advocacy and protection responses.',
    fr: "Wote Space a accueilli un atelier de formation organisé par WAHDI, Femmes en Action pour la Dignité Humaine, axé sur le suivi, l'analyse et la compréhension des questions de sécurité et des violences liées à la crise climatique. Les participants ont développé des outils pratiques pour mieux saisir les liens entre dégradation environnementale et conflits, et renforcer leurs réponses en matière de plaidoyer et de protection.",
  },
  'workshop-young-leader-for-an-equal-future-08-03-2026': {
    en: 'On International Women\'s Day, Wote Space hosted the "Young Leader for an Equal Future" workshop, organised by Waza & Act. The session focused on capacity building to combat gender-based violence and implement UN Security Council Resolution 1325 on Women, Peace and Security.',
    fr: "À l'occasion de la Journée Internationale des Femmes, Wote Space a accueilli l'atelier « Jeune Leader pour un Avenir Égal », organisé par Waza & Act. La session était axée sur le renforcement des capacités pour lutter contre les violences basées sur le genre et mettre en œuvre la Résolution 1325 du Conseil de Sécurité des Nations Unies.",
  },
  'special-femmes-28-03-2026': {
    en: 'Session 4 of Wote VirtuSkills Spéciale Femmes 2026 by Skill Wote Initiative, where women leaders, entrepreneurs and change-makers gathered in person around the theme "Success Stories: Women Entrepreneurs and Leaders".',
    fr: "Session 4 de Wote VirtuSkills Spéciale Femmes 2026 par Skill Wote Initiative, où des femmes leaders, entrepreneures et actrices du changement se sont réunies en présentiel autour du thème « Histoires de Réussite : Femmes Entrepreneurs et Leaders ».",
  },
  'formation-en-marketing-digital-29-04-2026': {
    en: 'Wote Space welcomed David Bolton, visual artist and content creator based in Goma, who led a Digital Marketing & Boosting training sharing practical techniques to boost online visibility. April 28–30, 2026.',
    fr: "Wote Space a accueilli David Bolton, artiste visuel et créateur de contenu basé à Goma, qui a animé une formation en Marketing Digital & Boosting partageant des techniques pratiques pour propulser la visibilité en ligne. 28–30 avril 2026.",
  },
  'journee-internationale-du-vivre-ensemble-16-05-2026': {
    en: 'On the International Day of Living Together in Peace, Wote Space brought together community actors, organisations and citizens to celebrate diversity, dialogue and peaceful coexistence in the Great Lakes region.',
    fr: "À l'occasion de la Journée Internationale du Vivre Ensemble en Paix, Wote Space a rassemblé des acteurs communautaires, des organisations et des citoyens pour célébrer la diversité, le dialogue et la coexistence pacifique dans la région des Grands Lacs.",
  },
};

const SHORT_DESCS: Record<string, { en: string; fr: string }> = {
  'opening-ceremony-25-01-2026': {
    en: 'The launch of Wote Space as a humanitarian coordination hub in Goma, bringing together organisations and community actors.',
    fr: 'Le lancement de Wote Space comme espace de coordination humanitaire à Goma, réunissant organisations et acteurs communautaires.',
  },
  'public-speaking-training-16-01-2026': {
    en: 'An intensive workshop to strengthen public speaking and advocacy skills for humanitarian and community actors.',
    fr: 'Un atelier intensif pour renforcer les compétences en prise de parole et en plaidoyer des acteurs humanitaires et communautaires.',
  },
  'great-lakes-graphic-designers-exhibition-23-02-2026': {
    en: 'An exhibition showcasing the creative work of graphic designers from across the Great Lakes region.',
    fr: 'Un Salon mettant en valeur le travail créatif des graphistes de la région des Grands Lacs.',
  },
  'public-speaking-training-second-edition-06-03-2026': {
    en: 'The second edition of our public speaking training, focused on advocacy and community representation.',
    fr: 'La deuxième édition de notre formation en art oratoire, axée sur le plaidoyer et la représentation communautaire.',
  },
  'wahdi-training-conference-07-03-2026': {
    en: 'A WAHDI training workshop on monitoring security issues and violence linked to the climate crisis, with practical tools for advocacy and protection.',
    fr: 'Un atelier de formation WAHDI sur le suivi des questions de sécurité et des violences liées à la crise climatique, avec des outils pratiques de plaidoyer.',
  },
  'workshop-young-leader-for-an-equal-future-08-03-2026': {
    en: 'Organised by Waza & Act on International Women\'s Day, a capacity-building workshop on combating gender-based violence and implementing Resolution 1325.',
    fr: "Organisé par Waza & Act à l'occasion de la Journée Internationale des Femmes, un atelier sur la lutte contre les violences basées sur le genre et la Résolution 1325.",
  },
  'special-femmes-28-03-2026': {
    en: 'Session 4 of Wote VirtuSkills Spéciale Femmes 2026 by Skill Wote Initiative, moderated by Ines Busime Kasanani.',
    fr: 'Session 4 de Wote VirtuSkills Spéciale Femmes 2026 par Skill Wote Initiative, modérée par Ines Busime Kasanani.',
  },
  'formation-en-marketing-digital-29-04-2026': {
    en: 'A Digital Marketing & Boosting training led by David Bolton, sharing practical techniques to boost online visibility.',
    fr: 'Une formation en Marketing Digital & Boosting animée par David Bolton, partageant des techniques pratiques pour propulser la visibilité en ligne.',
  },
  'journee-internationale-du-vivre-ensemble-16-05-2026': {
    en: 'A gathering celebrating diversity, dialogue and peaceful coexistence on the International Day of Living Together in Peace.',
    fr: 'Un rassemblement célébrant la diversité, le dialogue et la coexistence pacifique à la Journée Internationale du Vivre Ensemble.',
  },
};

async function main() {
  const manifest = eventsManifest as { events: ManifestEntry[] };

  console.log(`Migrating ${manifest.events.length} static events to Neon...`);

  for (const entry of manifest.events) {
    const slug = entry.folder.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const date = new Date(entry.year, entry.month - 1, entry.day);

    const names = NAMES[slug] ?? { en: slug.replace(/-/g, ' '), fr: slug.replace(/-/g, ' ') };
    const descs = DESCRIPTIONS[slug] ?? { en: '', fr: '' };
    const shorts = SHORT_DESCS[slug] ?? { en: descs.en.slice(0, 200), fr: descs.fr.slice(0, 200) };

    // Skip if already exists
    const existing = await prisma.eventEntry.findUnique({ where: { id: slug } });
    if (existing) {
      console.log(`  skip (already exists): ${slug}`);
      continue;
    }

    await prisma.eventEntry.create({
      data: {
        id: slug,  // use slug as ID to preserve existing public URLs
        nameFr: names.fr,
        nameEn: names.en,
        date,
        descriptionFr: descs.fr,
        descriptionEn: descs.en,
        shortDescFr: shorts.fr,
        shortDescEn: shorts.en,
        images: {
          create: entry.imageFiles.map((file, i) => ({
            url: `/events/${entry.folder}/${file}`,
            order: i,
          })),
        },
      },
    });

    console.log(`  ✓ ${slug} (${entry.imageCount} images)`);
  }

  console.log('Done.');
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
