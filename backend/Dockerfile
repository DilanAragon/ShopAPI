FROM node:18-alpine

WORKDIR /app

# Instalar openssl para Prisma
RUN apk add --no-cache openssl

COPY package*.json ./
RUN npm install

COPY prisma ./prisma/

COPY . .

# Generar cliente prisma usando node directamente
RUN node node_modules/prisma/build/index.js generate

EXPOSE 4000

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]