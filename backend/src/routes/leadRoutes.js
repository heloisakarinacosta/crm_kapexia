const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');

// GET /api/leads/count?period=today|week|month|range&start=YYYY-MM-DD&end=YYYY-MM-DD
router.get('/count', leadController.getLeadsCountPorPeriodo);

module.exports = router; 