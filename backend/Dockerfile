FROM node:18-alpine

WORKDIR /app

# Instalar openssl para Prisma
RUN apk add --no-cache openssl

COPY package*.json ./
RUN npm install

COPY prisma ./prisma/
# Generar cliente prisma
RUN npx prisma generate

COPY . .

EXPOSE 4000

COPY docker-entrypoint.sh /usr/local/bin/
# Ya tiene permisos +x localmente, pero por si acaso:
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]
