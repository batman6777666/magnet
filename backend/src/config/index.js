const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

module.exports = {
  PORT: parseInt(process.env.PORT || '3000', 10),

  API_KEYS: process.env.API_KEYS
    ? process.env.API_KEYS.split(',').map((k) => k.trim()).filter(Boolean)
    : [],

  BROWSER_POOL_SIZE: parseInt(process.env.BROWSER_POOL_SIZE || '5', 10),

  PAGE_LOAD_TIMEOUT_MS: parseInt(process.env.PAGE_LOAD_TIMEOUT_MS || '10000', 10),

  TOTAL_REQUEST_TIMEOUT_MS: parseInt(process.env.TOTAL_REQUEST_TIMEOUT_MS || '30000', 10),

  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),

  NODE_ENV: process.env.NODE_ENV || 'development',

  PUPPETEER_EXECUTABLE_PATH: process.env.PUPPETEER_EXECUTABLE_PATH || null,
};
