const { Router } = require('express');
const extractController = require('../controllers/extractController');

const router = Router();

router.post('/extract', extractController.extract);

module.exports = router;
