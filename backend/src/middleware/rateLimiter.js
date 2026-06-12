const rateLimit = require('express-rate-limit');
const config = require('../config');
const { ERROR_CODES } = require('../config/constants');

const rateLimiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.headers['x-api-key'] || req.ip,
  handler: (_req, res) => {
    res.status(429).json({
      success: false,
      error: `Rate limit exceeded: ${config.RATE_LIMIT_MAX} requests per ${config.RATE_LIMIT_WINDOW_MS / 1000}s`,
      code: ERROR_CODES.RATE_LIMITED,
    });
  },
});

module.exports = rateLimiter;
