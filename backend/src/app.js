const express = require('express');
const security = require('./middleware/security');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(security);

app.use(express.json({ limit: '10kb' }));

app.use(routes);

app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Route not found', code: 'NOT_FOUND' });
});

app.use(errorHandler);

module.exports = app;
