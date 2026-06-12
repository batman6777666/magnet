function validateInspect(data) {
  const errors = [];
  const { url } = data || {};

  if (!url || typeof url !== 'string' || !url.trim()) {
    errors.push({ field: 'url', message: 'Missing required field: url', code: 'MISSING_URL' });
    return errors;
  }

  try {
    new URL(url.trim());
  } catch {
    errors.push({ field: 'url', message: 'Invalid URL format', code: 'INVALID_URL' });
  }

  return errors.length ? errors : null;
}

module.exports = validateInspect;
