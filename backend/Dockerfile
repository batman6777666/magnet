FROM node:20-slim

RUN apt-get update && apt-get install -y \
  wget \
  ca-certificates \
  fonts-liberation \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcups2 \
  libdrm2 \
  libgbm1 \
  libgtk-3-0 \
  libnspr4 \
  libnss3 \
  libu2f-udev \
  libvulkan1 \
  libxcomposite1 \
  libxdamage1 \
  libxfixes3 \
  libxkbcommon0 \
  libxrandr2 \
  xdg-utils \
  chromium \
  --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./

ENV PUPPETEER_SKIP_DOWNLOAD=true

RUN npm ci --only=production 2>/dev/null || npm install --only=production

COPY . ./

ENV PORT=7860 \
  NODE_ENV=production \
  BROWSER_POOL_SIZE=1 \
  PAGE_LOAD_TIMEOUT_MS=15000 \
  TOTAL_REQUEST_TIMEOUT_MS=30000 \
  PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium \
  ALLOWED_ORIGINS=https://magnet-a4z.pages.dev

EXPOSE 7860

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:7860/health || exit 1

CMD ["node", "src/server.js"]
