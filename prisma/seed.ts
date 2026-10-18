import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clear in FK-safe order
  await prisma.booking.deleteMany();
  await prisma.space.deleteMany();
  await prisma.partner.deleteMany();
  await prisma.contactInfo.deleteMany();

  // Spaces — pricing matches official tariff sheet
  const spaces = [
    {
      name: 'Setup S',
      nameEn: 'Setup S (1–10 people)',
      nameFr: 'Configuration S (1–10 personnes)',
      description: 'Room configured for up to 10 people',
      descriptionEn: 'Room configured for up to 10 people',
      descriptionFr: "Salle configurée pour jusqu'à 10 personnes",
      capacity: 10,
      pricePerHour: 0,
      pricePerDay: 60,
      priceHalfDay: 30,
      priceBundle5: 125,
      priceBundle10: 225,
      amenities: '["Wi-Fi", "Projecteur/Écran", "Whiteboard"]',
      available: true,
    },
    {
      name: 'Setup M',
      nameEn: 'Setup M (11–25 people)',
      nameFr: 'Configuration M (11–25 personnes)',
      description: 'Room configured for 11-25 people',
      descriptionEn: 'Room configured for 11-25 people',
      descriptionFr: 'Salle configurée pour 11–25 personnes',
      capacity: 25,
      pricePerHour: 0,
      pricePerDay: 90,
      priceHalfDay: 45,
      priceBundle5: 185,
      priceBundle10: 335,
      amenities: '["Wi-Fi", "Projecteur/Écran", "Whiteboard", "Video Conferencing"]',
      available: true,
    },
    {
      name: 'Setup L',
      nameEn: 'Setup L (26–40 people)',
      nameFr: 'Configuration L (26–40 personnes)',
      description: 'Room configured for 26-40 people',
      descriptionEn: 'Room configured for 26-40 people',
      descriptionFr: 'Salle configurée pour 26–40 personnes',
      capacity: 40,
      pricePerHour: 0,
      pricePerDay: 120,
      priceHalfDay: 60,
      priceBundle5: 250,
      priceBundle10: 450,
      amenities: '["Wi-Fi", "Projecteur/Écran", "Whiteboard", "Video Conferencing"]',
      available: true,
    },
    {
      name: 'Setup XL',
      nameEn: 'Setup XL (41–60 people)',
      nameFr: 'Configuration XL (41–60 personnes)',
      description: 'Room configured for 41-60 people',
      descriptionEn: 'Room configured for 41-60 people',
      descriptionFr: 'Salle configurée pour 41–60 personnes',
      capacity: 60,
      pricePerHour: 0,
      pricePerDay: 160,
      priceHalfDay: 80,
      priceBundle5: 330,
      priceBundle10: 600,
      amenities: '["Wi-Fi Premium", "Projecteur/Écran", "Whiteboard", "Video Conferencing", "Assistance Technique"]',
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
      pricePerHour: 0,
      pricePerDay: 5,
      priceHalfDay: 2.5,
      priceBundle5: 20,
      priceBundle10: 35,
      amenities: '["Wi-Fi", "Mobilier & espaces communs"]',
      available: true,
    },
  ];

  for (const space of spaces) {
    await prisma.space.create({ data: space });
  }
  console.log(`Created ${spaces.length} spaces`);

  // Partners
  const partners = [
    { name: 'WAHDI – Women in Action for Human Dignity', logoUrl: '/partners/wahdi women in Action for Human Dignity.png', order: 0 },
    { name: 'Tumaini Jipya', logoUrl: '/partners/TumainiJipya-02.png', order: 1 },
    { name: 'Waza & Act', logoUrl: '/partners/waza-and-act.png', order: 2 },
    { name: 'Skills Wote', logoUrl: '/partners/skills wote.png', order: 3 },
    { name: 'Centre for Development and Enterprises', logoUrl: '/partners/Centre for development and entreprises.jpg', order: 4 },
    { name: 'Mixes From Africa', logoUrl: '/partners/294516757_423127039830058_7206967330386121846_n (1).jpg.jpeg', order: 5 },
  ];

  for (const partner of partners) {
    await prisma.partner.create({ data: partner });
  }
  console.log(`Created ${partners.length} partners`);

  // Contact info
  const contactFields = [
    { key: 'phone', value: '+243 980 244 431' },
    { key: 'email', value: 'info@wote-space.com' },
    { key: 'addressFr', value: '112, Boulevard Julien Paluku, Karisimbi\nQuartier Murara, Goma - Nord-Kivu, RDC' },
    { key: 'addressEn', value: '112, Boulevard Julien Paluku, Karisimbi\nMurara Neighborhood, Goma - North Kivu, DRC' },
  ];

  for (const c of contactFields) {
    await prisma.contactInfo.create({ data: c });
  }
  console.log(`Created ${contactFields.length} contact info entries`);

  console.log('Done.');
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
