const config = require('../config');
const { ERROR_CODES } = require('../config/constants');
const { normalizeName, buildUrl } = require('../services/extractor/normalizer');
const { withBrowser } = require('../services/extractor/browserPool');
const { extractLinks } = require('../services/extractor/domExtractor');

async function extract(req, res, next) {
  const t0 = Date.now();
  const { type, name, season, episode } = req.body;

  let parsedSeason = 1;
  let parsedEpisode = 1;

  if (type === 'series') {
    const rawSeason = parseInt(season, 10);
    const rawEpisode = parseInt(episode, 10);

    if (rawSeason >= 1) parsedSeason = rawSeason;
    if (rawEpisode >= 1) parsedEpisode = rawEpisode;
  }

  const originalName = name.trim();
  const normalizedName = normalizeName(originalName);
  const sourceUrl = buildUrl(type, normalizedName, parsedSeason, parsedEpisode);
  console.log(`[extract] name="${originalName}" normalized="${normalizedName}" season=${parsedSeason} episode=${parsedEpisode} url="${sourceUrl}"`);

  let result;

  try {
    result = await Promise.race([
      withBrowser((browser) => extractLinks(browser, sourceUrl)),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error('EXTRACTION_TIMEOUT')),
          config.TOTAL_REQUEST_TIMEOUT_MS
        )
      ),
    ]);
  } catch (err) {
    if (err.message === 'EXTRACTION_TIMEOUT') {
      return res.status(408).json({
        success: false,
        error: 'Request timed out. Source page may be slow or unreachable.',
        code: ERROR_CODES.TIMEOUT,
      });
    }

    console.error('[Extract] Unexpected error:', err.message);
    return res.status(500).json({
      success: false,
      error: 'An unexpected error occurred',
      code: ERROR_CODES.INTERNAL_ERROR,
    });
  }

  if (!result.success) {
    const statusMap = {
      SOURCE_NOT_FOUND: 404,
      LINKS_NOT_FOUND: 422,
    };
    return res.status(statusMap[result.code] || 500).json({
      success: false,
      error: result.error,
      code: result.code,
    });
  }

  const links = {
    rpm: result.rpm || null,
    p2p: result.p2p || null,
    upn: result.upn || null,
  };

  return res.json({
    success: true,
    request_time_ms: Date.now() - t0,
    data: {
      type,
      original_name: originalName,
      normalized_name: normalizedName,
      source_url: sourceUrl,
      links,
      generated_at: new Date().toISOString(),
    },
  });
}

module.exports = { extract };
