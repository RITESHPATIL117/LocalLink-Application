const express = require('express');
const router = express.Router();
const { sendLead, getLeadsByBusiness, getLeadsByUser, updateLeadStatus } = require('../controllers/leadController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', sendLead); // Public can send leads
router.get('/user', protect, getLeadsByUser);
router.get('/business/:businessId', protect, getLeadsByBusiness);
router.patch('/:id/status', protect, updateLeadStatus);

module.exports = router;
