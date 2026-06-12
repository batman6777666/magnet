const keyService = require('../services/auth/keyService');

function register(req, res, next) {
  const { name, email } = req.body;

  try {
    const apiKey = keyService.createKey(name, email || null);

    console.log(`[Auth] New API key registered — Name: ${name.trim()}`);

    return res.status(201).json({
      success: true,
      message: 'API key created successfully. Save it — it won\'t be shown again.',
      data: {
        api_key: apiKey,
        name: name.trim(),
        created_at: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error('[Auth] Key creation failed:', err.message);
    return res.status(500).json({
      success: false,
      error: 'Failed to create API key. Please try again.',
      code: 'INTERNAL_ERROR',
    });
  }
}

module.exports = { register };
