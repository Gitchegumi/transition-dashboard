# ── Builder ────────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ── Runner ─────────────────────────────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/.next/standalone/repos/transition-dashboard/.env ./
COPY --from=builder /app/.next/standalone/repos/transition-dashboard/package.json ./
COPY --from=builder /app/.next/standalone/repos/transition-dashboard/server.js ./
COPY --from=builder /app/.next/standalone/repos/transition-dashboard/node_modules ./node_modules
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
