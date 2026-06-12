const puppeteer = require('puppeteer');
const config = require('../../config');

const pool = {
  slots: [],
  waitQueue: [],
};

let initialized = false;
let initializing = false;

async function spawnBrowser() {
  const launchOptions = {
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-extensions',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-background-timer-throttling',
      '--disable-renderer-backgrounding',
      '--disable-backgrounding-occluded-windows',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor',
      '--disable-blink-features=AutomationControlled',
      '--disable-infobars',
      '--window-size=1920,1080',
    ],
  };

  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    launchOptions.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
  }

  return puppeteer.launch(launchOptions);
}

async function acquireSlot() {
  const free = pool.slots.find((s) => !s.busy);
  if (free) {
    free.busy = true;
    return free;
  }
  return new Promise((resolve) => {
    pool.waitQueue.push(resolve);
  });
}

function releaseSlot(slot) {
  if (pool.waitQueue.length > 0) {
    const next = pool.waitQueue.shift();
    next(slot);
  } else {
    slot.busy = false;
  }
}

async function initPool() {
  if (initialized || initializing) return;
  initializing = true;

  const size = config.BROWSER_POOL_SIZE;
  console.log(`[BrowserPool] Spawning ${size} browser instance(s)…`);

  const browsers = await Promise.all(
    Array.from({ length: size }, () => spawnBrowser())
  );

  for (const browser of browsers) {
    pool.slots.push({ browser, busy: false });
  }

  initialized = true;
  initializing = false;
  console.log(`[BrowserPool] ${size} browser(s) ready.`);
}

async function withBrowser(fn) {
  if (!initialized) await initPool();

  const slot = await acquireSlot();

  try {
    if (!slot.browser.isConnected()) {
      console.warn('[BrowserPool] Replacing disconnected browser…');
      try { await slot.browser.close(); } catch {}
      slot.browser = await spawnBrowser();
    }

    return await fn(slot.browser);
  } finally {
    releaseSlot(slot);
  }
}

async function shutdownPool() {
  console.log('[BrowserPool] Shutting down…');
  await Promise.allSettled(pool.slots.map((s) => s.browser.close()));
  pool.slots = [];
  pool.waitQueue = [];
  initialized = false;
  initializing = false;
}

module.exports = { initPool, withBrowser, shutdownPool };
