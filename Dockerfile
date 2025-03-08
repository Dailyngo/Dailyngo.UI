# Yapı aşaması için Node.js slim imajını kullan
FROM node:22.6.0-slim AS build_image

# Çalışma dizinini ayarla
WORKDIR /app

# package.json ve pnpm-lock.yaml dosyalarını kopyala
COPY package.json pnpm-lock.yaml .env ./

# Çevresel değişkeni ayarla
ARG APP_ENV
ENV APP_ENV=${APP_ENV}

# pnpm ile bağımlılıkları kur
RUN npm install -g pnpm && pnpm install --frozen-lockfile 

# Tüm dosyaları kopyala ve uygulamayı derle
COPY . .
RUN pnpm build

# Çalışma aşaması için hafif Node.js alpine imajını kullan
FROM node:22.6.0-alpine

# Çalışma dizinini ayarla
WORKDIR /app

# pnpm'yi kur (çalışma aşamasında da kurulu olması gerekiyor)
RUN npm install -g pnpm

# Yalnızca gerekli dosyaları kopyalayın
COPY --from=build_image /app/package.json ./
COPY --from=build_image /app/pnpm-lock.yaml ./
COPY --from=build_image /app/node_modules ./node_modules/
COPY --from=build_image /app/.next ./.next
COPY --from=build_image /app/public ./public
COPY --from=build_image /app/.env .env

# Çevresel değişkeni ayarla
ARG APP_ENV
ENV APP_ENV=${APP_ENV}

# Portu aç
EXPOSE 3000

# Uygulamayı başlat
CMD ["pnpm", "start"]
