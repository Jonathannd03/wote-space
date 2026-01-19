#!/bin/bash

echo "🚀 Wote Space - Simple Database Setup"
echo "======================================"
echo ""
echo "First, get your database connection string:"
echo ""
echo "1. Go to: https://vercel.com/dashboard"
echo "2. Click 'wote-space' project"
echo "3. Click 'Storage' tab"
echo "4. Click on your 'wote-space' database"
echo "5. Click '.env.local' tab"
echo "6. Copy the POSTGRES_PRISMA_URL value"
echo ""
read -p "Paste your POSTGRES_PRISMA_URL here: " DATABASE_URL
echo ""

if [ -z "$DATABASE_URL" ]; then
    echo "❌ No DATABASE_URL provided!"
    exit 1
fi

export DATABASE_URL

echo "✅ Database URL configured"
echo ""

# Run migrations
echo "🔨 Creating database tables..."
npx prisma migrate deploy

if [ $? -ne 0 ]; then
    echo "❌ Migration failed!"
    exit 1
fi

echo "✅ Tables created!"
echo ""

# Seed database
echo "🌱 Adding initial spaces..."
npx prisma db seed

if [ $? -ne 0 ]; then
    echo "❌ Seeding failed!"
    exit 1
fi

echo "✅ Database seeded!"
echo ""

# Verify
echo "🔍 Verifying setup..."
echo ""
echo "Spaces in database:"
npx prisma db execute --stdin <<EOF
SELECT name_en, capacity, price_per_hour, price_per_day FROM spaces ORDER BY capacity;
EOF

echo ""
echo "======================================"
echo "✅ SETUP COMPLETE!"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Add DATABASE_URL to Vercel environment variables:"
echo "   vercel env add DATABASE_URL"
echo "   (Paste the same URL you just used)"
echo ""
echo "2. Redeploy on Vercel:"
echo "   Go to Deployments tab → Click '...' → Redeploy"
echo ""
echo "3. Test your site:"
echo "   https://wote-space.vercel.app/fr/spaces"
echo ""
echo "📊 To view your database:"
echo "   DATABASE_URL='$DATABASE_URL' npx prisma studio"
echo "   Then open: http://localhost:5555"
echo ""
