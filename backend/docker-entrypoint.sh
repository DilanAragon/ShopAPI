#!/bin/sh
set -e

echo "Desplegando migraciones de base de datos..."
node /app/node_modules/prisma/build/index.js migrate deploy

echo "Sembrando base de datos..."
node prisma/seed.js

echo "Iniciando servidor Node..."
exec npm run start