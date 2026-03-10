// Mock data for space setups - used when database is not available
// Pricing uses fixed time slots instead of open-ended hourly billing:
//   - Half-day (morning 8:00-12:00 OR afternoon 13:00-17:30)
//   - Full day  (8:00-17:30)
//   - Bundle of 5 sessions  (half-day or full-day, dates arranged by phone)
//   - Bundle of 10 sessions

export const MOCK_SPACES = [
  {
    id: 'mock-1',
    name: 'Setup S',
    nameEn: 'Setup S (1–10 people)',
    nameFr: 'Configuration S (1–10 personnes)',
    description: 'Room configured for up to 10 people',
    descriptionEn: 'Room configured for up to 10 people',
    descriptionFr: "Salle configurée pour jusqu'à 10 personnes",
    capacity: 10,
    priceHalfDay: 30,
    priceFullDay: 60,
    priceBundle5: 125,
    priceBundle10: 225,
    amenities: '["Wi-Fi", "Projecteur/Écran", "Whiteboard"]',
    imageUrl: null,
    available: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'mock-2',
    name: 'Setup M',
    nameEn: 'Setup M (11–25 people)',
    nameFr: 'Configuration M (11–25 personnes)',
    description: 'Room configured for 11-25 people',
    descriptionEn: 'Room configured for 11-25 people',
    descriptionFr: 'Salle configurée pour 11–25 personnes',
    capacity: 25,
    priceHalfDay: 45,
    priceFullDay: 90,
    priceBundle5: 185,
    priceBundle10: 335,
    amenities: '["Wi-Fi", "Projecteur/Écran", "Whiteboard", "Video Conferencing"]',
    imageUrl: null,
    available: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'mock-3',
    name: 'Setup L',
    nameEn: 'Setup L (26–40 people)',
    nameFr: 'Configuration L (26–40 personnes)',
    description: 'Room configured for 26-40 people',
    descriptionEn: 'Room configured for 26-40 people',
    descriptionFr: 'Salle configurée pour 26–40 personnes',
    capacity: 40,
    priceHalfDay: 60,
    priceFullDay: 120,
    priceBundle5: 250,
    priceBundle10: 450,
    amenities: '["Wi-Fi", "Projecteur/Écran", "Whiteboard", "Video Conferencing", "Sonorisation"]',
    imageUrl: null,
    available: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'mock-4',
    name: 'Setup XL',
    nameEn: 'Setup XL (41–60 people)',
    nameFr: 'Configuration XL (41–60 personnes)',
    description: 'Room configured for 41-60 people',
    descriptionEn: 'Room configured for 41-60 people',
    descriptionFr: 'Salle configurée pour 41–60 personnes',
    capacity: 60,
    priceHalfDay: 80,
    priceFullDay: 160,
    priceBundle5: 330,
    priceBundle10: 600,
    amenities: '["Wi-Fi Premium", "Projecteur/Écran", "Whiteboard", "Video Conferencing", "Sonorisation", "Assistance Technique"]',
    imageUrl: null,
    available: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'mock-5',
    name: 'Co-working Space',
    nameEn: 'Co-working Space',
    nameFr: 'Espace de Coworking',
    description: 'Shared co-working space with daily access',
    descriptionEn: 'Shared co-working space with daily access',
    descriptionFr: 'Espace de coworking partagé avec accès journalier',
    capacity: 1,
    priceHalfDay: 1.5,
    priceFullDay: 3,
    priceBundle5: 12.5,
    priceBundle10: 22.5,
    amenities: '["Wi-Fi", "Mobilier & espaces communs"]',
    imageUrl: null,
    available: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export type MockSpace = typeof MOCK_SPACES[0];

// Fixed time slot definitions
export const SLOTS = {
  morning:   { startTime: '08:00', endTime: '12:00', labelFr: 'Matinée',          labelEn: 'Morning',         timeFr: '8h00 – 12h00',    timeEn: '8:00 – 12:00'   },
  afternoon: { startTime: '13:00', endTime: '17:30', labelFr: 'Après-midi',       labelEn: 'Afternoon',       timeFr: '13h00 – 17h30',   timeEn: '1:00 – 5:30 PM' },
  fullday:   { startTime: '08:00', endTime: '17:30', labelFr: 'Journée complète', labelEn: 'Full Day',        timeFr: '8h00 – 17h30',    timeEn: '8:00 – 5:30 PM' },
  bundle5:   { startTime: null,    endTime: null,    labelFr: 'Pack 5 séances',   labelEn: '5-Session Pack',  timeFr: '5 demi-journées', timeEn: '5 half-days'    },
  bundle10:  { startTime: null,    endTime: null,    labelFr: 'Pack 10 séances',  labelEn: '10-Session Pack', timeFr: '10 demi-journées', timeEn: '10 half-days'  },
} as const;

export type SlotKey = keyof typeof SLOTS;

// Coworking-specific extended packages (weekly / monthly)
// Based on pricing curve: full day $3 → weekly 5d $12 ($2.40/d) → monthly ~20d $40 ($2.00/d)
export const COWORKING_PACKAGES = {
  weekly:  { priceFr: '12 $', priceEn: '$12', perDayFr: '2,40 $ / jour', perDayEn: '$2.40 / day', days: 5  },
  monthly: { priceFr: '40 $', priceEn: '$40', perDayFr: '2,00 $ / jour', perDayEn: '$2.00 / day', days: 20 },
} as const;
