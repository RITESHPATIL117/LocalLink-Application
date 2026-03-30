const express = require('express');
const router = express.Router();
const { sendLead, getLeadsByBusiness, getLeadsByUser, updateLeadStatus } = require('../controllers/leadController');
const { protect, optionalAuth } = require('../middlewares/authMiddleware');

router.post('/', optionalAuth, sendLead); // Public can send leads, authenticated users are linked
router.get('/user', protect, getLeadsByUser);
router.get('/business/:businessId', protect, getLeadsByBusiness);
router.patch('/:id/status', protect, updateLeadStatus);

module.exports = router;
