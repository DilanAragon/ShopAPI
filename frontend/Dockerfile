# Etapa 1: Build de la aplicación Vite
FROM node:20-alpine as build

WORKDIR /app

# Pasamos variables de entorno para la fase de build si quisiéramos inyectar otra API,
# pero Vite lo hornea en los módulos. Pasaremos usando un arg.
ARG VITE_API_URL=http://localhost:4000/api
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa 2: Servir con Nginx
FROM nginx:alpine

# Copiar la configuración personalizada para SPA (Redirección a index.html)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos estáticos desde la fase de build
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
