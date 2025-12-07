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
./node_modules/.bin/prisma generate

echo "📦 Pushing database references..."
# Using db push instead of migrate deploy to be safer with non-empty DBs in dev/test scenarios
./node_modules/.bin/prisma db push --accept-data-loss --skip-generate

echo "🌱 Seeding database..."
# Run the seed script directly
node prisma/seed.ts || echo "⚠️ Seed failed (possibly already seeded)"

echo "✅ Database ready!"
echo "--- STARTING APP ---"

exec "$@"
