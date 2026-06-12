# Development

## Prerequisites

- **Node.js 20+** (includes `--watch` flag for auto-reload)
- **npm** (shipped with Node.js)
- **Git**
- **Docker** (optional, for containerized development)

## Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-username/magnet.git
cd magnet

# 2. Install backend dependencies
cd backend
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your values (API_KEYS, etc.)

# 4. Start the development server
npm run dev
```

The server starts on `http://localhost:3000` with auto-reload via `node --watch`.

## Running Locally

```bash
# From project root — starts backend dev server
npm run dev

# Or directly:
cd backend && npm run dev

# Production start:
cd backend && npm start
```

## Project Structure

```
magnet/
├── backend/                    # Node.js + Express + Puppeteer API
│   ├── src/
│   │   ├── app.js              # Express app assembly
│   │   ├── server.js           # Entry point, startup, graceful shutdown
│   │   ├── config/
│   │   │   ├── index.js        # Environment variable loader
│   │   │   └── constants.js    # URLs, patterns, error codes
│   │   ├── controllers/
│   │   │   ├── healthController.js
│   │   │   ├── authController.js
│   │   │   ├── extractController.js
│   │   │   └── inspectController.js
│   │   ├── middleware/
│   │   │   ├── security.js     # Helmet + CORS
│   │   │   ├── auth.js         # X-API-Key validation
│   │   │   ├── rateLimiter.js  # Rate limiting
│   │   │   ├── validate.js     # Validation middleware factory
│   │   │   └── errorHandler.js # Global error handler
│   │   ├── routes/
│   │   │   ├── index.js        # Route aggregator
│   │   │   ├── health.js
│   │   │   ├── auth.js
│   │   │   ├── extract.js
│   │   │   └── inspect.js
│   │   ├── services/
│   │   │   ├── extractor/
│   │   │   │   ├── browserPool.js   # Chromium pool manager
│   │   │   │   ├── domExtractor.js  # Page navigation + DOM extraction
│   │   │   │   └── normalizer.js    # Name normalization
│   │   │   ├── auth/
│   │   │   │   └── keyService.js    # Key operations facade
│   │   │   └── storage/
│   │   │       └── keyStore.js      # JSON file key persistence
│   │   ├── utils/
│   │   │   ├── errors.js       # AppError class
│   │   │   ├── logger.js       # Console logger
│   │   │   └── response.js     # Response helpers
│   │   └── validators/
│   │       ├── authValidator.js
│   │       ├── extractValidator.js
│   │       └── inspectValidator.js
│   ├── data/
│   │   └── keys.json           # API key store (auto-generated)
│   ├── .env.example
│   └── package.json
│
├── frontend/                   # React + Vite + TypeScript + Tailwind
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── api/
│   │   │   └── client.ts      # API client
│   │   ├── components/
│   │   │   ├── ExtractForm.tsx
│   │   │   ├── ResultCard.tsx
│   │   │   ├── KeyForm.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   ├── hooks/
│   │   │   ├── useExtract.ts
│   │   │   └── useRegister.ts
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Docs.tsx
│   │   │   └── Status.tsx
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── utils/
│   │       └── index.ts
│   ├── package.json
│   └── vite.config.ts
│
├── Dockerfile                  # Docker image for HF Spaces
├── .env                        # Environment variables (gitignored)
├── .env.example
└── package.json                # Root scripts (dev, start)
```

## Code Style

### Backend (JavaScript, Node.js)

- **Runtime**: Node.js 20+ with CommonJS (`require`/`module.exports`)
- **Framework**: Express 4.x
- **Pattern**: Route-controller-service separation
- **Convention**: Single-responsibility files, small functions, async/await for promises
- **Linting**: No configured linter (follow existing patterns: 2-space indentation, semicolons, single quotes)

### Frontend (TypeScript, React)

- **Runtime**: Browser with TypeScript 5.x
- **Framework**: React 18.x with react-router-dom 6.x
- **Build**: Vite 5.x
- **Styling**: Tailwind CSS 3.x
- **Convention**: Functional components with hooks, TypeScript interfaces for all data types

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | Server listen port |
| `NODE_ENV` | `development` | Environment mode |
| `API_KEYS` | `""` | Comma-separated static API keys |
| `BROWSER_POOL_SIZE` | `5` | Number of pre-launched Chromium instances |
| `PAGE_LOAD_TIMEOUT_MS` | `10000` | Page navigation timeout |
| `TOTAL_REQUEST_TIMEOUT_MS` | `30000` | Maximum extraction time |
| `RATE_LIMIT_WINDOW_MS` | `60000` | Rate limit window in milliseconds |
| `RATE_LIMIT_MAX` | `100` | Max requests per window |
| `PUPPETEER_EXECUTABLE_PATH` | `null` | Custom Chromium path (set automatically in Docker) |

## Docker Development

```bash
# Build image
docker build -t magnet-api .

# Run container
docker run -p 7860:7860 \
  -e API_KEYS=sk_live_dev_key \
  magnet-api

# Test health
curl http://localhost:7860/health
```

## Troubleshooting

| Issue | Solution |
|---|---|
| `Cannot find module 'puppeteer'` | Run `npm install` in `backend/` |
| `EADDRINUSE` | Change `PORT` in `.env` or kill the process on the current port |
| Chromium won't launch | Ensure you are on a system with required libraries (see Dockerfile for dependencies) |
| Extraction returns 408 | Increase `TOTAL_REQUEST_TIMEOUT_MS` in `.env` |
| `node --watch` not found | Upgrade to Node.js 20+ |
| `Error: Failed to launch the browser process` | On Windows, Puppeteer downloads Chromium automatically if not found |
