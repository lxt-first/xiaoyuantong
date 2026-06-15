#!/bin/sh
set -e

echo "Running database migrations..."
cd /app/packages/server
npx prisma migrate deploy

echo "Starting server..."
exec node /app/packages/server/dist/index.js
