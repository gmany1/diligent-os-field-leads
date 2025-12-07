#!/bin/sh
echo "--- 🚀 DILIGENT OS STARTUP ---"
echo "📂 Working Directory: $(pwd)"
ls -la

# Force switch to Postgres if DATABASE_URL starts with postgres
if echo "$DATABASE_URL" | grep -q "^postgres"; then
    echo "Using PostgreSQL..."
    node switch-db.js postgres
else
    echo "Using SQLite (or unknown provider)..."
    node switch-db.js sqlite
fi

echo "🔄 Generating Prisma Client..."
prisma generate

echo "📦 Pushing database references..."
# Using global prisma
prisma db push --accept-data-loss --skip-generate

echo "🌱 Seeding database..."
# Run the seed script with tsx (since it is TypeScript)
tsx prisma/seed.ts || echo "⚠️ Seed failed (possibly already seeded)"

echo "✅ Database ready!"
echo "--- STARTING APP ---"

exec "$@"
