import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Clear existing data
  await prisma.booking.deleteMany();
  await prisma.space.deleteMany();

  // Create space configurations matching official tariffs (OFFRES_TARIFS_WOTE_SPACE.md)
  // Note: These represent different setups of the same physical room
  const spaces = [
    {
      name: 'Setup S',
      nameEn: 'Setup S (1-10 people)',
      nameFr: 'Configuration S (1-10 personnes)',
      description: 'Room configured for up to 10 people',
      descriptionEn: 'Room configured for up to 10 people',
      descriptionFr: 'Salle configurée pour jusqu\'à 10 personnes',
      capacity: 10,
      pricePerHour: 10,
      pricePerDay: 60,
      amenities: JSON.stringify(['Wi-Fi', 'Projecteur/Écran', 'Whiteboard', 'Café']),
      available: true,
    },
    {
      name: 'Setup M',
      nameEn: 'Setup M (11-25 people)',
      nameFr: 'Configuration M (11-25 personnes)',
      description: 'Room configured for 11-25 people',
      descriptionEn: 'Room configured for 11-25 people',
      descriptionFr: 'Salle configurée pour 11-25 personnes',
      capacity: 25,
      pricePerHour: 15,
      pricePerDay: 90,
      amenities: JSON.stringify(['Wi-Fi', 'Projecteur/Écran', 'Whiteboard', 'Video Conferencing', 'Café']),
      available: true,
    },
    {
      name: 'Setup L',
      nameEn: 'Setup L (26-40 people)',
      nameFr: 'Configuration L (26-40 personnes)',
      description: 'Room configured for 26-40 people',
      descriptionEn: 'Room configured for 26-40 people',
      descriptionFr: 'Salle configurée pour 26-40 personnes',
      capacity: 40,
      pricePerHour: 20,
      pricePerDay: 120,
      amenities: JSON.stringify(['Wi-Fi', 'Projecteur/Écran', 'Whiteboard', 'Video Conferencing', 'Café', 'Sonorisation']),
      available: true,
    },
    {
      name: 'Setup XL',
      nameEn: 'Setup XL (41-60 people)',
      nameFr: 'Configuration XL (41-60 personnes)',
      description: 'Room configured for 41-60 people',
      descriptionEn: 'Room configured for 41-60 people',
      descriptionFr: 'Salle configurée pour 41-60 personnes',
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
