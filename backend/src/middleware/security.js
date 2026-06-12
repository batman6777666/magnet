const helmet = require('helmet');
const cors = require('cors');

const security = [
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  }),
  cors(),
];

module.exports = security;
