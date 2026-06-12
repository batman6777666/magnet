const { Router } = require('express');
const rateLimit = require('express-rate-limit');
const authController = require('../controllers/authController');
const validate = require('../middleware/validate');
const validateAuth = require('../validators/authValidator');

const router = Router();

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip,
  handler: (_req, res) => {
    res.status(429).json({
      success: false,
      error: 'Too many registration attempts. Try again in an hour.',
      code: 'REGISTER_RATE_LIMITED',
    });
  },
});

router.post('/register', registerLimiter, validate(validateAuth), authController.register);

module.exports = router;
