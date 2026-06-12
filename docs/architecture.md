# Architecture

## Overview

Magnet is a video embed link extraction API service. It accepts movie or series titles, navigates to `multimovies.homes` using a headless Chromium browser (Puppeteer), and extracts streaming server embed URLs (RPM, P2P, UPN) from the page's DOM and network responses.

The system is split into two independent deployments: a backend API service and a frontend web application.

## System Architecture Diagram

```
+-------------------------------------------------------------------+
|                         Internet                                   |
+-------------------------------------------------------------------+
         |                                            |
         v                                            v
+------------------+                      +-------------------------+
|  Cloudflare CDN  |                      |  Hugging Face Spaces    |
|  (frontend)      |                      |  (backend API)          |
+------------------+                      +-------------------------+
         |                                            |
         v                                            v
+------------------+                      +-------------------------+
|  React SPA       |  ---- POST /v1 ---> |  Node.js + Express      |
|  Vite + TS       |  <--- JSON -------  |  + Puppeteer            |
|  Tailwind CSS    |                      |                         |
+------------------+                      +-------+-----------------+
                                                   |
                                                   v
                                          +------------------+
                                          |  multimovies.homes|
                                          |  (target site)    |
                                          +------------------+
```

## Backend Architecture

### Component Tree

```
config/
  index.js           -- Loads environment variables (PORT, API_KEYS, timeouts)
  constants.js        -- Base URLs, stream patterns, blocked resources, error codes

app.js               -- Express app setup (security middleware, JSON parser, routes, 404 handler)

routes/
  index.js           -- Mounts sub-routers
  health.js          -- GET /health
  auth.js            -- POST /auth/register (with registration rate limiter)
  extract.js         -- POST /v1/extract (behind auth + rate limiter)
  inspect.js         -- POST /inspect (no auth)

controllers/
  healthController.js   -- Returns { status, uptime }
  authController.js     -- Delegates to keyService.createKey()
  extractController.js  -- Orchestrates extraction pipeline
  inspectController.js  -- URL inspection (no auth)

services/
  extractor/
    browserPool.js      -- Manages a pool of Chromium browser instances
    domExtractor.js     -- Navigates page, intercepts network responses, extracts stream URLs
    normalizer.js       -- Normalizes movie/series names to URL-safe slugs
  auth/
    keyService.js       -- Wraps keyStore with business logic
  storage/
    keyStore.js          -- JSON file-based key persistence (read/write)

middleware/
  security.js         -- Helmet headers + CORS
  auth.js             -- X-API-Key header validation
  rateLimiter.js      -- Rate limiting per API key
  validate.js         -- Generic validation middleware factory
  errorHandler.js     -- Global Express error handler

validators/
  authValidator.js    -- Validates POST /auth/register body
  extractValidator.js -- Validates POST /v1/extract body
  inspectValidator.js -- Validates POST /inspect body

utils/
  errors.js           -- AppError class
  logger.js           -- Console logger with timestamps
  response.js         -- success() and error() response helpers
```

### Middleware Pipeline Order

For requests to `/v1/extract`:

```
Incoming Request
    |
    v
[1] security.js      -- helmet() + cors()                    (app level)
    |
    v
[2] express.json()   -- Body parser (10kb limit)             (app level)
    |
    v
[3] auth.js          -- X-API-Key header check               (route level)
    |
    v
[4] rateLimiter.js   -- express-rate-limit per API key       (route level)
    |
    v
[5] controller       -- extractController.extract()
    |
    v
    response
```

For `/health` and `/inspect`: Steps 1 and 2 only (no auth/ratelimit).

For `/auth/register`: Steps 1, 2, then a dedicated registration rate limiter (10 req/hour per IP), then validation, then controller.

### Service Layer

| Service | File | Responsibility |
|---|---|---|
| `browserPool` | `services/extractor/browserPool.js` | Pre-launches N Chromium instances; hands them out on demand with acquire/release semaphore |
| `domExtractor` | `services/extractor/domExtractor.js` | Creates stealth page, intercepts `embedhelper.php` and `admin-ajax.php` responses, parses stream IDs, matches frame URLs |
| `normalizer` | `services/extractor/normalizer.js` | Strips year/tags from names, lowercases, produces kebab-case slugs |
| `keyService` | `services/auth/keyService.js` | Thin facade over keyStore |
| `keyStore` | `services/storage/keyStore.js` | Reads/writes `data/keys.json`; CRUD for API keys |

## Frontend Architecture

The frontend is a React Single Page Application built with Vite, TypeScript, and Tailwind CSS. It deploys independently to Cloudflare Pages.

### Page Structure

```
src/
  main.tsx            -- ReactDOM.createRoot entry
  App.tsx             -- Router setup (react-router-dom)
  pages/
    Home.tsx          -- Landing / extraction form
    Docs.tsx          -- API documentation page
    Status.tsx        -- Service status / health check display
  components/
    ExtractForm.tsx   -- Movie/series title input
    ResultCard.tsx    -- Displays extracted RPM / P2P / UPN links
    KeyForm.tsx       -- API key registration form
    Navbar.tsx        -- Navigation bar
    Footer.tsx        -- Page footer
  api/
    client.ts         -- Axios/fetch wrapper with base URL from VITE_API_BASE
  hooks/
    useExtract.ts     -- Encapsulates extraction request lifecycle
    useRegister.ts    -- Encapsulates registration request lifecycle
  types/
    index.ts          -- TypeScript interfaces (ApiResponse, Links, etc.)
  utils/
    index.ts          -- Helper functions
```

### API Client Pattern

The frontend uses a single API client module (`api/client.ts`) that:

- Reads `VITE_API_BASE` from environment for the backend URL
- Attaches `X-API-Key` header when a key is stored
- Handles JSON serialization/deserialization
- Returns typed responses matching the API envelope

### Component Tree

```
<App>
  <Navbar />
  <Routes>
    <Route path="/" element={<Home />}>
      <ExtractForm />          -- type, name, season/episode inputs
      <ResultCard />           -- Renders rpm/p2p/upn links
    </Route>
    <Route path="/docs" element={<Docs />} />
    <Route path="/status" element={<Status />} />
  </Routes>
  <Footer />
</App>
```

## Data Flow

```
User
  |
  |  POST /v1/extract  { type, name, season, episode }
  |  X-API-Key: mk-xxxx
  v
API Gateway (Express)
  |
  v
Auth Middleware
  |  Reads X-API-Key header
  |  Validates against keyStore.keys.json
  |  Rejects 401 if missing/invalid
  v
Rate Limiter Middleware
  |  Checks request count per key in sliding window
  |  Rejects 429 if exceeded
  v
Validation (inline in controller)
  |  Checks type in ['movie','series']
  |  Checks name is non-empty string
  |  Checks season/episode for series
  |  Rejects 400 if invalid
  v
Extract Controller
  |
  v
Normalizer (services/extractor/normalizer.js)
  |  Strips year/parentheses/tags
  |  Converts to lowercase kebab-case: "The Matrix (1999)" -> "the-matrix"
  v
URL Builder
  |  movie:  https://multimovies.homes/movies/{slug}/
  |  series: https://multimovies.homes/episodes/{slug}-{S}x{E}/
  v
Browser Pool (services/extractor/browserPool.js)
  |  Acquires a free Chromium slot (or waits in queue)
  v
DOM Extraction (services/extractor/domExtractor.js)
  |  Creates stealth page with anti-detection
  |  Blocks ads/trackers via request interception
  |  Navigates to target URL
  |  Waits for #playeroptionsul selector
  |  Clicks first non-trailer server option
  |  Intercepts embedhelper.php response -> parses base64 mresult
  |  Intercepts admin-ajax.php responses -> extracts embed URLs
  |  Scans iframe frame URLs for RPM/P2P/UPN patterns
  v
Result
  |  { success, rpm, p2p, upn } or error object
  v
Controller Formatter
  |  Wraps in standard envelope
  |  Adds request_time_ms, normalized_name, source_url
  v
Response
  |  200: { success, request_time_ms, data: { type, name, links: {rpm, p2p, upn} } }
  |  404: { success, error, code: SOURCE_NOT_FOUND }
  |  408: { success, error, code: TIMEOUT }
  |  500: { success, error, code: INTERNAL_ERROR }
```

## Storage

The key store is a simple JSON file at `backend/data/keys.json`. Each entry maps an API key string to a record:

```json
{
  "mk-abc123-def456-789": {
    "name": "User Name",
    "email": "user@example.com",
    "active": true,
    "requestCount": 42,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "lastUsedAt": "2026-06-01T00:00:00.000Z"
  }
}
```

The `keyStore.js` module exposes a flat-file `readStore()`/`writeStore()` interface that could be swapped for Redis, SQLite, or PostgreSQL without changing the rest of the codebase.

## Deployment Diagram

```
+---------------------------+         +---------------------------+
|   Cloudflare Pages        |         |   Hugging Face Spaces     |
|                           |         |                           |
|   React SPA (Vite)        |  HTTP   |   Docker Container        |
|   Domain: magnet.app      |<------->|   Node.js + Express       |
|                           |         |   + Puppeteer + Chromium  |
+---------------------------+         |   Port 7860              |
                                      |                           |
                                      |   Environment Secrets:    |
                                      |   - API_KEYS             |
                                      |   - BROWSER_POOL_SIZE    |
                                      |   - Rate limit config    |
                                      +---------------------------+
                                                  |
                                                  | HTTP
                                                  v
                                      +---------------------------+
                                      |   multimovies.homes       |
                                      |   (external target site)  |
                                      +---------------------------+
```

## Sequence Diagram: Extraction Flow

```
 Client           Express           Auth         RateLimiter      BrowserPool     DOM Extractor    multimovies
   |                 |                |               |               |                |              |
   | POST /v1/extract|               |               |               |                |              |
   |---------------->|               |               |               |                |              |
   |                 |--- auth ---->|               |               |                |              |
   |                 |<--- ok -----|               |               |                |              |
   |                 |--- check -->|               |               |                |              |
   |                 |<--- ok ----|               |                |                |              |
   |                 |                                |               |                |              |
   |                 |----------- acquire() -------->|               |                |              |
   |                 |<---------- slot --------------|               |                |              |
   |                 |                                               |                |              |
   |                 |------------------------------- extractLinks(page, url) ------->|              |
   |                 |                                                               |              |
   |                 |                                                               |-- HTTP GET -->|
   |                 |                                                               |<--- HTML ----|
   |                 |                                                               |              |
   |                 |                                  embedhelper.php response     |              |
   |                 |<--------------------------------------------------------------|              |
   |                 |                                                               |              |
   |                 |                                            admin-ajax.php     |              |
   |                 |<--------------------------------------------------------------|              |
   |                 |                                                               |              |
   |                 |                                  Parse base64 mresult         |              |
   |                 |                                  Match stream patterns        |              |
   |                 |                                  Scan iframe URLs             |              |
   |                 |                                                               |              |
   |                 |<------------ { success, rpm, p2p, upn } ---------------------|              |
   |                 |                                               |                |              |
   |                 |----------- release(slot) ------------------>|                |              |
   |                 |                                |               |                |              |
   | 200 { success, data: { links } } |               |               |                |              |
   |<----------------|               |               |               |                |              |
```

## Key Design Decisions

1. **Browser Pool**: Pre-launches N Chromium instances at startup to avoid cold-start latency. Uses a simple slot-based semaphore with a FIFO wait queue.
2. **No Redis Dependency**: The key store uses a JSON file; the rate limiter uses in-memory state. This simplifies deployment (no external services) at the cost of horizontal scaling.
3. **Race-against-timeout**: Every extraction uses `Promise.race` between the actual work and a configurable timeout to prevent hung requests.
4. **Stealth**: Puppeteer runs with `--no-sandbox`, `--disable-web-security`, automation-controllable flags disabled, and `navigator.webdriver` overwritten to avoid detection.
5. **Two-Phase Extraction**: Stream IDs come from both the `embedhelper.php` response (base64-decoded JSON) and `admin-ajax.php` responses, with iframe URLs as a fallback.
