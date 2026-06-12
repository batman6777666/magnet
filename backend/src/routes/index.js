const { Router } = require('express');
const authMiddleware = require('../middleware/auth');
const rateLimiter = require('../middleware/rateLimiter');

const router = Router();

router.use('/health', require('./health'));
router.use('/auth', require('./auth'));
router.use('/', require('./inspect'));
router.use('/v1', authMiddleware, rateLimiter, require('./extract'));

module.exports = router;
