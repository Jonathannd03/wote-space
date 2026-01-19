#!/bin/bash

echo "🚀 Wote Space - Database Setup Script"
echo "======================================="
echo ""

# Step 1: Pull latest environment variables from Vercel
echo "📥 Step 1: Pulling environment variables from Vercel..."
vercel env pull .env.production --yes

# Check if DATABASE_URL exists
if ! grep -q "DATABASE_URL" .env.production; then
    echo "❌ ERROR: DATABASE_URL not found!"
    echo ""
    echo "You need to create a Vercel Postgres database first:"
    echo "1. Go to https://vercel.com/dashboard"
    echo "2. Click on your 'wote-space' project"
    echo "3. Click 'Storage' tab"
    echo "4. Click 'Create Database'"
    echo "5. Select 'Postgres'"
    echo "6. Name it 'wote-space'"
    echo "7. Click 'Create'"
    echo ""
    echo "Then run this script again."
    exit 1
fi

echo "✅ DATABASE_URL found!"
echo ""

# Step 2: Extract DATABASE_URL
export DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d '=' -f2-)
echo "📊 Database connection configured"
echo ""

# Step 3: Run migrations
echo "🔨 Step 2: Creating database tables (running migrations)..."
npx prisma migrate deploy

if [ $? -ne 0 ]; then
    echo "❌ Migration failed!"
    exit 1
fi

echo "✅ Database tables created!"
echo ""

# Step 4: Seed database
echo "🌱 Step 3: Seeding database with initial spaces..."
npx prisma db seed

if [ $? -ne 0 ]; then
    echo "❌ Seeding failed!"
    exit 1
fi

echo "✅ Database seeded with 5 spaces!"
echo ""

# Step 5: Verify
echo "🔍 Step 4: Verifying data..."
echo ""
echo "Spaces in database:"
npx prisma db execute --stdin <<EOF
SELECT name_en, capacity, price_per_hour, price_per_day FROM spaces ORDER BY capacity;
EOF

echo ""
echo "======================================="
echo "✅ DATABASE SETUP COMPLETE!"
echo "======================================="
echo ""
echo "📋 How to access your database:"
echo ""
echo "1. View in browser (Prisma Studio):"
echo "   DATABASE_URL=\$(grep DATABASE_URL .env.production | cut -d '=' -f2-) npx prisma studio"
echo "   Then open: http://localhost:5555"
echo ""
echo "2. Query via command line:"
echo "   DATABASE_URL=\$(grep DATABASE_URL .env.production | cut -d '=' -f2-) npx prisma db execute --stdin"
echo "   Then paste your SQL and press Ctrl+D"
echo ""
echo "3. Connect with SQL client:"
echo "   Connection string is in .env.production file"
echo ""
echo "🌐 Test your site:"
echo "   https://wote-space.vercel.app/fr/spaces"
echo ""
