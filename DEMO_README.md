# Wote Space - Demo Mode 🎨

This version is configured to run **without requiring any environment variables or database setup**. Perfect for getting feedback on the design, user experience, and functionality before setting up the production database.

## What Works in Demo Mode ✅

### Fully Functional Pages:
- **Home Page** (`/` or `/fr`, `/en`) - Complete hero section, features, gallery
- **Spaces Page** (`/fr/spaces`, `/en/spaces`) - Shows all 5 meeting rooms with:
  - Official pricing from OFFRES_TARIFS_WOTE_SPACE.md
  - Photo gallery with all premises images
  - Capacity information
  - Amenities for each space
- **Pricing Page** (`/fr/pricing`, `/en/pricing`) - Complete pricing tables
- **About Page** (`/fr/about`, `/en/about`) - Company information
- **Contact Page** (`/fr/contact`, `/en/contact`) - Contact form (preview mode)
- **Booking Page** (`/fr/booking`, `/en/booking`) - **Full booking flow!**

### Booking System Features (Demo):
- ✅ Multi-step wizard interface
- ✅ Visual space selection
- ✅ Date and time selection with validation
- ✅ Quick duration presets (2 hours, 4 hours, Full day, 2 days)
- ✅ Real-time price calculation
- ✅ Capacity validation
- ✅ Customer information form
- ✅ Generates unique booking reference ID
- ✅ Success confirmation with reference number

### What's Different in Demo Mode:
- **Bookings are not saved** - They're validated and a reference ID is generated, but not stored
- **No email confirmation** - In production, an automated email would be sent
- **No database queries** - Uses static mock data for the 5 spaces
- **No availability checking** - In production, prevents double-booking

## The 5 Spaces Available:

1. **Meeting Room S** (1-10 people)
   - $10/hour or $60/day
   - Wi-Fi, Projector/Screen, Whiteboard, Coffee

2. **Meeting Room M** (11-25 people)
   - $15/hour or $90/day
   - Wi-Fi, Projector/Screen, Whiteboard, Video Conferencing, Coffee

3. **Meeting Room L** (26-40 people)
   - $20/hour or $120/day
   - Wi-Fi, Projector/Screen, Whiteboard, Video Conferencing, Coffee, Sound System

4. **Meeting Room XL** (41-60 people)
   - $25/hour or $160/day
   - Premium Wi-Fi, Projector/Screen, Whiteboard, Video Conferencing, Coffee, Sound System, Technical Support

5. **Co-working Space** (1 person)
   - $0.50/hour or $3/day
   - Wi-Fi, Furniture & common areas, Coffee

## Try It Out! 🚀

### Local Development:
```bash
npm install
npm run dev
```

Then visit: **http://localhost:3000/fr**

### Test the Booking Flow:
1. Go to `/fr/booking`
2. Select a space (Meeting Room M, for example)
3. Choose a date and time (or use quick presets)
4. Add customer details
5. Submit and get a booking reference!

The system will:
- Calculate the price based on hours/days
- Validate capacity
- Generate a unique reference ID (e.g., `WS-20260119-A7B3C9`)
- Show success confirmation

## Deploy to Vercel (No Setup Needed!) 🌐

This version deploys **without requiring any environment variables**:

```bash
# Push to GitHub
git add .
git commit -m "Demo version ready"
git push origin main

# Deploy to Vercel
# Just connect your GitHub repo - no env vars needed!
```

Your site will be live and fully functional for feedback and testing.

## Internationalization (i18n) 🌍

The site supports French and English:
- French (default): `/fr/spaces`, `/fr/booking`, etc.
- English: `/en/spaces`, `/en/booking`, etc.

Language switcher is in the navigation menu.

## What's Next? (Production Setup)

When you're ready to enable the full production features:

### 1. Set Up Database
Follow **DATABASE_SETUP.md** to:
- Create PostgreSQL database (Vercel Postgres recommended)
- Run migrations to create tables
- Seed with the 5 spaces

### 2. Add Environment Variables
```env
DATABASE_URL="postgresql://..."
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="noreply@wote-space.com"
NEXT_PUBLIC_APP_URL="https://wote-space.vercel.app"
ADMIN_EMAIL="info@wote-space.com"
```

### 3. Enable Production Features
The code is already prepared! Just:
1. Update `/app/[locale]/spaces/page.tsx` - Replace mock data with Prisma query
2. Update `/app/api/spaces/route.ts` - Replace mock data with database query
3. Update `/app/api/bookings/route.ts` - Enable database save and email sending

Comments in the code mark exactly where to make these changes.

## File Structure

```
/app
  /[locale]
    /spaces/page.tsx          - Spaces listing (using mock data)
    /booking/page.tsx         - Booking form
    /pricing/page.tsx         - Pricing tables
    /about/page.tsx           - About page
    /contact/page.tsx         - Contact form
  /api
    /spaces/route.ts          - API: Get spaces (mock data)
    /bookings/route.ts        - API: Create booking (demo mode)

/lib
  /mock-data.ts               - Static data for 5 spaces
  /utils.ts                   - Price formatting, reference generation
  /prisma.ts                  - Prisma client (for future use)

/components
  /Navigation.tsx             - Header with language switcher
  /Footer.tsx                 - Footer with contact info & social links
  /Gallery.tsx                - Animated image gallery
  /SpacesGallery.tsx          - Premises photo gallery
  /HeroSection.tsx            - Homepage hero

/public
  /premises                   - 13 actual premises photos
  /Wotespace-logo-01.png      - Company logo

/prisma
  /schema.prisma              - Database schema (ready for production)
  /seed.ts                    - Database seed script (ready for production)
```

## Technologies Used

- **Next.js 16** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **next-intl** for French/English translations
- **React Hook Form** + **Zod** for form validation
- **Prisma** (prepared for production)

## Support

If you encounter any issues or have questions:
- Check **DEPLOYMENT.md** for production setup
- Check **DATABASE_SETUP.md** for database configuration
- Contact: info@wote-space.com

---

**Built with Claude Code** 🤖
