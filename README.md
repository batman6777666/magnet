# Magnet

[![Status](https://img.shields.io/badge/status-active-brightgreen)]()
[![Version](https://img.shields.io/badge/version-2.0.0-blue)]()
[![License](https://img.shields.io/badge/license-MIT-green)]()

Video embed link extractor API — extracts streaming server links (RPM, P2P, UPN) from multimovies.homes for any movie or series title.

## Features

- Movie and series title extraction via normalized URL slugs
- Server pool of headless Chromium browsers for concurrent requests
- Multi-source extraction from `embedhelper.php`, `admin-ajax.php`, and iframe frames
- Rate limiting per API key with configurable windows
- API key registration and revocation
- URL inspection mode (no authentication required)
- Health monitoring endpoint
- Docker support for production deployment

## Architecture

Magnet is split into two components: a Node.js/Express/Puppeteer backend that scrapes the target site, and a React/Vite/TypeScript frontend that provides a user interface. The backend manages a configurable pool of Chromium browser instances, normalizes movie/series names into URL slugs, navigates to the target page, intercepts network responses, and extracts RPM, P2P, and UPN stream embed links. API keys are stored in a JSON file with a DB-ready abstraction layer.

## Quick Start

```bash
git clone https://github.com/your-username/magnet.git
cd magnet/backend && npm install
cp .env.example .env   # edit API_KEYS and other settings
npm run dev            # starts on http://localhost:3000
```

## API Overview

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/health` | No | Health check |
| `POST` | `/auth/register` | No | Register a new API key |
| `POST` | `/v1/extract` | Yes | Extract embed links for a movie/series |
| `POST` | `/inspect` | No | Extract embed links from a raw URL |

## Documentation

- [Architecture](docs/architecture.md) — System design, data flow, sequence diagrams
- [API Reference](docs/api-reference.md) — Endpoints, request/response formats, error codes
- [Deployment](docs/deployment.md) — Hugging Face Spaces + Cloudflare Pages setup
- [Security](docs/security.md) — Key management, rate limiting, input validation
- [Development](docs/development.md) — Local setup, project structure, troubleshooting
- [Contributing](docs/contributing.md) — Contribution guide, PR checklist, conventions

## Tech Stack

| Layer | Technology |
|---|---|
| Backend runtime | Node.js 20+ |
| Backend framework | Express 4.x |
| Browser automation | Puppeteer 23.x |
| Security | Helmet, CORS, express-rate-limit |
| Storage | JSON file (key store) |
| Frontend | React 18, TypeScript 5, Tailwind CSS 3 |
| Frontend build | Vite 5 |
| Deployment | Docker / Hugging Face Spaces / Cloudflare Pages |

## Deployment

- **Backend**: Deploy Docker image to Hugging Face Spaces (see [docs/deployment.md](docs/deployment.md))
- **Frontend**: Deploy to Cloudflare Pages (see [docs/deployment.md](docs/deployment.md))

## License

MIT
