# Deployment

## Backend: Hugging Face Spaces

### Prerequisites

- A [Hugging Face](https://huggingface.co) account
- Git installed and configured
- Docker (optional, for local testing)

### Setup Steps

1. **Create a new Space**

   - Go to https://huggingface.co/spaces
   - Click "Create new Space"
   - Configure:
     - **Space name**: `magnet-api` (or your choice)
     - **License**: MIT
     - **SDK**: Docker
     - **Visibility**: Public or Private

2. **Upload files**

   Upload only these files and directories:

   ```
   Dockerfile
   .dockerignore
   backend/
   ```

   The `Dockerfile` copies from `backend/` internally.

   **Do NOT upload:**
   - `node_modules/`
   - `.env` (use Space Secrets instead)
   - `frontend/`
   - `.git/`
   - `data/keys.json` (generated at runtime)

3. **Configure Docker**

   The existing `Dockerfile` uses `node:20-slim`, installs Chromium and its dependencies, sets `PUPPETEER_SKIP_DOWNLOAD=true`, and uses the system Chromium at `/usr/bin/chromium`.

4. **Set environment secrets**

   In the Space settings, go to **Settings > Repository Secrets** and add:

   | Variable | Required | Default | Description |
   |---|---|---|---|
   | `API_KEYS` | Yes | — | Comma-separated static API keys for pre-authorized access |
   | `BROWSER_POOL_SIZE` | No | `1` | Number of Chromium instances (use `1` on free tier) |
   | `PAGE_LOAD_TIMEOUT_MS` | No | `15000` | Per-page navigation timeout |
   | `TOTAL_REQUEST_TIMEOUT_MS` | No | `30000` | Maximum extraction pipeline time |
   | `RATE_LIMIT_WINDOW_MS` | No | `60000` | Rate limit sliding window |
   | `RATE_LIMIT_MAX` | No | `100` | Max requests per window |
   | `PUPPETEER_EXECUTABLE_PATH` | No | `/usr/bin/chromium` | Chromium binary path (set in Dockerfile) |

5. **Monitor build logs**

   After pushing, go to the Space "Logs" tab. The first build takes 3-5 minutes to install Chromium deps.

6. **Verify health**

   ```bash
   curl https://your-username-magnet-api.hf.space/health
   ```

   Expected response:
   ```json
   {"status":"ok","uptime":42}
   ```

### Hardware Recommendations

- **Free tier (cpu-basic)**: Set `BROWSER_POOL_SIZE=1`, expect 5-15 second extraction times
- **cpu-upgrade**: Can handle `BROWSER_POOL_SIZE=2` or `3`

---

## Frontend: Cloudflare Pages

### Prerequisites

- A [Cloudflare](https://cloudflare.com) account
- Git repository connected

### Setup Steps

1. Go to Cloudflare Dashboard > **Pages**
2. Click **Create a project** > **Connect to Git**
3. Select your repository
4. Configure build settings:

   | Setting | Value |
   |---|---|
   | **Build command** | `npm run build` |
   | **Build output directory** | `dist/` |
   | **Root directory** | `frontend/` |

5. **Environment variables** (add in Pages dashboard):

   | Variable | Value | Example |
   |---|---|---|
   | `VITE_API_BASE` | Backend base URL | `https://your-username-magnet-api.hf.space` |

6. **Deploy** — Cloudflare will build and deploy automatically on every push to the default branch.

### Custom Domain

1. In the Pages project, go to **Custom domains**
2. Add your domain (e.g., `magnet.example.com`)
3. Configure DNS (Cloudflare manages this automatically)

---

## Docker Reference (Local Testing)

### Build

```bash
docker build -t magnet-api .
```

### Run

```bash
docker run -d \
  --name magnet-api \
  -p 7860:7860 \
  -e PORT=7860 \
  -e NODE_ENV=production \
  -e API_KEYS=sk_live_key1,sk_live_key2 \
  -e BROWSER_POOL_SIZE=1 \
  -e PAGE_LOAD_TIMEOUT_MS=15000 \
  -e TOTAL_REQUEST_TIMEOUT_MS=30000 \
  -e RATE_LIMIT_WINDOW_MS=60000 \
  -e RATE_LIMIT_MAX=100 \
  magnet-api
```

### Health Check

Docker includes a built-in health check:

```dockerfile
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:7860/health || exit 1
```

Manual check:

```bash
curl http://localhost:7860/health
```

---

## Troubleshooting

| Problem | Likely Cause | Solution |
|---|---|---|
| Space won't start | Missing Chromium deps | Check build logs; ensure `apt-get install chromium` succeeded |
| Browser crashes | Out of memory | Reduce `BROWSER_POOL_SIZE` to `1`; upgrade hardware tier |
| 502 Bad Gateway | App still starting | Wait 30-60s for Chromium to initialize |
| Extraction times out | Target site slow / blocked | Increase `PAGE_LOAD_TIMEOUT_MS` and `TOTAL_REQUEST_TIMEOUT_MS` |
| `wget: not found` | Alpine-based image | Use `node:20-slim` (Debian-based) or install `wget` |
| Port errors | PORT mismatch | Ensure `PORT=7860` is set (Hugging Face expects port 7860) |
| `PUPPETEER_EXECUTABLE_PATH` not set | Chromium not found | Set to `/usr/bin/chromium` in Docker environment |
