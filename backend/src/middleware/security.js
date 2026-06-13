const helmet = require('helmet');
const cors = require('cors');
const config = require('../config');

const allowedOrigins = config.ALLOWED_ORIGINS === '*'
  ? '*'
  : config.ALLOWED_ORIGINS.split(',').map((s) => s.trim());

const security = [
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  }),
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
];

module.exports = security;
