# Magnet — Video Embed Link Extractor API

Blazing fast video embed link extraction API powered by Puppeteer. Extracts streaming links (RPM, P2P, UPN) from source websites for movies and series.

## Tech Stack

- **Runtime:** Node.js 20+
- **Framework:** Express 4.x
- **Browser Automation:** Puppeteer 23.x
- **Security:** Helmet, CORS, rate limiting
- **Storage:** JSON file (DB-ready abstraction layer)

## Setup

```bash
cp .env.example .env
npm install
npm start
```

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | Server port |
| `NODE_ENV` | `development` | Environment mode |
| `BROWSER_POOL_SIZE` | `5` | Number of Chromium instances |
| `PAGE_LOAD_TIMEOUT_MS` | `10000` | Per-page load timeout |
| `TOTAL_REQUEST_TIMEOUT_MS` | `30000` | Max extraction pipeline time |
| `RATE_LIMIT_WINDOW_MS` | `60000` | Rate limit window |
| `RATE_LIMIT_MAX` | `100` | Max requests per window |
| `PUPPETEER_EXECUTABLE_PATH` | `null` | Custom Chromium path (Docker) |

## API

### `GET /health`
Health check endpoint.

### `POST /auth/register`
Register a new API key.
```json
{ "name": "Your Name", "email": "optional@example.com" }
```

### `POST /v1/extract`
Extract embed links (requires `X-API-Key` header).
```json
{ "type": "movie|series", "name": "Movie Name", "season": 1, "episode": 1 }
```

### `POST /inspect`
Inspect a URL for embed links (no auth required).
```json
{ "url": "https://example.com/page/" }
```

## Deployment

Build and run with Docker:

```bash
docker build -t magnet-api .
docker run -p 7860:7860 magnet-api
```

## Architecture

```
src/
├── app.js              # Express app setup
├── server.js           # Entry point, graceful shutdown
├── config/             # Configuration & constants
├── controllers/        # Request handlers
├── services/           # Business logic (extractor, auth, storage)
├── middleware/          # Auth, security, validation, rate limiting
├── routes/             # Route definitions
├── validators/         # Input validation
└── utils/              # Logger, response helpers, error classes
```
