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

echo "Running migrations..."
# Set HOME to /tmp to avoid npx permission issues, but use local binary to match version
export HOME=/tmp
# Check for local binary in standard location or fallback to one in node_modules/.bin
if [ -f "./node_modules/.bin/prisma" ]; then
  PRISMA_CMD="./node_modules/.bin/prisma"
else
  PRISMA_CMD="npx prisma"
fi

echo "Using Prisma CLI at: $PRISMA_CMD"
$PRISMA_CMD db push --accept-data-loss

echo "Running seed..."
node seed.js
echo "Database setup completed."

exec "$@"
