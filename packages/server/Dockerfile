FROM node:22-alpine AS builder
RUN apk add --no-cache openssl
WORKDIR /app
COPY package.json package-lock.json ./
COPY packages/server/package.json ./packages/server/package.json
COPY tsconfig.base.json ./
RUN npm install --ignore-scripts
COPY . .
RUN npm run build -w packages/server

FROM node:22-alpine
RUN apk add --no-cache openssl
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/server/dist ./packages/server/dist
COPY --from=builder /app/packages/server/package.json ./packages/server/package.json
COPY --from=builder /app/packages/server/schema.prisma ./packages/server/schema.prisma
COPY --from=builder /app/package.json ./
COPY --from=builder /app/tsconfig.base.json ./
WORKDIR /app/packages/server
RUN npx prisma generate --schema=./schema.prisma
EXPOSE 3001
CMD ["node", "dist/index.js"]