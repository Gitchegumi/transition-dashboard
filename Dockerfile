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

# Copy the entire standalone app output
COPY --from=builder /app/.next/standalone/repos/transition-dashboard/ ./

# Copy static files (served separately from .next/static)
COPY --from=builder /app/.next/static ./.next/static

# Copy public assets (images, favicons, etc.)
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["node", "server.js"]
