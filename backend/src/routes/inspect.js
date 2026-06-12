const { Router } = require('express');
const inspectController = require('../controllers/inspectController');

const router = Router();

router.post('/inspect', inspectController.inspect);

module.exports = router;
