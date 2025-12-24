# 1. Base Image - CHANGED to Node 20 (Required for newer Next.js)
FROM node:20-alpine AS base

# 2. Dependencies Stage
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./ 
# Install dependencies
RUN npm ci

# 3. Builder Stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the app
RUN npm run build

# 4. Runner Stage (Production)
FROM base AS runner
WORKDIR /app

# FIXED: Added "=" signs to fix LegacyKeyValueFormat warnings
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Setup permissions
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy the standalone build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

# FIXED: Added "=" signs here too
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]