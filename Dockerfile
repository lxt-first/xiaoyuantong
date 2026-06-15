# ---- builder ----
FROM node:20-alpine AS builder

WORKDIR /app

# Copy workspace root config
COPY package.json package-lock.json tsconfig.base.json ./

# Copy server and client package.json for dependency install
COPY packages/server/package.json packages/server/tsconfig.json ./packages/server/
COPY packages/client/package.json packages/client/tsconfig.json packages/client/tsconfig.node.json packages/client/vite.config.ts packages/client/index.html ./packages/client/

# Install all dependencies
RUN npm ci --ignore-scripts

# Copy source code
COPY packages/server/prisma ./packages/server/prisma
COPY packages/server/src ./packages/server/src
COPY packages/client/src ./packages/client/src
COPY packages/client/public ./packages/client/public

# Generate Prisma client
RUN cd packages/server && npx prisma generate

# Build server
RUN cd packages/server && npx tsc

# Build client (Vite SPA)
RUN cd packages/client && npx vite build

# ---- runtime ----
FROM node:20-alpine

WORKDIR /app

# Copy node_modules (includes prisma CLI for migrate deploy)
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/server/node_modules ./packages/server/node_modules

# Copy built server
COPY --from=builder /app/packages/server/dist ./packages/server/dist
COPY --from=builder /app/packages/server/package.json ./packages/server/
COPY --from=builder /app/packages/server/prisma ./packages/server/prisma

# Copy built client
COPY --from=builder /app/packages/client/dist ./packages/client/dist

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

# Run migration then start server
CMD cd /app/packages/server && npx prisma migrate deploy && exec node dist/index.js
