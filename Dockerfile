FROM node:20-slim AS base

# Install dependencies for all stages
# CACHE BUST: 2025-12-05-05
RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Force Prisma to use the correct target during generation
ENV PRISMA_CLI_BINARY_TARGETS=debian-openssl-3.0.x

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN \
  if [ -f yarn.lock ]; then npx prisma generate && yarn run build; \
  elif [ -f package-lock.json ]; then npx prisma generate && npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && npx prisma generate && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy full node_modules to ensure all deps (like prisma CLI and seed scripts) are available
COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules

# Copy prisma schema for runtime access
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

# Copy seed script
COPY --from=builder --chown=nextjs:nodejs /app/seed.js ./

# Copy and setup entrypoint
COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

ENTRYPOINT ["./entrypoint.sh"]
CMD ["node", "server.js"]
