# Database Setup Guide - Wote Space

## Database Type

**PostgreSQL** (Version 12 or higher)

The application uses PostgreSQL as the database with Prisma ORM for schema management and queries.

---

## Table of Contents

1. [Quick Setup with Vercel Postgres (Recommended)](#quick-setup-with-vercel-postgres)
2. [Manual PostgreSQL Setup](#manual-postgresql-setup)
3. [Database Schema (SQL)](#database-schema-sql)
4. [Seed Data (SQL)](#seed-data-sql)
5. [Environment Variables](#environment-variables)
6. [Verification Steps](#verification-steps)

---

## Quick Setup with Vercel Postgres (Recommended)

### Step 1: Create Vercel Postgres Database

1. Go to https://vercel.com/dashboard
2. Select your `wote-space` project
3. Click **"Storage"** tab
4. Click **"Create Database"**
5. Select **"Postgres"**
6. Name: `wote-space-db`
7. Region: Choose closest to your users (Europe for Goma, DRC)
8. Click **"Create"**

Vercel will automatically:
- Create the PostgreSQL database
- Add `DATABASE_URL` environment variable to your project

### Step 2: Add Other Environment Variables

In Vercel project settings → Environment Variables, add:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@wote-space.com
NEXT_PUBLIC_APP_URL=https://wote-space.vercel.app
ADMIN_EMAIL=info@wote-space.com
```

### Step 3: Run Migrations (Using Prisma - Recommended)

On your local machine:

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Link to your project
vercel link

# Pull production environment variables (includes DATABASE_URL)
vercel env pull .env.production

# Set the DATABASE_URL for this session (or export it)
# On Mac/Linux:
export DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d '=' -f2-)

# On Windows PowerShell:
# $env:DATABASE_URL = (Get-Content .env.production | Select-String "DATABASE_URL").ToString().Split('=',2)[1]

# Run migrations to create tables
npx prisma migrate deploy

# Seed the database with initial spaces
npx prisma db seed
```

### Step 4: Redeploy on Vercel

1. Go to **Deployments** tab
2. Click **"..."** on latest deployment
3. Click **"Redeploy"**

Your site should now work at https://wote-space.vercel.app

---

## Manual PostgreSQL Setup

If you want to use a different PostgreSQL provider (Railway, Supabase, Neon, AWS RDS, etc.):

### Step 1: Create PostgreSQL Database

Create a new PostgreSQL database named `wote_space` (or any name you prefer).

### Step 2: Get Connection String

Get the connection string in this format:
```
postgresql://USERNAME:PASSWORD@HOST:5432/DATABASE_NAME
```

Example:
```
postgresql://postgres:mypassword@db.example.com:5432/wote_space
```

### Step 3: Set Environment Variable

Add to your `.env` file locally or Vercel environment variables:
```
DATABASE_URL="postgresql://USERNAME:PASSWORD@HOST:5432/DATABASE_NAME"
```

### Step 4: Run Migrations

```bash
npx prisma migrate deploy
npx prisma db seed
```

---

## Database Schema (SQL)

If you need to create tables manually without Prisma, here are the SQL scripts:

### 1. Create Enum Type

```sql
-- Create booking status enum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');
```

### 2. Create Spaces Table

```sql
-- Create spaces table
CREATE TABLE "spaces" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "name_fr" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "description_en" TEXT NOT NULL,
    "description_fr" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "price_per_hour" DECIMAL(65,30) NOT NULL,
    "price_per_day" DECIMAL(65,30) NOT NULL,
    "amenities" TEXT NOT NULL,
    "image_url" TEXT,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spaces_pkey" PRIMARY KEY ("id")
);
```

### 3. Create Bookings Table

```sql
-- Create bookings table
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL,
    "reference_id" TEXT NOT NULL,
    "space_id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "company" TEXT,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "number_of_people" INTEGER NOT NULL,
    "total_price" DECIMAL(65,30) NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);
```

### 4. Create Unique Constraints and Indexes

```sql
-- Add unique constraint on reference_id
CREATE UNIQUE INDEX "bookings_reference_id_key" ON "bookings"("reference_id");

-- Add index on space_id for faster lookups
CREATE INDEX "bookings_space_id_idx" ON "bookings"("space_id");

-- Add composite index on start_date and end_date for availability queries
CREATE INDEX "bookings_start_date_end_date_idx" ON "bookings"("start_date", "end_date");
```

### 5. Create Foreign Key Relationship

```sql
-- Add foreign key constraint
ALTER TABLE "bookings"
ADD CONSTRAINT "bookings_space_id_fkey"
FOREIGN KEY ("space_id")
REFERENCES "spaces"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;
```

---

## Seed Data (SQL)

Insert the 5 initial spaces that match the official tariffs:

```sql
-- Meeting Room S (1-10 people)
INSERT INTO "spaces" (
    "id",
    "name",
    "name_en",
    "name_fr",
    "description",
    "description_en",
    "description_fr",
    "capacity",
    "price_per_hour",
    "price_per_day",
    "amenities",
    "available",
    "created_at",
    "updated_at"
) VALUES (
    'cm001',
    'Meeting Room S',
    'Meeting Room S (1-10 people)',
    'Salle de Réunion S (1-10 personnes)',
    'Small meeting room for up to 10 people',
    'Small meeting room for up to 10 people',
    'Petite salle de réunion jusqu''à 10 personnes',
    10,
    10.0,
    60.0,
    '["Wi-Fi", "Projecteur/Écran", "Whiteboard", "Café"]',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Meeting Room M (11-25 people)
INSERT INTO "spaces" (
    "id",
    "name",
    "name_en",
    "name_fr",
    "description",
    "description_en",
    "description_fr",
    "capacity",
    "price_per_hour",
    "price_per_day",
    "amenities",
    "available",
    "created_at",
    "updated_at"
) VALUES (
    'cm002',
    'Meeting Room M',
    'Meeting Room M (11-25 people)',
    'Salle de Réunion M (11-25 personnes)',
    'Medium meeting room for 11-25 people',
    'Medium meeting room for 11-25 people',
    'Salle de réunion moyenne pour 11-25 personnes',
    25,
    15.0,
    90.0,
    '["Wi-Fi", "Projecteur/Écran", "Whiteboard", "Video Conferencing", "Café"]',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Meeting Room L (26-40 people)
INSERT INTO "spaces" (
    "id",
    "name",
    "name_en",
    "name_fr",
    "description",
    "description_en",
    "description_fr",
    "capacity",
    "price_per_hour",
    "price_per_day",
    "amenities",
    "available",
    "created_at",
    "updated_at"
) VALUES (
    'cm003',
    'Meeting Room L',
    'Meeting Room L (26-40 people)',
    'Salle de Réunion L (26-40 personnes)',
    'Large meeting room for 26-40 people',
    'Large meeting room for 26-40 people',
    'Grande salle de réunion pour 26-40 personnes',
    40,
    20.0,
    120.0,
    '["Wi-Fi", "Projecteur/Écran", "Whiteboard", "Video Conferencing", "Café", "Sonorisation"]',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Meeting Room XL (41-60 people)
INSERT INTO "spaces" (
    "id",
    "name",
    "name_en",
    "name_fr",
    "description",
    "description_en",
    "description_fr",
    "capacity",
    "price_per_hour",
    "price_per_day",
    "amenities",
    "available",
    "created_at",
    "updated_at"
) VALUES (
    'cm004',
    'Meeting Room XL',
    'Meeting Room XL (41-60 people)',
    'Salle de Réunion XL (41-60 personnes)',
    'Extra large meeting room for 41-60 people',
    'Extra large meeting room for 41-60 people',
    'Très grande salle de réunion pour 41-60 personnes',
    60,
    25.0,
    160.0,
    '["Wi-Fi Premium", "Projecteur/Écran", "Whiteboard", "Video Conferencing", "Café", "Sonorisation", "Assistance Technique"]',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Co-working Space
INSERT INTO "spaces" (
    "id",
    "name",
    "name_en",
    "name_fr",
    "description",
    "description_en",
    "description_fr",
    "capacity",
    "price_per_hour",
    "price_per_day",
    "amenities",
    "available",
    "created_at",
    "updated_at"
) VALUES (
    'cm005',
    'Co-working Space',
    'Co-working Space',
    'Espace de Coworking',
    'Shared co-working space with daily access',
    'Shared co-working space with daily access',
    'Espace de coworking partagé avec accès journalier',
    1,
    0.5,
    3.0,
    '["Wi-Fi", "Mobilier & espaces communs", "Café"]',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);
```

---

## Environment Variables

Your application needs these environment variables to function:

### Required Variables

```bash
# Database Connection
DATABASE_URL="postgresql://USERNAME:PASSWORD@HOST:5432/DATABASE_NAME"

# Email Configuration (SMTP)
SMTP_HOST="smtp.gmail.com"              # Or your SMTP provider
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"        # Your email
SMTP_PASS="your-app-password"           # Gmail app password or SMTP password
SMTP_FROM="noreply@wote-space.com"

# Application URLs
NEXT_PUBLIC_APP_URL="https://wote-space.vercel.app"
ADMIN_EMAIL="info@wote-space.com"
```

### How to Generate Gmail App Password

1. Go to https://myaccount.google.com/
2. Click **"Security"**
3. Enable **"2-Step Verification"**
4. Search for **"App Passwords"**
5. Select **"Mail"** and **"Other"** (name it "Wote Space")
6. Click **"Generate"**
7. Copy the 16-character password

---

## Verification Steps

After setting up the database, verify everything works:

### 1. Check Database Connection

```bash
# Using Prisma Studio (visual database browser)
npx prisma studio
```

This will open http://localhost:5555 where you can view your data.

### 2. Verify Tables Exist

Run this query in your PostgreSQL client:

```sql
-- List all tables
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';
```

You should see:
- `spaces`
- `bookings`

### 3. Verify Seed Data

```sql
-- Check if spaces were inserted
SELECT id, name_en, capacity, price_per_hour, price_per_day
FROM spaces
ORDER BY capacity;
```

You should see 5 rows:
- Meeting Room S (10 people, $10/hour, $60/day)
- Meeting Room M (25 people, $15/hour, $90/day)
- Meeting Room L (40 people, $20/hour, $120/day)
- Meeting Room XL (60 people, $25/hour, $160/day)
- Co-working Space (1 person, $0.50/hour, $3/day)

### 4. Test the Application

Visit these URLs and verify they load without errors:

- https://wote-space.vercel.app/en
- https://wote-space.vercel.app/en/spaces (should show 5 spaces)
- https://wote-space.vercel.app/en/booking (booking form should load)
- https://wote-space.vercel.app/en/pricing (pricing page should load)

---

## Troubleshooting

### "Can't reach database server"

- Verify `DATABASE_URL` is correct
- Check if database server is running
- Verify firewall allows connections from Vercel IPs

### "Relation does not exist"

- Tables haven't been created yet
- Run: `npx prisma migrate deploy`

### "No spaces showing on /spaces page"

- Database is empty
- Run: `npx prisma db seed`

### Prisma Client Errors

```bash
# Regenerate Prisma Client
npx prisma generate

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

---

## Complete Database Schema Overview

```
┌─────────────────┐
│     spaces      │
├─────────────────┤
│ id (PK)         │
│ name            │
│ name_en         │
│ name_fr         │
│ description     │
│ description_en  │
│ description_fr  │
│ capacity        │
│ price_per_hour  │
│ price_per_day   │
│ amenities       │ (JSON string)
│ image_url       │
│ available       │
│ created_at      │
│ updated_at      │
└─────────────────┘
         │
         │ 1:N
         │
         ▼
┌─────────────────┐
│    bookings     │
├─────────────────┤
│ id (PK)         │
│ reference_id    │ (unique)
│ space_id (FK)   │ → spaces.id
│ first_name      │
│ last_name       │
│ email           │
│ phone           │
│ company         │
│ start_date      │
│ end_date        │
│ number_of_people│
│ total_price     │
│ status          │ (enum: PENDING/CONFIRMED/CANCELLED/COMPLETED)
│ notes           │
│ created_at      │
│ updated_at      │
└─────────────────┘

Indexes:
- bookings.reference_id (unique)
- bookings.space_id
- bookings.(start_date, end_date) (composite)
```

---

## Quick Reference Commands

```bash
# Generate Prisma Client
npx prisma generate

# Create/update database tables
npx prisma migrate deploy

# Seed database with initial data
npx prisma db seed

# View database in browser
npx prisma studio

# Reset database (deletes all data)
npx prisma migrate reset

# Pull production DB URL from Vercel
vercel env pull .env.production
```

---

## Support

If you encounter issues:
- Check Vercel function logs: Project → Deployments → Click deployment → "Functions" tab
- Check database logs in your database provider's dashboard
- Verify all environment variables are set correctly
