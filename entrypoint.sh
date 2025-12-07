#!/bin/sh
echo "--- 🚀 DILIGENT OS STARTUP ---"

# Force switch to Postgres if DATABASE_URL starts with postgres
if echo "$DATABASE_URL" | grep -q "^postgres"; then
    echo "Using PostgreSQL..."
    node switch-db.js postgres
else
    echo "Using SQLite (or unknown provider)..."
    node switch-db.js sqlite
fi

echo "🔄 Generating Prisma Client..."
prisma generate --schema=prisma/schema.prisma

echo "📦 Pushing database references..."
prisma db push --schema=prisma/schema.prisma --accept-data-loss --skip-generate

echo "🌱 Seeding database..."
tsx prisma/seed.ts || echo "⚠️ Seed failed (possibly already seeded)"

echo "✅ Database ready!"
echo "--- STARTING APP ---"

exec "$@"
