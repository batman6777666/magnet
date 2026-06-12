# API Reference

## Base URL

```
https://your-space.hf.space
```

For local development:

```
http://localhost:3000
```

## Authentication

All endpoints under `/v1/` require an API key sent via the `X-API-Key` header.

```
X-API-Key: mk-m5z8abc-def1234567890abcdef1234567890-a1b2c3d4
```

Obtain an API key by calling `POST /auth/register`.

## Rate Limiting

- **Extract endpoints** (`/v1/extract`): Default 100 requests per 60-second sliding window per API key. Configurable via `RATE_LIMIT_WINDOW_MS` and `RATE_LIMIT_MAX`.
- **Registration** (`/auth/register`): 10 requests per hour per IP address (fixed).
- **Health and Inspect**: No rate limiting.

Rate limit headers are included in responses:

```
RateLimit-Limit: 100
RateLimit-Remaining: 95
RateLimit-Reset: 1623456789
```

## Response Format

### Success Envelope

```json
{
  "success": true,
  "data": { ... },
  "request_time_ms": 1234
}
```

### Error Envelope

```json
{
  "success": false,
  "error": "Human-readable error message",
  "code": "ERROR_CODE_STRING"
}
```

## Endpoints

---

### GET /health

Health check endpoint. No authentication required.

**Response 200:**

```json
{
  "status": "ok",
  "uptime": 123456
}
```

| Field | Type | Description |
|---|---|---|
| `status` | string | Always `"ok"` when the server is running |
| `uptime` | number | Server uptime in seconds |

**Error codes:** None (always returns 200 while server is running).

**Example:**

```bash
curl https://your-space.hf.space/health
```

---

### POST /auth/register

Register a new API key. No authentication required.

**Request Body:**

```json
{
  "name": "Your Name",
  "email": "user@example.com"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | Yes | 2-80 characters |
| `email` | string | No | Valid email format if provided |

**Response 201:**

```json
{
  "success": true,
  "message": "API key created successfully. Save it — it won't be shown again.",
  "data": {
    "api_key": "mk-m5z8abc-def1234567890abcdef1234567890-a1b2c3d4",
    "name": "Your Name",
    "created_at": "2026-06-12T12:00:00.000Z"
  }
}
```

**Error codes:**

| Status | Code | Condition |
|---|---|---|
| 400 | `INVALID_NAME` | Name is missing, under 2 chars, or over 80 chars |
| 400 | `INVALID_EMAIL` | Email provided but not valid format |
| 429 | `REGISTER_RATE_LIMITED` | More than 10 registration attempts per hour from same IP |
| 500 | `INTERNAL_ERROR` | Server-side key generation failure |

**Example:**

```bash
curl -X POST https://your-space.hf.space/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"My App","email":"admin@example.com"}'
```

---

### POST /v1/extract

Extract video embed links for a movie or series title. Requires authentication.

**Request Body:**

```json
{
  "type": "movie",
  "name": "The Matrix",
  "season": 1,
  "episode": 1
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `type` | string | Yes | Must be `"movie"` or `"series"` |
| `name` | string | Yes | Movie or series title |
| `season` | number | Only for `series` | Season number (defaults to 1) |
| `episode` | number | Only for `series` | Episode number (defaults to 1) |

**Response 200:**

```json
{
  "success": true,
  "request_time_ms": 2345,
  "data": {
    "type": "movie",
    "original_name": "The Matrix",
    "normalized_name": "the-matrix",
    "source_url": "https://multimovies.homes/movies/the-matrix/",
    "links": {
      "rpm": "https://multimovies.rpmhub.site/#abc123def",
      "p2p": "https://multimovies.p2pplay.pro/#ghi456jkl",
      "upn": "https://server1.uns.bio/#mno789pqr"
    },
    "generated_at": "2026-06-12T12:00:00.000Z"
  }
}
```

Any of the three links (`rpm`, `p2p`, `upn`) may be `null` if the server was not found.

**Error codes:**

| Status | Code | Condition |
|---|---|---|
| 400 | `MISSING_NAME` | `name` field is missing or empty |
| 400 | `INVALID_TYPE` | `type` is not `"movie"` or `"series"` |
| 400 | `MISSING_SEASON_EPISODE` | `type` is `series` but `season` or `episode` is not a positive number |
| 401 | `INVALID_API_KEY` | Missing or invalid `X-API-Key` header |
| 404 | `SOURCE_NOT_FOUND` | Source page returned no playable content |
| 408 | `TIMEOUT` | Request exceeded `TOTAL_REQUEST_TIMEOUT_MS` |
| 422 | `LINKS_NOT_FOUND` | Page loaded but no RPM/P2P/UPN links could be found |
| 429 | `RATE_LIMITED` | Rate limit exceeded for the API key |
| 500 | `INTERNAL_ERROR` | Unexpected server error |

**Example:**

```bash
curl -X POST https://your-space.hf.space/v1/extract \
  -H "Content-Type: application/json" \
  -H "X-API-Key: mk-m5z8abc-def1234567890abcdef1234567890-a1b2c3d4" \
  -d '{"type":"movie","name":"The Matrix"}'
```

```bash
# Series with season/episode
curl -X POST https://your-space.hf.space/v1/extract \
  -H "Content-Type: application/json" \
  -H "X-API-Key: mk-m5z8abc-def1234567890abcdef1234567890-a1b2c3d4" \
  -d '{"type":"series","name":"Breaking Bad","season":1,"episode":1}'
```

---

### POST /inspect

Inspect an arbitrary URL for embed links. No authentication required. Does not use the title normalizer — takes a raw URL.

**Request Body:**

```json
{
  "url": "https://multimovies.homes/movies/the-matrix/"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `url` | string | Yes | Full URL to a movie/series page on multimovies.homes |

**Response 200:**

```json
{
  "success": true,
  "url": "https://multimovies.homes/movies/the-matrix/",
  "results": {
    "rpm": "https://multimovies.rpmhub.site/#abc123def",
    "p2p": null,
    "upn": "https://server1.uns.bio/#mno789pqr"
  },
  "request_time_ms": 1234
}
```

**Error codes:**

| Status | Code | Condition |
|---|---|---|
| 400 | `MISSING_URL` | `url` field is missing |
| 400 | `INVALID_URL` | `url` is not a valid URL |
| 408 | `TIMEOUT` | Request timed out |
| 422 | — | No embed links found on the page |
| 500 | `INTERNAL_ERROR` | Unexpected server error |

**Example:**

```bash
curl -X POST https://your-space.hf.space/inspect \
  -H "Content-Type: application/json" \
  -d '{"url":"https://multimovies.homes/movies/inception/"}'
```

## Error Code Reference

| Code | HTTP Status | Description |
|---|---|---|
| `MISSING_NAME` | 400 | The `name` field is required and must be a non-empty string |
| `INVALID_TYPE` | 400 | The `type` field must be `"movie"` or `"series"` |
| `MISSING_SEASON_EPISODE` | 400 | Series requests require positive integer `season` and `episode` |
| `INVALID_NAME` | 400 | Name must be 2-80 characters |
| `INVALID_EMAIL` | 400 | Email format is invalid |
| `MISSING_URL` | 400 | The `url` field is required |
| `INVALID_URL` | 400 | The provided URL is malformed |
| `INVALID_API_KEY` | 401 | API key is missing, invalid, or revoked |
| `SOURCE_NOT_FOUND` | 404 | The source page could not be loaded or returned no content |
| `LINKS_NOT_FOUND` | 422 | Page loaded but no stream embed links were detected |
| `TIMEOUT` | 408 | Extraction exceeded the configured timeout (`TOTAL_REQUEST_TIMEOUT_MS`) |
| `RATE_LIMITED` | 429 | API key has exceeded allowed requests per window |
| `REGISTER_RATE_LIMITED` | 429 | IP has exceeded registration attempts per hour |
| `NOT_FOUND` | 404 | Route does not exist |
| `INTERNAL_ERROR` | 500 | Unexpected server-side error |

## Status Code Reference

| Code | Meaning | Usage |
|---|---|---|
| 200 | OK | Successful extraction, registration, or health check |
| 201 | Created | API key successfully registered |
| 400 | Bad Request | Missing or invalid request body fields |
| 401 | Unauthorized | Missing or invalid API key |
| 404 | Not Found | Route does not exist, or source page not found |
| 408 | Request Timeout | Extraction exceeded timeout limit |
| 422 | Unprocessable Entity | Page loaded but no links extracted |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Unexpected server failure |
