#!/bin/sh
set -e

echo "Desplegando migraciones de base de datos..."
npx prisma migrate deploy

echo "Sembrando base de datos..."
node prisma/seed.js

echo "Iniciando servidor Node..."
exec npm run start
