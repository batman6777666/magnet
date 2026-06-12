function errorHandler(err, req, res, _next) {
  const status = err.status || 500;
  const code = err.code || 'INTERNAL_ERROR';

  console.error(`[ERROR] ${req.method} ${req.path} → ${status} | ${err.message}`);

  res.status(status).json({
    success: false,
    error: status === 500 ? 'An unexpected error occurred' : err.message,
    code,
  });
}

module.exports = errorHandler;
