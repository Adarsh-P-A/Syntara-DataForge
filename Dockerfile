# 1. Base Image
FROM node:20-alpine AS base

# 2. Dependencies Stage
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./ 
RUN npm ci

# 3. Builder Stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# We use the standard build command. 
# The .eslintignore file will prevent lint errors here.
RUN npm run build

# 4. Runner Stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy ONLY the optimized standalone build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Run the optimized server directly (faster than npm start)


USER nextjs

EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]