#!/bin/sh
echo "--- DEBUG INFO ---"
echo "OpenSSL Version:"
openssl version
echo "Architecture:"
uname -m
echo "Checking for libssl.so.1.1:"
find / -name "libssl.so.1.1" 2>/dev/null
echo "Checking for libssl.so.3:"
find / -name "libssl.so.3" 2>/dev/null
echo "Checking Prisma Client directory:"
ls -l /app/node_modules/.prisma/client/
echo "--- END DEBUG INFO ---"

echo "Generating Prisma Client..."
./node_modules/.bin/prisma generate

echo "Running migrations..."
# Usar la versión local de Prisma, no npx
./node_modules/.bin/prisma db push --accept-data-loss --skip-generate

echo "Running seed..."
node seed.js || echo "Seed skipped"

echo "Database setup completed."
exec "$@"
