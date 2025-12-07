#!/bin/sh
echo "--- 🚀 DILIGENT OS STARTUP ---"
echo "📂 PWD: $(pwd)"
echo "📂 Listing /app root:"
ls -F /app
echo "📂 Listing /app/prisma:"
ls -F /app/prisma

# FORCE POSTGRES - No more checks
echo "🚀 Forcing PostgreSQL configuration..."
if [ -f "switch-db.js" ]; then
    echo "⚙️  Running switch-db.js postgres..."
    node switch-db.js postgres
else
    echo "❌ ERROR: switch-db.js not found!"
    ls -la
    exit 1
fi

echo "📄 Verifying schema provider:"
grep "provider" prisma/schema.prisma

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
