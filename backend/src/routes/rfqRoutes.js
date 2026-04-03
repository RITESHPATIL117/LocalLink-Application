const express = require('express');
const router = express.Router();
const rfqController = require('../controllers/rfqController');
const { optionalAuth } = require('../middlewares/authMiddleware');

// Broadcast an RFQ to all businesses in a category/subcategory
router.post('/broadcast', optionalAuth, rfqController.broadcastRFQ);

module.exports = router;
