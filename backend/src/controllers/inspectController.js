const config = require('../config');
const { withBrowser } = require('../services/extractor/browserPool');
const { extractLinks } = require('../services/extractor/domExtractor');

async function inspect(req, res, next) {
  const t0 = Date.now();
  const { url } = req.body;

  if (!url || typeof url !== 'string' || !url.trim()) {
    return res.status(400).json({ success: false, message: 'Missing required field: url' });
  }

  try { new URL(url.trim()); } catch {
    return res.status(400).json({ success: false, message: 'Invalid URL format' });
  }

  let result;
  try {
    result = await Promise.race([
      withBrowser((browser) => extractLinks(browser, url.trim())),
      new Promise((_, reject) => setTimeout(() => reject(new Error('EXTRACTION_TIMEOUT')), config.TOTAL_REQUEST_TIMEOUT_MS)),
    ]);
  } catch (err) {
    if (err.message === 'EXTRACTION_TIMEOUT') {
      return res.status(408).json({ success: false, message: 'Request timed out. Source page may be slow or unreachable.' });
    }
    console.error('[Inspect] Unexpected error:', err.message);
    return res.status(500).json({ success: false, message: 'An unexpected error occurred' });
  }

  if (!result.success) {
    return res.status(422).json({ success: false, message: result.error || 'No embed links found' });
  }

  const results = { rpm: result.rpm || null, p2p: result.p2p || null, upn: result.upn || null };

  return res.json({ success: true, url: url.trim(), results, request_time_ms: Date.now() - t0 });
}

module.exports = { inspect };
