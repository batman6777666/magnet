const config = require('../../config');
const { STREAM_PATTERNS } = require('../../config/constants');

const PAGE_TIMEOUT = 15000;

function decodeBase64(s) {
  try { return Buffer.from(s, 'base64').toString('utf-8'); } catch { return null; }
}

const SERVER_KEY_MAP = {
  rpmshre: { type: 'rpm', domain: 'multimovies.rpmhub.site' },
  strmp2:  { type: 'p2p', domain: 'multimovies.p2pplay.pro' },
  upnshr:  { type: 'upn', domain: 'server1.uns.bio' },
};

function extractFromEmbedhelper(body) {
  const servers = {};
  try {
    const data = JSON.parse(body);
    if (!data.mresult) return servers;
    const decoded = decodeBase64(data.mresult);
    if (!decoded) return servers;
    const ids = JSON.parse(decoded);
    for (const [key, info] of Object.entries(SERVER_KEY_MAP)) {
      if (ids[key]) servers[info.type] = `https://${info.domain}/#${ids[key]}`;
    }
  } catch {}
  return servers;
}

async function createPage(browser) {
  const page = await browser.newPage();
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  );
  await page.setCacheEnabled(false);
  await page.setRequestInterception(true);

  page.on('request', (req) => {
    const url = req.url();
    const type = req.resourceType();
    if (
      type === 'image' || type === 'font' || type === 'stylesheet' || type === 'media' ||
      url.includes('google-analytics') || url.includes('googletagmanager') ||
      url.includes('doubleclick') || url.includes('facebook.com/tr') ||
      url.includes('secretlybluish') || url.includes('zoologyfibre') ||
      url.includes('hourcontributor') || url.includes('preferencenail') ||
      url.includes('aj2204') || url.includes('protrafficinspector')
    ) {
      req.abort().catch(() => {});
    } else {
      req.continue().catch(() => {});
    }
  });

  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
    window.chrome = { runtime: {} };
  });

  return page;
}

async function extractLinks(browser, targetUrl) {
  const t0 = Date.now();
  console.log(`[extract] START: ${targetUrl}`);

  let page = null;

  try {
    if (!browser) {
      return { success: false, code: 'INTERNAL_ERROR', error: 'Browser required' };
    }

    page = await createPage(browser);

    let embedhelperBody = null;
    let embedhelperResolve;
    const embedhelperReady = new Promise(r => { embedhelperResolve = r; });
    let adminAjaxBodies = [];

    page.on('response', async (resp) => {
      const url = resp.url();
      if (url.includes('embedhelper.php')) {
        try {
          embedhelperBody = await resp.text();
          embedhelperResolve();
        } catch {}
      } else if (url.includes('admin-ajax.php')) {
        try { adminAjaxBodies.push(await resp.text()); } catch {}
      }
    });

    await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: PAGE_TIMEOUT }).catch(() => {});

    for (let i = 0; i < 30; i++) {
      const title = await page.title();
      if (!title.includes('Just a moment') && !title.includes('Checking')) break;
      await new Promise(r => setTimeout(r, 500));
    }

    await page.waitForSelector('#playeroptionsul li[data-post]', { timeout: 6000 }).catch(() => {});

    await page.evaluate(() => {
      const active = document.querySelector('#playeroptionsul li.on');
      if (active) { active.click(); return; }
      const options = document.querySelectorAll('#playeroptionsul li[data-nume]');
      for (const opt of options) {
        if (opt.dataset.nume !== 'trailer') { opt.click(); return; }
      }
    });

    await Promise.race([
      embedhelperReady,
      new Promise(r => setTimeout(r, 12000)),
    ]);

    let servers = {};

    if (embedhelperBody) {
      servers = extractFromEmbedhelper(embedhelperBody);
      console.log(`[extract] embedhelper: ${JSON.stringify(servers)}`);
    }

    for (const body of adminAjaxBodies) {
      if (servers.rpm && servers.p2p && servers.upn) break;
      if (!body) continue;
      try {
        const data = JSON.parse(body);
        const embedUrl = data.embed_url || data.src || data.url || data.player_url || '';
        const rpmM = embedUrl.match(STREAM_PATTERNS.rpm);
        if (rpmM && !servers.rpm) servers.rpm = `https://multimovies.rpmhub.site/#${rpmM[1]}`;
        const p2pM = embedUrl.match(STREAM_PATTERNS.p2p);
        if (p2pM && !servers.p2p) servers.p2p = `https://multimovies.p2pplay.pro/#${p2pM[1]}`;
        const upnM = embedUrl.match(STREAM_PATTERNS.upn);
        if (upnM && !servers.upn) servers.upn = `https://server1.uns.bio/#${upnM[1]}`;
      } catch {}
    }

    for (const frame of page.frames()) {
      const url = frame.url();
      if (!servers.rpm) {
        const m = url.match(STREAM_PATTERNS.rpm);
        if (m) servers.rpm = `https://multimovies.rpmhub.site/#${m[1]}`;
      }
      if (!servers.p2p) {
        const m = url.match(STREAM_PATTERNS.p2p);
        if (m) servers.p2p = `https://multimovies.p2pplay.pro/#${m[1]}`;
      }
      if (!servers.upn) {
        const m = url.match(STREAM_PATTERNS.upn);
        if (m) servers.upn = `https://server1.uns.bio/#${m[1]}`;
      }
    }

    if (!servers.rpm && !servers.p2p && !servers.upn) {
      console.log(`[extract] No server URLs found after ${Date.now() - t0}ms`);
      return { success: false, code: 'LINKS_NOT_FOUND', error: 'No embed links found' };
    }

    console.log(`[extract] SUCCESS in ${Date.now() - t0}ms`);
    console.log(`  rpm: ${servers.rpm || 'null'}`);
    console.log(`  p2p: ${servers.p2p || 'null'}`);
    console.log(`  upn: ${servers.upn || 'null'}`);

    return {
      success: true,
      rpm: servers.rpm || null,
      p2p: servers.p2p || null,
      upn: servers.upn || null,
    };

  } catch (err) {
    console.error(`[extract] ERROR: ${err.message}`);
    return { success: false, code: 'INTERNAL_ERROR', error: err.message };
  } finally {
    if (page) { try { await page.close(); } catch {} }
  }
}

module.exports = { extractLinks };
