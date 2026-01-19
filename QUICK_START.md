# Quick Start - Database Setup

## You Only Need to Do 2 Things:

### 1️⃣ Create Database on Vercel (2 minutes)

Go to: **https://vercel.com/dashboard**

1. Click on **`wote-space`** project
2. Click **"Storage"** tab
3. Click **"Create Database"**
4. Select **"Postgres"**
5. Name: `wote-space-db`
6. Click **"Create"**

### 2️⃣ Run Setup Script

```bash
./setup-database.sh
```

That's it! The script will:
- ✅ Pull database connection from Vercel
- ✅ Create all tables
- ✅ Add the 5 spaces (Meeting Rooms S/M/L/XL + Coworking)
- ✅ Verify everything worked
- ✅ Show you how to access the database

---

## How to Access Your Database

### Option 1: Visual Browser (Easiest)

```bash
# Open Prisma Studio (database GUI)
DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d '=' -f2-) npx prisma studio
```

Then open: **http://localhost:5555**

You'll see a visual interface to:
- Browse all tables (spaces, bookings)
- View all records
- Edit data
- Run queries

### Option 2: Command Line SQL Queries

```bash
# Interactive SQL shell
DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d '=' -f2-) npx prisma db execute --stdin
```

Then type your SQL and press `Ctrl+D` to execute:

```sql
-- View all spaces
SELECT * FROM spaces;

-- View all bookings
SELECT * FROM bookings;

-- Check space availability
SELECT name_en, capacity, available FROM spaces WHERE available = true;
```

### Option 3: SQL Client (TablePlus, pgAdmin, etc.)

Get connection string from `.env.production` file:

```bash
cat .env.production | grep DATABASE_URL
```

Use that connection string in your SQL client.

---

## Common Queries

### See all spaces with pricing:
```sql
SELECT
  name_en,
  capacity,
  price_per_hour,
  price_per_day,
  available
FROM spaces
ORDER BY capacity;
```

### See all bookings:
```sql
SELECT
  reference_id,
  first_name,
  last_name,
  email,
  start_date,
  end_date,
  status
FROM bookings
ORDER BY created_at DESC;
```

### Check space availability for a date range:
```sql
SELECT s.name_en, s.capacity, COUNT(b.id) as booking_count
FROM spaces s
LEFT JOIN bookings b ON s.id = b.space_id
  AND b.status IN ('PENDING', 'CONFIRMED')
  AND b.start_date <= '2025-01-31'
  AND b.end_date >= '2025-01-20'
GROUP BY s.id, s.name_en, s.capacity;
```

---

## Troubleshooting

**If setup script fails:**

1. Make sure you created the Vercel Postgres database first
2. Try pulling env vars again: `vercel env pull .env.production --yes`
3. Check if DATABASE_URL exists: `grep DATABASE_URL .env.production`

**Database connection issues:**

- Verify database is running in Vercel dashboard
- Check your Vercel project has the database attached
- Make sure you're using the correct DATABASE_URL from .env.production

---

## What Got Created:

### Tables:
1. **spaces** - All meeting rooms and coworking spaces
2. **bookings** - Customer reservations

### Data:
- 5 spaces with official pricing from OFFRES_TARIFS_WOTE_SPACE.md:
  - Meeting Room S: $10/hour, $60/day (1-10 people)
  - Meeting Room M: $15/hour, $90/day (11-25 people)
  - Meeting Room L: $20/hour, $120/day (26-40 people)
  - Meeting Room XL: $25/hour, $160/day (41-60 people)
  - Co-working Space: $0.50/hour, $3/day (1 person)

### Indexes:
- Fast lookups on space_id
- Optimized date range queries for availability checking
- Unique booking reference IDs

---

## Next Steps

1. Test your site: **https://wote-space.vercel.app/fr/spaces**
2. Try making a test booking
3. View the booking in Prisma Studio
4. Set up email SMTP credentials in Vercel environment variables

Enjoy! 🚀
