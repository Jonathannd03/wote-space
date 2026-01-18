# Wote Space - Co-working & Meeting Space Booking Platform

A production-ready website for booking co-working spaces and meeting rooms, built with modern web technologies.

## Features

- **Multi-language Support**: French (default) and English
- **Space Listings**: Browse available co-working spaces and meeting rooms
- **Online Booking**: Complete booking system with date/time selection
- **Availability Management**: Real-time availability checking with double-booking prevention
- **Email Confirmations**: Automatic email confirmations via SMTP
- **Responsive Design**: Mobile-first, fully responsive UI
- **Self-hostable**: No dependencies on external SaaS platforms

## Tech Stack

- **Frontend**: Next.js 16 (App Router) with TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **Forms**: React Hook Form with Zod validation
- **Email**: Nodemailer (SMTP)
- **Internationalization**: next-intl

## Project Structure

```
space-wote/
├── app/
│   ├── [locale]/          # Localized routes
│   │   ├── page.tsx       # Home page
│   │   ├── spaces/        # Spaces listing
│   │   ├── booking/       # Booking flow
│   │   ├── about/         # About page
│   │   └── contact/       # Contact page
│   ├── api/               # API routes
│   │   ├── spaces/        # Spaces API
│   │   └── bookings/      # Bookings API
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── Navigation.tsx     # Header navigation
│   └── Footer.tsx         # Footer
├── lib/                   # Utilities
│   ├── prisma.ts          # Prisma client
│   ├── email.ts           # Email service
│   └── utils.ts           # Helper functions
├── messages/              # i18n translations
│   ├── fr.json            # French translations
│   └── en.json            # English translations
├── prisma/
│   ├── schema.prisma      # Database schema
│   ├── seed.ts            # Seed data
│   └── dev.db             # SQLite database
└── public/                # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- SMTP server credentials (for email confirmations)

### Installation

1. **Clone or navigate to the project directory**

```bash
cd space-wote
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

Copy `.env.example` to `.env` and update with your values:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Database
DATABASE_URL="file:./dev.db"

# Email Configuration (SMTP)
SMTP_HOST="smtp.your-provider.com"
SMTP_PORT="587"
SMTP_USER="your-email@example.com"
SMTP_PASS="your-smtp-password"
SMTP_FROM="noreply@wote-space.com"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
ADMIN_EMAIL="admin@wote-space.com"
```

**SMTP Setup Options:**

- **Gmail**: Use App Passwords (smtp.gmail.com:587)
- **SendGrid**: smtp.sendgrid.net:587
- **Mailgun**: smtp.mailgun.org:587
- **Amazon SES**: email-smtp.region.amazonaws.com:587

4. **Initialize the database**

```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

This creates the SQLite database and populates it with sample spaces.

5. **Start the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Viewing Spaces

Navigate to `/fr/spaces` or `/en/spaces` to see available spaces.

### Making a Booking

1. Go to `/fr/booking` or click "Book Now" on any space
2. Fill in booking details (dates, times, number of people)
3. Provide personal information
4. Submit the booking
5. Receive instant confirmation with reference ID
6. Check email for confirmation message

### Language Switching

Use the FR/EN buttons in the navigation header to switch languages.

## Database Schema

### Spaces Table

- Space information (name, description, capacity)
- Pricing (per hour, per day)
- Amenities
- Availability status

### Bookings Table

- Customer information
- Booking period (start/end dates)
- Number of people
- Total price
- Status (PENDING, CONFIRMED, CANCELLED, COMPLETED)
- Unique reference ID

## API Endpoints

### GET `/api/spaces`

Returns all available spaces.

### POST `/api/bookings`

Creates a new booking with availability validation.

**Request Body:**
```json
{
  "spaceId": "string",
  "startDate": "ISO 8601 datetime",
  "endDate": "ISO 8601 datetime",
  "numberOfPeople": number,
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string (optional)",
  "company": "string (optional)",
  "notes": "string (optional)",
  "totalPrice": number,
  "locale": "fr | en"
}
```

**Response:**
```json
{
  "success": true,
  "referenceId": "WS-XXXXXX-XXXX",
  "booking": { ... }
}
```

### GET `/api/bookings`

Returns all bookings (for admin use).

## Key Features Implementation

### Double Booking Prevention

The booking system checks for overlapping reservations using comprehensive date range queries:

- Prevents bookings that start during existing bookings
- Prevents bookings that end during existing bookings
- Prevents bookings that contain or are contained by existing bookings

### Email Confirmations

Automatic emails sent on successful bookings:

- Localized content (French/English)
- Booking details and reference ID
- Professional HTML template
- Copy sent to admin email (optional)

### Internationalization

- Route-based locale detection (`/fr/*`, `/en/*`)
- Complete UI translations
- Localized date formatting
- Language switcher component

## Production Deployment

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Deployment Platforms

**Recommended platforms:**

- **Vercel**: Zero-config deployment (Note: Use PostgreSQL for production)
- **Railway**: Full-stack deployment with SQLite support
- **DigitalOcean App Platform**: Docker-based deployment
- **Self-hosted**: Any Node.js hosting with SQLite support

### Production Considerations

1. **Database**: Consider migrating to PostgreSQL for production:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. **Email**: Configure production SMTP credentials

3. **Security**:
   - Use strong database credentials
   - Enable HTTPS
   - Set secure environment variables
   - Implement rate limiting on booking endpoints

4. **Monitoring**: Add error tracking (e.g., Sentry)

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma db seed` - Seed database with sample data

## Customization

### Adding New Spaces

Edit `prisma/seed.ts` and run:
```bash
npx prisma db seed
```

Or use Prisma Studio:
```bash
npx prisma studio
```

### Updating Translations

Edit files in `messages/` directory:
- `fr.json` - French translations
- `en.json` - English translations

### Styling

Customize colors in `tailwind.config.ts`:
```typescript
theme: {
  extend: {
    colors: {
      primary: { ... }
    }
  }
}
```

## Troubleshooting

### Email Not Sending

- Verify SMTP credentials in `.env`
- Check SMTP port and security settings
- Test with a service like Gmail App Passwords

### Database Issues

```bash
# Reset database
rm prisma/dev.db
npx prisma db push
npx prisma db seed
```

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

## License

ISC

## Support

For issues or questions, contact: admin@wote-space.com

---

Built with ❤️ using Next.js, Prisma, and Tailwind CSS
