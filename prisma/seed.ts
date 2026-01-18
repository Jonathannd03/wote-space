import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Clear existing data
  await prisma.booking.deleteMany();
  await prisma.space.deleteMany();

  // Create spaces matching official tariffs (OFFRES_TARIFS_WOTE_SPACE.md)
  const spaces = [
    {
      name: 'Meeting Room S',
      nameEn: 'Meeting Room S (1-10 people)',
      nameFr: 'Salle de Réunion S (1-10 personnes)',
      description: 'Small meeting room for up to 10 people',
      descriptionEn: 'Small meeting room for up to 10 people',
      descriptionFr: 'Petite salle de réunion jusqu\'à 10 personnes',
      capacity: 10,
      pricePerHour: 10,
      pricePerDay: 60,
      amenities: JSON.stringify(['Wi-Fi', 'Projecteur/Écran', 'Whiteboard', 'Café']),
      available: true,
    },
    {
      name: 'Meeting Room M',
      nameEn: 'Meeting Room M (11-25 people)',
      nameFr: 'Salle de Réunion M (11-25 personnes)',
      description: 'Medium meeting room for 11-25 people',
      descriptionEn: 'Medium meeting room for 11-25 people',
      descriptionFr: 'Salle de réunion moyenne pour 11-25 personnes',
      capacity: 25,
      pricePerHour: 15,
      pricePerDay: 90,
      amenities: JSON.stringify(['Wi-Fi', 'Projecteur/Écran', 'Whiteboard', 'Video Conferencing', 'Café']),
      available: true,
    },
    {
      name: 'Meeting Room L',
      nameEn: 'Meeting Room L (26-40 people)',
      nameFr: 'Salle de Réunion L (26-40 personnes)',
      description: 'Large meeting room for 26-40 people',
      descriptionEn: 'Large meeting room for 26-40 people',
      descriptionFr: 'Grande salle de réunion pour 26-40 personnes',
      capacity: 40,
      pricePerHour: 20,
      pricePerDay: 120,
      amenities: JSON.stringify(['Wi-Fi', 'Projecteur/Écran', 'Whiteboard', 'Video Conferencing', 'Café', 'Sonorisation']),
      available: true,
    },
    {
      name: 'Meeting Room XL',
      nameEn: 'Meeting Room XL (41-60 people)',
      nameFr: 'Salle de Réunion XL (41-60 personnes)',
      description: 'Extra large meeting room for 41-60 people',
      descriptionEn: 'Extra large meeting room for 41-60 people',
      descriptionFr: 'Très grande salle de réunion pour 41-60 personnes',
      capacity: 60,
      pricePerHour: 25,
      pricePerDay: 160,
      amenities: JSON.stringify(['Wi-Fi Premium', 'Projecteur/Écran', 'Whiteboard', 'Video Conferencing', 'Café', 'Sonorisation', 'Assistance Technique']),
      available: true,
    },
    {
      name: 'Co-working Space',
      nameEn: 'Co-working Space',
      nameFr: 'Espace de Coworking',
      description: 'Shared co-working space with daily access',
      descriptionEn: 'Shared co-working space with daily access',
      descriptionFr: 'Espace de coworking partagé avec accès journalier',
      capacity: 1,
      pricePerHour: 0.5,
      pricePerDay: 3,
      amenities: JSON.stringify(['Wi-Fi', 'Mobilier & espaces communs', 'Café']),
      available: true,
    },
  ];

  for (const space of spaces) {
    await prisma.space.create({
      data: space,
    });
  }

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
