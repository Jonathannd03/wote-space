# Deployment Guide for Wote Space

## Prerequisites
- GitHub account (for connecting to Vercel)
- Vercel account (free tier is sufficient)
- Email SMTP credentials (Gmail, SendGrid, or other provider)

## Step 1: Set Up PostgreSQL Database

### Option A: Vercel Postgres (Recommended - Easy Setup)

1. Go to your Vercel project dashboard
2. Click on the "Storage" tab
3. Click "Create Database"
4. Select "Postgres"
5. Choose a name (e.g., `wote-space-db`)
6. Select a region (choose closest to your users - for Goma, DRC, choose Europe or Africa region if available)
7. Click "Create"
8. Vercel will automatically add the `DATABASE_URL` environment variable to your project

### Option B: External PostgreSQL (Supabase, Railway, Neon, etc.)

1. Create a PostgreSQL database on your chosen provider
2. Get the connection string (format: `postgresql://USER:PASSWORD@HOST:5432/DATABASE_NAME`)
3. You'll add this as `DATABASE_URL` in Vercel environment variables (see Step 3)

## Step 2: Prepare Email SMTP Credentials

You need SMTP credentials to send booking confirmation emails.

### Using Gmail (Free):

1. Go to your Google Account settings
2. Enable 2-Factor Authentication if not already enabled
3. Go to "App Passwords" (search for it in account settings)
4. Generate a new app password for "Mail"
5. Save these credentials:
   - SMTP_HOST: `smtp.gmail.com`
   - SMTP_PORT: `587`
   - SMTP_USER: your Gmail address (e.g., `your-email@gmail.com`)
   - SMTP_PASS: the 16-character app password (e.g., `abcd efgh ijkl mnop`)
   - SMTP_FROM: `noreply@wote-space.com` (or your Gmail)

### Using SendGrid (Recommended for Production):

1. Sign up at sendgrid.com (free tier: 100 emails/day)
2. Create an API key
3. Save these credentials:
   - SMTP_HOST: `smtp.sendgrid.net`
   - SMTP_PORT: `587`
   - SMTP_USER: `apikey` (literally the word "apikey")
   - SMTP_PASS: your SendGrid API key
   - SMTP_FROM: `noreply@wote-space.com`

## Step 3: Configure Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Click "Settings" tab
3. Click "Environment Variables" in the sidebar
4. Add the following variables:

**If using Vercel Postgres (Option A):**
- `DATABASE_URL` will already be set automatically - skip this one

**If using External Database (Option B):**
- Key: `DATABASE_URL`
- Value: `postgresql://USER:PASSWORD@HOST:5432/DATABASE_NAME`
- Environment: Production, Preview, Development (check all)

**Email Configuration (Required for both options):**
- Key: `SMTP_HOST`
- Value: `smtp.gmail.com` (or your provider)
- Environment: Production, Preview, Development

- Key: `SMTP_PORT`
- Value: `587`
- Environment: Production, Preview, Development

- Key: `SMTP_USER`
- Value: Your email or `apikey` for SendGrid
- Environment: Production, Preview, Development

- Key: `SMTP_PASS`
- Value: Your app password or API key (KEEP SECRET!)
- Environment: Production, Preview, Development

- Key: `SMTP_FROM`
- Value: `noreply@wote-space.com`
- Environment: Production, Preview, Development

**Application URLs:**
- Key: `NEXT_PUBLIC_APP_URL`
- Value: Your Vercel URL (e.g., `https://wote-space.vercel.app`)
- Environment: Production, Preview, Development

- Key: `ADMIN_EMAIL`
- Value: `info@wote-space.com` (receives booking notifications)
- Environment: Production, Preview, Development

## Step 4: Deploy to Vercel

### First Time Setup:

1. Push your code to GitHub (if not already done):
```bash
git add .
git commit -m "Ready for production deployment"
git push origin main
```

2. Go to [vercel.com](https://vercel.com)
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure project:
   - Framework Preset: Next.js
   - Root Directory: `./` (leave as default)
   - Build Command: `npm run build` (default)
   - Install Command: `npm install` (default)
6. Click "Deploy"

### After Environment Variables are Set:

The build will succeed, but the database will be empty. You need to run migrations and seed the database.

## Step 5: Run Database Migrations

After deployment succeeds, you need to set up the database schema.

### Method 1: Using Vercel CLI (Recommended)

1. Install Vercel CLI globally:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Link your project:
```bash
vercel link
```

4. Pull environment variables (so you have DATABASE_URL locally):
```bash
vercel env pull .env.local
```

5. Run migrations against production database:
```bash
npx prisma migrate deploy
```

6. Seed the database with initial spaces:
```bash
npx prisma db seed
```

### Method 2: Using GitHub Actions (Alternative)

Add a script to your `package.json` and trigger it via Vercel's deployment hooks, or run it manually once after deployment using the Vercel CLI as shown in Method 1.

## Step 6: Verify Deployment

1. Visit your Vercel URL (e.g., `https://wote-space.vercel.app`)
2. Check that all pages load correctly
3. Navigate to `/en/spaces` or `/fr/spaces` - you should see 5 spaces
4. Try making a test booking
5. Check that you receive the confirmation email

## Step 7: Custom Domain (Optional)

1. Go to Vercel project dashboard
2. Click "Settings" > "Domains"
3. Add your custom domain (e.g., `wote-space.com`)
4. Follow DNS configuration instructions
5. Update `NEXT_PUBLIC_APP_URL` environment variable to your custom domain

## Troubleshooting

### Build Fails with "Prisma Client not found"
- Make sure `postinstall` script in package.json runs `prisma generate`
- This should already be configured in your package.json

### Database Connection Errors
- Verify `DATABASE_URL` is correctly set in Vercel environment variables
- Check that your database is accessible (not behind a firewall)
- For Vercel Postgres, make sure it's in the same region

### Email Not Sending
- Verify all SMTP environment variables are set correctly
- Test SMTP credentials independently
- Check spam folder for confirmation emails
- For Gmail, ensure "Less secure app access" is enabled OR use App Password

### No Spaces Showing on /spaces Page
- You need to seed the database (see Step 5)
- Verify database migrations ran successfully
- Check Vercel function logs for errors

## Local Development with PostgreSQL

If you want to test with PostgreSQL locally:

1. Install PostgreSQL on your machine
2. Create a local database:
```bash
createdb wote_space
```

3. Update `.env.local`:
```env
DATABASE_URL="postgresql://localhost:5432/wote_space"
```

4. Run migrations:
```bash
npx prisma migrate dev
```

5. Seed the database:
```bash
npx prisma db seed
```

## Monitoring and Logs

- **Vercel Logs**: Go to your project > "Deployments" > Click on a deployment > "Functions" tab
- **Database Logs**: Check your database provider's dashboard
- **Email Delivery**: Check your SMTP provider's dashboard for sent emails

## Support

For issues specific to:
- Vercel deployment: [vercel.com/docs](https://vercel.com/docs)
- Prisma migrations: [prisma.io/docs](https://www.prisma.io/docs)
- Email delivery: Check your SMTP provider's documentation
