#!/bin/sh
echo "--- 🚀 DILIGENT OS STARTUP ---"
echo "📂 PWD: $(pwd)"
echo "📂 Listing /app root:"
ls -F /app
echo "📂 Listing /app/prisma:"
ls -F /app/prisma

# Force switch to Postgres if DATABASE_URL starts with postgres
if echo "$DATABASE_URL" | grep -q "^postgres"; then
    echo "Using PostgreSQL..."
    if [ -f "switch-db.js" ]; then
        node switch-db.js postgres
    else
        echo "❌ ERROR: switch-db.js not found!"
    fi
else
    echo "Using SQLite (or unknown provider)..."
    if [ -f "switch-db.js" ]; then
        node switch-db.js sqlite
    else
        echo "❌ ERROR: switch-db.js not found!"
    fi
fi

echo "🔄 Generating Prisma Client..."
npx prisma generate --schema=prisma/schema.prisma

echo "📦 Pushing database references..."
# Using local prisma via npx
npx prisma db push --schema=prisma/schema.prisma --accept-data-loss --skip-generate

echo "🌱 Seeding database..."
if [ -f "prisma/seed.ts" ]; then
    npx tsx prisma/seed.ts || echo "⚠️ Seed failed (possibly already seeded)"
else
    echo "❌ ERROR: prisma/seed.ts not found!"
fi

echo "✅ Database ready!"
echo "--- STARTING APP ---"

exec "$@"
